import Image from "next/image";
import { Button } from "@/components/ui/button";

interface WmEmptyStateProps {
  imageSrc: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

function WmEmptyState({
  imageSrc,
  title,
  description,
  actionLabel,
  onAction,
}: WmEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative h-[160px] w-[200px] sm:h-[200px] sm:w-[250px]">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="mt-6 font-heading text-lg font-semibold">
        {title}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          size="lg"
          className="mt-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { WmEmptyState };
export type { WmEmptyStateProps };
