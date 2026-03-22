"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UploadSimple,
  Camera,
  Check,
  X,
  SpinnerGap,
  Image as ImageIcon,
  PencilSimple,
  DeviceMobile,
  Warning,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currencies";
import { WmDisclaimer } from "./wm-disclaimer";
import { SCREENSHOT_IMPORT_DISCLAIMER } from "@/lib/disclaimers";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

// ── Types ───────────────────────────────────────────────────────────
interface ExtractedHolding {
  id: string;
  name: string;
  ticker: string;
  quantity: number | null;
  value: number;
  currency: string;
  isEditing: boolean;
}

type ImportState = "idle" | "uploading" | "processing" | "review" | "confirmed" | "error";

// ── Supported Platforms ─────────────────────────────────────────────
const SUPPORTED_PLATFORMS = [
  { name: "Cowrywise", color: "hsl(210, 70%, 50%)" },
  { name: "Trading 212", color: "hsl(140, 50%, 40%)" },
  { name: "Bamboo", color: "hsl(25, 80%, 55%)" },
  { name: "eToro", color: "hsl(160, 60%, 40%)" },
  { name: "Risevest", color: "hsl(7.7, 77.1%, 60.6%)" },
  { name: "ARM Pension", color: "hsl(19.6, 33.3%, 27.1%)" },
  { name: "NLPC Pension", color: "hsl(41.8, 62.8%, 54.7%)" },
  { name: "Any investment app", color: "hsl(280, 30%, 55%)" },
];

// ── Skeleton ────────────────────────────────────────────────────────
function WmScreenshotImportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────
interface WmScreenshotImportProps {
  isLoading?: boolean;
  className?: string;
  onComplete?: () => void;
}

