"use client";

import {
  Bank,
  TrendUp,
  PiggyBank,
  House,
  CurrencyBtc,
  Wallet,
  Package,
  DotsThreeOutline,
  PencilSimple,
  Trash,
  LinkSimple,
  Camera,
  Clock,
} from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currencies";
import type { AssetType, AssetSource } from "@/lib/mock-data";
import { ASSET_TYPE_COLORS, ASSET_TYPE_LABELS } from "@/lib/mock-data";

/**
 * Asset shape accepted by this component. Compatible with both
 * mock-data Asset and Convex manualAsset shapes.
 */
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  platform?: string;
  value: number;
  currency: string;
  convertedValue?: number;
  source: AssetSource;
  lastUpdated: number;
  notes?: string;
  holdings?: {
    ticker?: string;
    name: string;
    quantity?: number;
    value: number;
    currency: string;
  }[];
}

// ── Icon mapping ────────────────────────────────────────────────────
const ASSET_ICONS: Record<AssetType, React.ElementType> = {
  bank: Bank,
  investment: TrendUp,
  pension: PiggyBank,
  property: House,
  crypto: CurrencyBtc,
  cash: Wallet,
  other: Package,
};

// ── Source badge config ─────────────────────────────────────────────
const SOURCE_CONFIG: Record<
  AssetSource,
  { label: string; icon: React.ElementType; className: string }
> = {
  mono: {
    label: "Connected via Mono",
    icon: LinkSimple,
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  manual: {
    label: "Manually added",
    icon: PencilSimple,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  screenshot: {
    label: "Imported via screenshot",
    icon: Camera,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

interface WmAssetCardProps {
  asset: Asset;
  onEdit?: (assetId: string) => void;
  onDelete?: (assetId: string) => void;
}

function WmAssetCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function WmAssetCard({ asset, onEdit, onDelete }: WmAssetCardProps) {
  const Icon = ASSET_ICONS[asset.type];
  const sourceConfig = SOURCE_CONFIG[asset.source];
  const SourceIcon = sourceConfig.icon;
  const typeColor = ASSET_TYPE_COLORS[asset.type];

  return (
    <Card className="group relative transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${typeColor}15` }}
          >
            <Icon className="size-5" style={{ color: typeColor }} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Top row: name + menu */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold leading-tight">
                  {asset.name}
                </h3>
                {asset.platform && (
                  <p className="truncate text-xs text-muted-foreground">
                    {asset.platform}
                  </p>
                )}
              </div>

              {/* Action menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                  >
                    <DotsThreeOutline className="size-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(asset.id)}>
                    <PencilSimple />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete?.(asset.id)}
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Balance */}
            <p className="mt-2 font-heading text-lg font-bold">
              {formatCurrency(asset.value, asset.currency)}
            </p>

            {/* Source badge + last updated */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`gap-1 border-0 text-[10px] font-medium ${sourceConfig.className}`}
              >
                <SourceIcon className="size-2.5" />
                {sourceConfig.label}
              </Badge>

              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" />
                {formatRelativeTime(asset.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { WmAssetCard, WmAssetCardSkeleton };
export { ASSET_TYPE_LABELS };
