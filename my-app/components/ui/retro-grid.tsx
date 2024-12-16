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
        "pointer-events-none fixed inset-0 overflow-hidden opacity-50",
        className,
      )}
      style={{ perspective: "200px", "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0" style={{ transform: "rotateX(var(--grid-angle))" }}>
        <div
          className={cn(
            "animate-grid",
            "bg-repeat bg-[length:80px_80px] h-[300vh] inset-0 ml-[-50%] origin-[100%_0_0] w-[600vw]",
          )}
          style={{
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 0),
                              linear-gradient(to bottom, ${gridColor} 1px, transparent 0)`,
            animation: "moveGrid 10s linear infinite",
          }}
        />
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent dark:from-black" />
    </div>
  );
}

// Add keyframes for the grid animation
const styles = `
@keyframes moveGrid {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-80px, -80px, 0);
  }
}
`;

// Inject the styles into the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}