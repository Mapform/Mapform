"use client";

import type { CarouselApi } from "@mapform/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
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
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@mapform/lib/classnames";

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

export function Demos() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (current + 1) % TABS.length;
          api.scrollTo(nextIndex);
          return 0;
        }
        return prev + 1;
      });
    }, 50); // Adjust timing as needed

    return () => clearInterval(interval);
  }, [api, current]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0);
    });
  }, [api]);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
              Showcase
            </h3>
            {/* <p className="text-muted-foreground mt-4 text-lg leading-8 sm:text-xl">
              See Mapform in action.
            </p> */}
          </div>
        </div>
        <div className="relative mt-8 lg:mt-16">
          <Carousel
            opts={{
              loop: true,
              align: "center",
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {TABS.map((tab, i) => (
                <CarouselItem
                  className={cn("h-[500px] w-full basis-4/5 rounded-lg pl-4", {
                    "cursor-pointer": i !== current,
                  })}
                  onClick={() => {
                    api?.scrollTo(i);
                    setProgress(0);
                  }}
                  key={tab.id}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-300">
                    <Image
                      src={tab.image}
                      alt={tab.alt}
                      className="h-full w-full"
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                      placeholder="blur"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center gap-4 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur-md">
            {TABS.map((tab, i) => (
              <motion.button
                key={tab.id}
                onClick={() => {
                  api?.scrollTo(i);
                  setProgress(0);
                }}
                className="relative flex h-2 items-center justify-center rounded-full bg-gray-400 shadow-lg transition-all hover:bg-gray-500"
                animate={{
                  width: current === i ? 48 : 8,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                {current === i && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-gray-400" />
                    <div
                      className="absolute inset-0 rounded-full bg-gray-900"
                      style={{
                        clipPath: `inset(0 ${100 - progress}% 0 0)`,
                        transition: "clip-path 0.05s linear",
                      }}
                    />
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
