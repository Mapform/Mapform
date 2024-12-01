import { cn } from "@mapform/lib/classnames";
import { motion } from "motion/react";
import { useMeasure } from "@mapform/lib/hooks/use-measure";

interface ClusterProps {
  pointCount: number;
  uniqueFeatures: { icon: string; color: string }[];
  onClick: () => void;
}

export function Cluster({ pointCount, onClick, uniqueFeatures }: ClusterProps) {
  const { ref, bounds } = useMeasure<HTMLButtonElement>();

  // NOTE: I should be able to generate the size using the point count
  // divided by the points in view. However, for some reason points that
  // are not in view (on the other side of the globe) will register as
  // in view. Until that is resolves this technique will have to do.
  const size = 50 + Math.log2(pointCount) * 20;

  const maxIconsToShow = Math.floor(bounds.width / 30) - 1;

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className="relative flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white/10 text-lg shadow-md backdrop-blur"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: -20 }}
      onClick={onClick}
      ref={ref}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      type="button"
    >
      {uniqueFeatures.slice(0, maxIconsToShow).map((feature, i) => (
        <div
          className={cn(
            "flex aspect-square size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white text-lg shadow-md",
            {
              "-ml-4": i > 0,
            },
          )}
          key={feature.icon}
          style={{ backgroundColor: feature.color }}
        >
          {feature.icon}
        </div>
      ))}
      {pointCount > maxIconsToShow && (
        <div
          className={cn(
            "text-md text-muted-foreground flex aspect-square size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md",
            {
              "-ml-4": uniqueFeatures.slice(0, maxIconsToShow).length > 0,
            },
          )}
          style={{ backgroundColor: "white" }}
        >
          +{pointCount - maxIconsToShow}
        </div>
      )}
    </motion.button>
  );
}
