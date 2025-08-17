"use client";

import { cn } from "@mapform/lib/classnames";
import { AnimatePresence, motion } from "motion/react";
import Image, { type StaticImageData } from "next/image";

interface PlacesProps {
  results: {
    title: string;
    description: string;
    image: StaticImageData;
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
            {/* <div className="size-16 border-r bg-gray-100" /> */}
            <div className="relative size-16 overflow-hidden">
              <Image
                className="absolute inset-0 opacity-70 blur-sm"
                src={result.image}
                alt={result.title}
                width={64}
                height={64}
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5 truncate px-4 py-2">
              <div className="truncate text-sm font-medium">{result.title}</div>
              <div className="text-xs text-gray-500">{result.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
