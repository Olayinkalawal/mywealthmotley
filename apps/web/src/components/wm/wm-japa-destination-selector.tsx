"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export interface JapaDestination {
  value: string;
  label: string;
  flag: string;
  visaType: string;
}

const JAPA_DESTINATIONS: JapaDestination[] = [
  { value: "uk_skilled_worker", label: "UK Skilled Worker", flag: "\uD83C\uDDEC\uD83C\uDDE7", visaType: "skilled_worker" },
  { value: "canada_pr", label: "Canada PR", flag: "\uD83C\uDDE8\uD83C\uDDE6", visaType: "canada_pr" },
  { value: "us_student", label: "US Student", flag: "\uD83C\uDDFA\uD83C\uDDF8", visaType: "us_student" },
  { value: "germany_blue_card", label: "Germany Blue Card", flag: "\uD83C\uDDE9\uD83C\uDDEA", visaType: "germany_blue_card" },
  { value: "uae_work", label: "UAE", flag: "\uD83C\uDDE6\uD83C\uDDEA", visaType: "uae_work" },
  { value: "australia_skilled", label: "Australia", flag: "\uD83C\uDDE6\uD83C\uDDFA", visaType: "australia_skilled" },
  { value: "south_africa_work", label: "South Africa", flag: "\uD83C\uDDFF\uD83C\uDDE6", visaType: "south_africa_work" },
];

interface WmJapaDestinationSelectorProps {
  value: string;
  onValueChange: (value: string, destination: JapaDestination) => void;
  isLoading?: boolean;
}

function WmJapaDestinationSelectorSkeleton() {
  return <Skeleton className="h-9 w-52" />;
}

function WmJapaDestinationSelector({
  value,
  onValueChange,
  isLoading = false,
}: WmJapaDestinationSelectorProps) {
  if (isLoading) {
    return <WmJapaDestinationSelectorSkeleton />;
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const dest = JAPA_DESTINATIONS.find((d) => d.value === v);
        if (dest) {
          onValueChange(v, dest);
        }
      }}
    >
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Select destination..." />
      </SelectTrigger>
      <SelectContent>
        {JAPA_DESTINATIONS.map((dest) => (
          <SelectItem key={dest.value} value={dest.value}>
            <span className="flex items-center gap-2">
              <span>{dest.flag}</span>
              <span>{dest.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { WmJapaDestinationSelector, WmJapaDestinationSelectorSkeleton, JAPA_DESTINATIONS };
