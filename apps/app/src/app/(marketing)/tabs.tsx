"use client";

import { motion } from "motion/react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import Image from "next/image";
import {
  BookMarkedIcon,
  EarthIcon,
  SquareArrowOutUpRightIcon,
  TableIcon,
  TextCursorInputIcon,
} from "lucide-react";

const TABS = [
  {
    id: "map",
    title: "Beautiful Maps",
    image: "/static/images/map.jpeg",
    alt: "Map view interface",
    icon: EarthIcon,
  },
  {
    id: "dataset",
    title: "Datasets",
    image: "/static/images/dataset.png",
    alt: "Dataset interface",
    icon: TableIcon,
  },
  {
    id: "guide",
    title: "Guides",
    image: "/static/images/guide.png",
    alt: "Guide interface",
    icon: BookMarkedIcon,
  },
  {
    id: "forms",
    title: "Forms",
    image: "/static/images/forms.jpeg",
    alt: "Forms interface",
    icon: TextCursorInputIcon,
  },
  {
    id: "publish",
    title: "Publish",
    image: "/static/images/share.png",
    alt: "Publish interface",
    icon: SquareArrowOutUpRightIcon,
  },
];

export function TabsShowcase() {
  return (
    <TabsPrimitive.Root defaultValue="map" className="mx-auto w-full max-w-3xl">
      <TabsPrimitive.List className="flex gap-2">
        {TABS.map((tab) => (
          <TabsPrimitive.Trigger
            className="flex items-center gap-2 font-medium"
            key={tab.id}
            value={tab.id}
          >
            <tab.icon className="size-5" />
            {tab.title}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {TABS.map((tab) => (
        <TabsPrimitive.Content key={tab.id} value={tab.id}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
