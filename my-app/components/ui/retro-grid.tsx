import { cn } from "@/lib/utils";

export default function RetroGrid({
  className,
  angle = 65,
  gridColor = "rgba(255, 255, 255, 0.3)", // Default grid color
}: {
  className?: string;
  angle?: number;
  gridColor?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden opacity-50 [perspective:200px]",
        className,
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",
          )}
          style={{
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1px, transparent 0),
              linear-gradient(to bottom, ${gridColor} 1px, transparent 0)
            `,
          }}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90% dark:from-black" />
    </div>
  );
}