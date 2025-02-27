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
import datasetImage from "public/static/images/dataset.png";
import formsImage from "public/static/images/forms.jpeg";
import guideImage from "public/static/images/guide.png";
import mapImage from "public/static/images/map.jpeg";
import shareImage from "public/static/images/share.png";

const TABS = [
  {
    id: "map",
    title: "Maps",
    image: mapImage,
    alt: "Map view interface",
    icon: EarthIcon,
  },
  {
    id: "dataset",
    title: "Datasets",
    image: datasetImage,
    alt: "Dataset interface",
    icon: TableIcon,
  },
  {
    id: "guide",
    title: "Guides",
    image: guideImage,
    alt: "Guide interface",
    icon: BookMarkedIcon,
  },
  {
    id: "forms",
    title: "Forms",
    image: formsImage,
    alt: "Forms interface",
    icon: TextCursorInputIcon,
  },
  {
    id: "publish",
    title: "Publish",
    image: shareImage,
    alt: "Publish interface",
    icon: SquareArrowOutUpRightIcon,
  },
];

export function ShowcaseTabs() {
  return (
    <TabsPrimitive.Root
      defaultValue="map"
      className="relative mx-auto h-full w-full max-w-screen-2xl overflow-hidden"
      onValueChange={(value) => {
        document.getElementById(value)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }}
    >
      <TabsPrimitive.List className="no-scrollbar mb-4 flex justify-start gap-6 overflow-x-auto whitespace-nowrap px-4 py-2 md:justify-center md:px-0">
        {TABS.map((tab) => (
          <TabsPrimitive.Trigger
            className="flex shrink-0 items-center gap-2 font-medium opacity-50 transition-opacity duration-300 hover:opacity-70 data-[state=active]:opacity-100"
            id={tab.id}
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
            className="relative mx-auto aspect-[2512/1712] w-11/12 max-w-screen-xl md:w-10/12"
          >
            <Image
              src={tab.image}
              alt={tab.alt}
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              fill
              style={{
                objectFit: "cover",
              }}
              placeholder="blur"
            />
          </motion.div>
        </TabsPrimitive.Content>
      ))}
      <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
    </TabsPrimitive.Root>
  );
}
