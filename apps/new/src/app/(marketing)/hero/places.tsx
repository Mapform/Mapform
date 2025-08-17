"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";

interface PlacesProps {
  results: {
    title: string;
  }[];
}

export default function Places({ results }: PlacesProps) {
  return (
    <AnimatePresence>
      <div className="absolute left-0 right-0 top-16 flex flex-col gap-8">
        {results.map((result, i) => (
          <motion.div
            className={cn(
              "flex w-3/5 overflow-hidden rounded-lg border bg-white/70 backdrop-blur-sm",
              {
                "ml-auto": i % 2 === 1,
              },
            )}
            key={result.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + i * 0.25,
              ease: "easeInOut",
            }}
          >
            <div className="size-16 border-r bg-gray-100" />
            <div className="flex flex-col justify-center gap-1 truncate px-4 py-2">
              <div className="truncate">{result.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
