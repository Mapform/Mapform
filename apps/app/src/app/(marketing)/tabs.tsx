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
import { cn } from "@mapform/lib/classnames";

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
    <TabsPrimitive.Root
      defaultValue="map"
      className="mx-auto w-full max-w-screen-xl"
    >
      <TabsPrimitive.List className="mb-4 flex justify-center gap-6 py-2">
        {TABS.map((tab) => (
          <TabsPrimitive.Trigger
            className="flex items-center gap-2 font-medium opacity-50 transition-opacity duration-300 hover:opacity-70 data-[state=active]:opacity-100"
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
            className="relative mx-auto aspect-[2512/1712] w-10/12 max-w-screen-xl"
          >
            <Image
              src={tab.image}
              alt={tab.alt}
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              fill
              style={{
                objectFit: "cover", // cover, contain, none
              }}
            />
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </motion.div>
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
