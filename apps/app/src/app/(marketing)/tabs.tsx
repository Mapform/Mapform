"use client";

import { motion } from "motion/react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import Image from "next/image";

const TABS = [
  {
    title: "Map View",
    image: "/static/images/map-view.png",
    alt: "Map view interface",
  },
  {
    title: "Data View",
    image: "/static/images/data-view.png",
    alt: "Data view interface",
  },
  {
    title: "Analysis",
    image: "/static/images/analysis.png",
    alt: "Analysis interface",
  },
];

export function TabsShowcase() {
  return (
    <TabsPrimitive.Root
      defaultValue="Map View"
      className="mx-auto w-full max-w-3xl"
    >
      <TabsPrimitive.List className="flex gap-2">
        {TABS.map((tab) => (
          <TabsPrimitive.Trigger key={tab.title} value={tab.title}>
            {tab.title}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>

      {TABS.map((tab) => (
        <TabsPrimitive.Content key={tab.title} value={tab.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="overflow-hidden rounded-lg border"
          >
            <Image
              src={tab.image}
              alt={tab.alt}
              width={800}
              height={400}
              className="h-auto w-full"
            />
          </motion.div>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
