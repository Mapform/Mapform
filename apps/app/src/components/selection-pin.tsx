import { motion } from "motion/react";
import { cn } from "@mapform/lib/classnames";

export function SelectionPin({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{
        opacity: 1,
      }}
      className={cn(
        "relative z-[99999] flex -translate-y-1/2 flex-col items-center",
        className,
      )}
      key="pin"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      style={{ position: "relative" }}
    >
      <div className="relative z-[99999] size-4 rounded-full border-4 border-black bg-white" />
      <div className="relative -mt-1.5 h-8 w-[5px] bg-black" />
    </motion.div>
  );
}
