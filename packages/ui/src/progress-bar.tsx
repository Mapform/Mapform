import { cn } from "@mapform/lib/classnames";

interface ProgressBarProps {
  className?: string;
  value: number;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700",
        className
      )}
    >
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
