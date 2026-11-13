import { hexPoints } from "@/art/hex";
import { cn } from "@/lib/cn";

export function HexMark({ className }: { className?: string }) {
  return (
    <svg className={cn("hex-mark", className)} viewBox="-14 -14 28 28" aria-hidden="true" focusable="false">
      <polygon className="hex-mark-solid" points={hexPoints(0, -6, 6.2)} />
      <polygon className="hex-mark-line" points={hexPoints(-6.93, 6, 5.4)} />
      <polygon className="hex-mark-line" points={hexPoints(6.93, 6, 5.4)} />
    </svg>
  );
}
