import { cn } from "@mapform/lib/classnames";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  pulse?: boolean;
}

function Skeleton({ className, pulse = true, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-100",
        pulse && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