function WmScreenshotImport({ isLoading = false, className, onComplete }: WmScreenshotImportProps) {
  const [state, setState] = useState<ImportState>("idle");
  const [holdings, setHoldings] = useState<ExtractedHolding[]>([]);
  const [detectedPlatform, setDetectedPlatform] = useState("Unknown");
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [importId, setImportId] = useState<Id<"screenshotImports"> | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convex mutations and actions
  const generateUploadUrl = useMutation(api.screenshotImport.generateUploadUrl);
  const createImportRecord = useMutation(api.screenshotImport.createImportRecord);
  const analyzeScreenshot = useAction(api.screenshotImport.analyzeScreenshot);
  const saveExtractedHoldings = useMutation(api.screenshotImport.saveExtractedHoldings);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, or WEBP)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Maximum size is 10MB.");
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);

      setState("uploading");
      setErrorMessage("");

      try {
        // 1. Get upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // 2. Upload the file to Convex storage
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await uploadResponse.json();

        // 3. Create import record
        const recordId = await createImportRecord({ imageStorageId: storageId });
        setImportId(recordId);

        // 4. Process with AI
        setState("processing");
        const result = await analyzeScreenshot({
          imageStorageId: storageId,
          importId: recordId,
        });

        // 5. Show results for review
        if (result.holdings.length === 0) {
          setState("error");
          setErrorMessage(
            "No investment holdings could be detected in this image. Please make sure the screenshot shows your portfolio or investment list."
          );
          return;
        }

        setDetectedPlatform(result.platform);
        setHoldings(
          result.holdings.map((h: any, idx: number) => ({
            id: `ext-${idx}`,
            name: h.name,
            ticker: h.ticker || "",
            quantity: h.quantity,
            value: h.value,
            currency: h.currency,
            isEditing: false,
          }))
        );
        setState("review");
      } catch (error: any) {
        console.error("Screenshot import error:", error);
        setState("error");
        setErrorMessage(
          error.message || "Something went wrong while analyzing your screenshot. Please try again."
        );
      }
    },
    [generateUploadUrl, createImportRecord, analyzeScreenshot]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragActive(false);
  }, []);

  const handleFileClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [processFile]
  );

  const toggleEdit = useCallback((id: string) => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isEditing: !h.isEditing } : h))
    );
  }, []);

  const updateHolding = useCallback(
    (id: string, field: keyof ExtractedHolding, value: string | number | null) => {
      setHoldings((prev) =>
        prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
      );
    },
    []
  );

  const removeHolding = useCallback((id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!importId || holdings.length === 0) return;

    try {
      await saveExtractedHoldings({
        importId,
        platform: detectedPlatform,
        holdings: holdings.map((h) => ({
          name: h.name,
          ticker: h.ticker || undefined,
          quantity: h.quantity || undefined,
          value: h.value,
          currency: h.currency,
        })),
      });

      setState("confirmed");
      toast.success(
        `${holdings.length} holding${holdings.length !== 1 ? "s" : ""} imported from ${detectedPlatform} -- net worth updated!`
      );
      onComplete?.();
    } catch (error: any) {
      toast.error("Failed to save holdings. Please try again.");
      console.error("Save error:", error);
    }
  }, [importId, holdings, detectedPlatform, saveExtractedHoldings, onComplete]);

  const handleReset = useCallback(() => {
    setState("idle");
    setHoldings([]);
    setDetectedPlatform("Unknown");
    setErrorMessage("");
    setImportId(null);
    setPreviewUrl(null);
  }, []);

  if (isLoading) {
    return <WmScreenshotImportSkeleton />;
  }

  return (
    <div className={cn("space-y-8", className)}>
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary/10">
          <Camera className="size-8 text-secondary" />
        </div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Import your investments with a screenshot
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Take a screenshot of your investment app, upload it here, and our AI
          will extract your holdings automatically.
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-3">
        {[
          {
            step: 1,
            title: "Screenshot your app",
            desc: "Cowrywise, Trading 212, Bamboo, or any investment app",
            icon: <DeviceMobile className="size-5" />,
          },
          {
            step: 2,
            title: "Upload here",
            desc: "Drag and drop or click to upload your screenshot",
            icon: <UploadSimple className="size-5" />,
          },
          {
            step: 3,
            title: "AI extracts holdings",
            desc: "Review and confirm the extracted data before saving",
            icon: <Check className="size-5" />,
          },
        ].map((item) => (
          <div
            key={item.step}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Step {item.step}
              </p>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Supported Platforms */}
      <div>
        <h3 className="mb-3 text-center text-sm font-medium text-muted-foreground">
          Supported platforms
        </h3>
        <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
          {SUPPORTED_PLATFORMS.map((platform) => (
            <Badge
              key={platform.name}
              variant="outline"
              className="px-3 py-1.5 text-xs"
            >
              <div
                className="mr-1.5 size-2 rounded-full"
                style={{ backgroundColor: platform.color }}
              />
              {platform.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* State Machine UI */}
      <AnimatePresence mode="wait">
        {/* Upload Zone */}
        {(state === "idle" || state === "uploading") && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              onClick={state === "idle" ? handleFileClick : undefined}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "relative mx-auto max-w-xl cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                dragActive
                  ? "border-secondary bg-secondary/5"
                  : "border-border hover:border-secondary/50 hover:bg-muted/30",
                state === "uploading" && "pointer-events-none opacity-60"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              {state === "uploading" ? (
                <div className="flex flex-col items-center gap-3">
                  <SpinnerGap className="size-10 animate-spin text-secondary" />
                  <p className="text-sm font-medium">Uploading screenshot...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-xl bg-muted p-3">
                    <ImageIcon className="size-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Drop your screenshot here, or click to upload
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG, or WEBP. Max 10MB.
                    </p>
                  </div>
                  {/* Mobile camera button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="sm:hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera className="mr-1.5 size-4" />
                    Take Photo
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-xl"
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-10">
                {previewUrl && (
                  <div className="mb-2 overflow-hidden rounded-lg border">
                    <img
                      src={previewUrl}
                      alt="Uploaded screenshot"
                      className="max-h-48 w-auto object-contain"
                    />
                  </div>
                )}
                <div className="relative">
                  <SpinnerGap className="size-12 animate-spin text-secondary" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Analyzing your screenshot...</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our AI is extracting your investment holdings. This usually
                    takes 5-15 seconds.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Error State */}
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-xl"
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-10">
                <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
                  <Warning className="size-8 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Could not process screenshot</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Review State */}
        {state === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">
                    Review Extracted Holdings
                  </CardTitle>
                  {detectedPlatform && detectedPlatform !== "Unknown" && (
                    <Badge variant="secondary" className="text-xs">
                      {detectedPlatform}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  Please verify the data below. Click the edit icon to make
                  corrections before saving.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {previewUrl && (
                  <div className="mx-auto mb-4 overflow-hidden rounded-lg border">
                    <img
                      src={previewUrl}
                      alt="Uploaded screenshot"
                      className="max-h-32 w-auto object-contain"
                    />
                  </div>
                )}

                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Name</TableHead>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.map((holding) => (
                        <TableRow key={holding.id}>
                          <TableCell>
                            {holding.isEditing ? (
                              <Input
                                value={holding.name}
                                onChange={(e) =>
                                  updateHolding(holding.id, "name", e.target.value)
                                }
                                className="h-7 text-xs"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {holding.name}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {holding.isEditing ? (
                              <Input
                                value={holding.ticker}
                                onChange={(e) =>
                                  updateHolding(holding.id, "ticker", e.target.value)
                                }
                                className="h-7 w-20 text-xs"
                              />
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                {holding.ticker || "N/A"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {holding.isEditing ? (
                              <Input
                                type="number"
                                value={holding.quantity ?? ""}
                                onChange={(e) =>
                                  updateHolding(
                                    holding.id,
                                    "quantity",
                                    e.target.value ? Number(e.target.value) : null
                                  )
                                }
                                className="h-7 w-16 text-xs"
                              />
                            ) : (
                              holding.quantity ?? "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {holding.isEditing ? (
                              <Input
                                type="number"
                                value={holding.value}
                                onChange={(e) =>
                                  updateHolding(
                                    holding.id,
                                    "value",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-7 w-24 text-xs"
                              />
                            ) : (
                              <span className="font-medium">
                                {formatCurrency(holding.value, holding.currency)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {holding.isEditing ? (
                              <Input
                                value={holding.currency}
                                onChange={(e) =>
                                  updateHolding(
                                    holding.id,
                                    "currency",
                                    e.target.value.toUpperCase()
                                  )
                                }
                                className="h-7 w-16 text-xs"
                              />
                            ) : (
                              <Badge variant="outline" className="text-[10px]">
                                {holding.currency}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleEdit(holding.id)}
                                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                              >
                                {holding.isEditing ? (
                                  <Check className="size-3.5" />
                                ) : (
                                  <PencilSimple className="size-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => removeHolding(holding.id)}
                                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                              >
                                <X className="size-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    {holdings.length} holding{holdings.length !== 1 ? "s" : ""}{" "}
                    extracted
                    {detectedPlatform !== "Unknown"
                      ? ` from ${detectedPlatform}`
                      : ""}
                    . Review and edit before confirming.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                    >
                      Retake
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleConfirm}
                      disabled={holdings.length === 0}
                    >
                      <Check className="mr-1.5 size-3.5" />
                      Confirm & Add
                    </Button>
                  </div>
                </div>

                <WmDisclaimer variant="analysis" />
                <p className="text-center text-[10px] text-muted-foreground">
                  {SCREENSHOT_IMPORT_DISCLAIMER}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirmed State */}
        {state === "confirmed" && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl"
          >
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-10">
                <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
                  <Check className="size-8 text-success" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">Holdings imported!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {holdings.length} holding
                    {holdings.length !== 1 ? "s" : ""} from{" "}
                    {detectedPlatform !== "Unknown"
                      ? detectedPlatform
                      : "your portfolio"}{" "}
                    have been added. Your net worth is now updated.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Import Another
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/all-my-money">View Dashboard</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Disclaimer */}
      <WmDisclaimer variant="analysis" />
    </div>
  );
}

export { WmScreenshotImport, WmScreenshotImportSkeleton };
