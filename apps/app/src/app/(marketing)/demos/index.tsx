"use client";

import type { CarouselApi } from "@mapform/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import Image from "next/image";
import {
  ArrowUpRightIcon,
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
import { Badge } from "@mapform/ui/components/badge";

const tagColors = {
  Travel: "bg-blue-500",
  Storytelling: "bg-green-500",
  Community: "bg-indigo-500",
  Tours: "bg-yellow-500",
};

const TABS = [
  {
    id: "travel-map",
    text: "Track and share every place you've ever been",
    tag: "Travel",
    image: mapImage,
    alt: "Map view interface",
    icon: EarthIcon,
    url: "https://mapform.co/share/0c18a5f2-19cb-4d81-b6db-5bcc6330c3ff",
  },
  {
    id: "forms",
    text: "Crowd source suggestions for the perfect trip",
    tag: "Travel",
    image: datasetImage,
    alt: "Dataset interface",
    icon: TableIcon,
    url: "https://mapform.co/share/0c18a5f2-19cb-4d81-b6db-5bcc6330c3ff",
  },
  {
    id: "guide",
    text: "Take your friends on a guided tour",
    tag: "Tours",
    image: guideImage,
    alt: "Guide interface",
    icon: BookMarkedIcon,
    url: "https://mapform.co/share/0c18a5f2-19cb-4d81-b6db-5bcc6330c3ff",
  },
  {
    id: "storytelling",
    text: "Make your stories come alive with maps",
    tag: "Storytelling",
    image: formsImage,
    alt: "Forms interface",
    icon: TextCursorInputIcon,
    url: "https://mapform.co/share/0c18a5f2-19cb-4d81-b6db-5bcc6330c3ff",
  },
  {
    id: "publish",
    text: "Engage with others in your community",
    tag: "Community",
    image: shareImage,
    alt: "Publish interface",
    icon: SquareArrowOutUpRightIcon,
    url: "https://mapform.co/share/0c18a5f2-19cb-4d81-b6db-5bcc6330c3ff",
  },
] as const;

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
    <section className="pb-24">
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
                className="h-[460px] w-full basis-4/5 rounded-lg pl-4 md:h-[500px]"
                onClick={() => {
                  if (i === current) {
                    window.open(tab.url, "_blank");
                  } else {
                    api?.scrollTo(i);
                    setProgress(0);
                  }
                }}
                key={tab.id}
              >
                <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-colors duration-300 hover:bg-gray-200">
                  <div
                    className={cn(
                      "p-4 transition-all delay-200 duration-500 ease-in-out md:p-10",
                      i === current
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-[50px] opacity-0",
                    )}
                  >
                    <Badge className={cn("mb-1", tagColors[tab.tag])}>
                      {tab.tag}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-medium text-gray-800 md:text-2xl">
                        {tab.text}
                      </div>
                      <ArrowUpRightIcon className="size-8" />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-1/2 h-[340px] w-[calc(100%-2rem)] max-w-[900px] -translate-x-1/2 translate-y-4 overflow-hidden rounded-t-xl shadow-xl transition-all delay-200 duration-500 ease-in-out md:h-[360px] md:w-[calc(100%-12rem)]",
                      {
                        "translate-y-1/3 opacity-0": i !== current,
                        "delay-0 group-hover:translate-y-0": i === current,
                      },
                    )}
                  >
                    <Image
                      src={tab.image}
                      alt={tab.alt}
                      className="relative"
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                      placeholder="blur"
                    />
                  </div>
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
    </section>
  );
}
