"use client";

import { useState, useEffect } from "react";
import { WmDisclaimer } from "@/components/wm/wm-disclaimer";
import { WmScreenshotImport, WmScreenshotImportSkeleton } from "@/components/wm/wm-screenshot-import";

export default function PortfolioImportPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 pb-10 sm:p-6">
      {/* Top-level Disclaimer */}
      <WmDisclaimer variant="general" isLoading={isLoading} />

      {/* Screenshot Import */}
      {isLoading ? (
        <WmScreenshotImportSkeleton />
      ) : (
        <WmScreenshotImport />
      )}
    </div>
  );
}
