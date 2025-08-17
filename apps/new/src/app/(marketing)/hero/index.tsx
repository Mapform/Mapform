"use client";

import { Button } from "@mapform/ui/components/button";
import type { Marker } from "cobe";
import Link from "next/link";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@mapform/ui/components/tooltip";
import { Globe } from "./globe";
import { ArrowUpRightIcon } from "lucide-react";
import mapform from "public/static/images/mapform-full.svg";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import nyc from "public/static/images/nyc.jpg";
import Places from "./places";
import { TextBox } from "./text-box";

const locationLoop: {
  query: string;
  coordinates: [number, number];
  markers: Marker[];
  results: {
    title: string;
    description: string;
    image: StaticImageData;
  }[];
}[] = [
  {
    query: "Show me the world",
    coordinates: [37.7749, -122.4194],
    markers: [
      { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco, USA
      { location: [40.7128, -74.006], size: 0.05 }, // New York City, USA
      { location: [48.8566, 2.3522], size: 0.05 }, // Paris, France
      { location: [35.6895, 139.6917], size: 0.05 }, // Tokyo, Japan
      { location: [51.5074, -0.1278], size: 0.05 }, // London, UK
      { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney, Australia
      { location: [55.7558, 37.6173], size: 0.05 }, // Moscow, Russia
      { location: [-23.5505, -46.6333], size: 0.05 }, // São Paulo, Brazil
      { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
      { location: [19.4326, -99.1332], size: 0.05 }, // Mexico City, Mexico
      { location: [52.52, 13.405], size: 0.05 }, // Berlin, Germany
      { location: [34.0522, -118.2437], size: 0.05 }, // Los Angeles, USA
      { location: [28.6139, 77.209], size: 0.05 }, // Delhi, India
      { location: [31.2304, 121.4737], size: 0.05 }, // Shanghai, China
      { location: [6.5244, 3.3792], size: 0.05 }, // Lagos, Nigeria
    ],
    results: [
      {
        title: "Tokyo",
        description: "Japan",
        image: nyc,
      },
      {
        title: "New York",
        description: "USA",
        image: nyc,
      },
      {
        title: "Paris",
        description: "France",
        image: nyc,
      },
    ],
  },
  {
    query: "What are the best restaurants in Tokyo?",
    coordinates: [35.6895, 139.6917],
    markers: [{ location: [35.6895, 139.6917], size: 0.05 }],
    results: [
      {
        title: "Tokyo 2",
        description: "Japan",
        image: nyc,
      },
      {
        title: "New York 2",
        description: "USA",
        image: nyc,
      },
      {
        title: "Paris 2",
        description: "France",
        image: nyc,
      },
    ],
  },
  {
    query: "What are the best restaurants in Tokyo?",
    coordinates: [-279.529737, 35.174931],
    markers: [{ location: [-29.814434, -214.265064], size: 0.05 }],
    results: [
      {
        title: "Tokyo 3",
        description: "Japan",
        image: nyc,
      },
      {
        title: "New York 3",
        description: "USA",
        image: nyc,
      },
      {
        title: "Paris 3",
        description: "France",
        image: nyc,
      },
    ],
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const current = locationLoop[index] ?? locationLoop[0]!;
  const target = useMemo(
    () => ({ coordinates: current.coordinates, markers: current.markers }),
    [current],
  );

  useEffect(() => {
    if (locationLoop.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % locationLoop.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <section className="lg:flex lg:items-center lg:gap-x-12">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center sm:items-baseline sm:text-left lg:mx-0 lg:flex-auto">
            <Image alt="Logo" className="h-5 w-fit" src={mapform} />
            <div className="lg:max-w-[512px]">
              {/* <h1 className="text-foreground my-8 text-5xl font-medium lg:text-7xl">
                Chat With Your Map.
              </h1> */}
              <h1 className="text-foreground my-8 flex flex-col gap-5 text-6xl font-medium lg:text-7xl">
                <div className="relative inline-block self-start">
                  <span className="text-primary relative -ml-6 inline-block rounded-3xl bg-gray-100 px-6 py-4">
                    <span className="animate-rainbow">Hello, World.</span>
                    <span
                      aria-hidden
                      className="absolute -left-[7px] bottom-0 z-0 h-5 w-5 rounded-br-[15px] bg-gray-100"
                    />
                    <span
                      aria-hidden
                      className="absolute -left-[10px] bottom-0 z-[1] h-5 w-[10px] rounded-br-[10px] bg-white"
                    />
                  </span>
                </div>
              </h1>
              <p className="text-muted-foreground mb-10 text-xl leading-8 sm:mb-10 sm:mt-6 sm:text-2xl">
                {/* Mapform helps you track, manage, and share the places that
                matter to you. */}
                Mapform combines data, content, forms, and more to create maps
                for almost anything.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:justify-start">
              <Link className="max-lg:shadow-sm" href="/app" target="_blank">
                <Button size="xl" tabIndex={-1}>
                  Try the beta
                </Button>
              </Link>
              <Link
                href="mailto:contact@mapform.co?subject=I'd like to learn more about Mapform"
                target="_blank"
              >
                <Button
                  className="max-lg:shadow-sm"
                  size="xl"
                  variant="secondary"
                  tabIndex={-1}
                >
                  Contact <ArrowUpRightIcon className="ml-1 size-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-15 max-lg:h-screen max-lg:w-screen lg:relative lg:z-0 lg:mt-0 lg:size-[550px] lg:flex-shrink-0 lg:flex-grow lg:opacity-100">
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <Globe target={target} />
            </div>
            <TextBox text={current.query} />
            <Places results={current.results} />
          </div>
        </section>
      </div>
    </div>
  );
}
