"use client";

import { Button } from "@mapform/ui/components/button";
import Link from "next/link";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@mapform/ui/components/tooltip";
import { Globe } from "./globe";
import { ArrowUpRightIcon } from "lucide-react";
import mapform from "public/static/images/mapform-full.svg";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import fairmount from "public/static/images/fairmount.jpg";
import leTrou from "public/static/images/letrou.jpg";
import stViateur from "public/static/images/stviateur.jpg";
import highLine from "public/static/images/highline.jpg";
import tajMahal from "public/static/images/tajmahal.jpg";
import machuPicchu from "public/static/images/machupicchu.jpg";
import petra from "public/static/images/petra.jpg";
import statueOfLiberty from "public/static/images/statueofliberty.jpg";
import met from "public/static/images/met.jpg";
import tokyo1 from "public/static/images/tokyo1.jpg";
import tokyo2 from "public/static/images/tokyo2.jpg";
import tokyo3 from "public/static/images/tokyo3.jpg";
import Places from "./places";
import { TextBox } from "./text-box";

const locationLoop: {
  query: string;
  coordinates: [number, number];
  results: {
    title: string;
    description: string;
    image: StaticImageData;
    location: {
      location: [number, number];
      size?: number;
    };
  }[];
}[] = [
  {
    query: "Where can I find the best bagels in Montreal?",
    coordinates: [45.50169, -73.567253],
    results: [
      {
        title: "St-Viateur Bagel",
        description: "263 Saint Viateur St. West, Montreal",
        image: stViateur,
        location: {
          location: [45.5017, -73.5673],
        },
      },
      {
        title: "Fairmount Bagel",
        description: "74 Av. Fairmount O, Montréal",
        image: fairmount,
        location: {
          location: [45.5017, -73.5673],
        },
      },
      {
        title: "Bagels Le Trou",
        description: "1845 William St, Montreal",
        image: leTrou,
        location: {
          location: [45.5017, -73.5673],
        },
      },
    ],
  },
  {
    query: "What are the New Seven Wonders of the World?",
    coordinates: [25.183816, 13.396412],
    results: [
      {
        title: "Machu Picchu",
        description: "Cuzco, Peru",
        image: machuPicchu,
        location: {
          location: [-13.1631, -72.545],
        },
      },
      {
        title: "Petra",
        description: "Ma'an, Jordan",
        image: petra,
        location: {
          location: [30.328453, 35.444363],
        },
      },
      {
        title: "The Taj Mahal",
        description: "Agra, India",
        image: tajMahal,
        location: {
          location: [27.175, 78.0098],
        },
      },
    ],
  },
  {
    query: "Help me plan a 3 day trip to New York City",
    coordinates: [40.624767, -74.07727],
    results: [
      {
        title: "The Metropolitan Museum of Art",
        description: "1000 5th Ave, New York, NY 10028",
        image: met,
        location: {
          location: [40.7794, -73.9632],
        },
      },
      {
        title: "The High Line",
        description: "New York, NY",
        image: highLine,
        location: {
          location: [40.7488, -73.9692],
        },
      },
      {
        title: "The Statue of Liberty",
        description: "New York, NY",
        image: statueOfLiberty,
        location: {
          location: [40.6892, -74.0445],
        },
      },
    ],
  },
  {
    query: "Give me some authentic restaurants in Tokyo",
    coordinates: [35.6895, 139.6917],
    results: [
      {
        title: "Ishikawa restaurant",
        description: "〒162-0825 Tokyo, Shinjuku City",
        image: tokyo1,
        location: {
          location: [35.6895, 139.6917],
        },
      },
      {
        title: "Sukiyabashi Jiro",
        description: "〒104-0061 Tokyo, Chuo City",
        image: tokyo2,
        location: {
          location: [35.6895, 139.6917],
        },
      },
      {
        title: "Ichiran Ramen",
        description: "〒150-0041 Tokyo, Shibuya",
        image: tokyo3,
        location: {
          location: [35.6895, 139.6917],
        },
      },
    ],
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const current = locationLoop[index] ?? locationLoop[0]!;
  const target = useMemo(
    () => ({
      coordinates: current.coordinates,
      markers: current.results.map((result) => result.location),
    }),
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
