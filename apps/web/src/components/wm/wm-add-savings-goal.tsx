"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Plus,
  CalendarBlank,
  Shield,
  AirplaneTilt,
  Laptop,
  Confetti,
  Heart,
  GraduationCap,
  DeviceMobile,
  House,
  Lock,
  Target,
  Wallet,
} from "@phosphor-icons/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

// ── Icon presets ────────────────────────────────────────────────────

const ICON_PRESETS = [
  { id: "shield", label: "Shield", icon: Shield },
  { id: "plane", label: "Plane", icon: AirplaneTilt },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "party-popper", label: "Party", icon: Confetti },
  { id: "heart", label: "Heart", icon: Heart },
  { id: "graduation-cap", label: "Education", icon: GraduationCap },
  { id: "smartphone", label: "Phone", icon: DeviceMobile },
  { id: "home", label: "Home", icon: House },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "target", label: "Target", icon: Target },
] as const;

const COLOR_PRESETS = [
  "#5B9A6D",
  "#E8614D",
  "#2563EB",
  "#D4A843",
  "#EC4899",
  "#8B5CF6",
  "#5C3D2E",
  "#0EA5E9",
  "#F59E0B",
  "#14B8A6",
];

const PRESET_SUGGESTIONS = [
  "Emergency Fund",
  "Japa Fund",
  "Detty December",
  "School Fees",
  "Wedding",
  "New Phone",
  "Rent Deposit",
];

// ── Main component ──────────────────────────────────────────────────

interface WmAddSavingsGoalProps {
  onAdd?: (goal: {
    name: string;
    targetAmount: number;
    currency: string;
    targetDate: Date;
    icon: string;
    color: string;
    isLocked: boolean;
    lockUntil?: Date;
  }) => void;
}

function WmAddSavingsGoal({ onAdd }: WmAddSavingsGoalProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [targetAmount, setTargetAmount] = React.useState("");
  const [currency, setCurrency] = React.useState("NGN");
  const [targetDate, setTargetDate] = React.useState<Date | undefined>();
  const [targetDateOpen, setTargetDateOpen] = React.useState(false);
  const [icon, setIcon] = React.useState("target");
  const [color, setColor] = React.useState(COLOR_PRESETS[0]!);
  const [isLocked, setIsLocked] = React.useState(false);
  const [lockUntil, setLockUntil] = React.useState<Date | undefined>();
  const [lockDateOpen, setLockDateOpen] = React.useState(false);

  const resetForm = () => {
    setName("");
    setTargetAmount("");
    setCurrency("NGN");
    setTargetDate(undefined);
    setIcon("target");
    setColor(COLOR_PRESETS[0]!);
    setIsLocked(false);
    setLockUntil(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) return;

    onAdd?.({
      name,
      targetAmount: parseFloat(targetAmount),
      currency,
      targetDate,
      icon,
      color,
      isLocked,
      lockUntil: isLocked ? lockUntil : undefined,
    });

    resetForm();
    setOpen(false);
  };

  const isValid = name.length > 0 && parseFloat(targetAmount) > 0 && targetDate;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Savings Goal</DialogTitle>
          <DialogDescription>
            Set up a new savings goal to track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Preset suggestions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Quick start
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-accent",
                    name === preset && "border-primary bg-primary/10 text-primary"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              placeholder="e.g. Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Target Amount + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="target-amount">Target Amount</Label>
              <Input
                id="target-amount"
                type="number"
                placeholder="500,000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                      {cur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Date */}
          <div className="space-y-2">
            <Label>Target Date</Label>
            <Popover open={targetDateOpen} onOpenChange={setTargetDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-2 text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarBlank className="size-4" />
                  {targetDate
                    ? format(targetDate, "PPP")
                    : "Pick a target date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={(date) => {
                    setTargetDate(date);
                    setTargetDateOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Icon selector */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {ICON_PRESETS.map((preset) => {
                const IconComp = preset.icon;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setIcon(preset.id)}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg border transition-colors hover:bg-accent",
                      icon === preset.id &&
                        "border-primary bg-primary/10"
                    )}
                    title={preset.label}
                  >
                    <IconComp
                      className="size-4"
                      style={{
                        color: icon === preset.id ? color : undefined,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color selector */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "size-7 rounded-full border-2 transition-transform hover:scale-110",
                    color === c
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Lock option */}
          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-muted-foreground" />
                <Label htmlFor="lock-toggle" className="cursor-pointer text-sm">
                  Lock this goal?
                </Label>
              </div>
              <button
                type="button"
                id="lock-toggle"
                role="switch"
                aria-checked={isLocked}
                onClick={() => setIsLocked(!isLocked)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
                  isLocked ? "bg-primary" : "bg-input"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
                    isLocked ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
            {isLocked && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Lock until date (funds cannot be withdrawn before this date)
                </Label>
                <Popover open={lockDateOpen} onOpenChange={setLockDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start gap-2 text-left font-normal",
                        !lockUntil && "text-muted-foreground"
                      )}
                    >
                      <CalendarBlank className="size-3.5" />
                      {lockUntil
                        ? format(lockUntil, "PPP")
                        : "Pick lock-until date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={lockUntil}
                      onSelect={(date) => {
                        setLockUntil(date);
                        setLockDateOpen(false);
                      }}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              Create Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { WmAddSavingsGoal };
