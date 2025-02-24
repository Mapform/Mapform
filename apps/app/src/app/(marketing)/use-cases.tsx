"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@mapform/ui/components/carousel";
import {
  MapIcon,
  BuildingIcon,
  TreePineIcon,
  UsersIcon,
  HeartIcon,
  TentIcon,
} from "lucide-react";

const USE_CASES = [
  {
    title: "Real Estate",
    description:
      "Create interactive property maps and manage real estate portfolios with ease.",
    icon: BuildingIcon,
  },
  {
    title: "Environmental",
    description:
      "Track and visualize environmental data, conservation areas, and natural resources.",
    icon: TreePineIcon,
  },
  {
    title: "Community",
    description:
      "Build community maps for local initiatives, events, and resource sharing.",
    icon: UsersIcon,
  },
  {
    title: "Non-Profit",
    description:
      "Map impact areas, track projects, and showcase your organization's reach.",
    icon: HeartIcon,
  },
  {
    title: "Tourism",
    description:
      "Design interactive travel guides and highlight points of interest.",
    icon: TentIcon,
  },
  {
    title: "Custom Solutions",
    description:
      "Create your own mapping solution for any use case you can imagine.",
    icon: MapIcon,
  },
];

export function UseCases() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-600">
            Use Cases
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Endless possibilities with Mapform
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            From real estate to environmental conservation, discover how Mapform
            can work for you.
          </p>
        </div>

        <div className="mt-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              slidesToScroll: 1,
            }}
            className="mx-auto w-full max-w-sm sm:max-w-6xl"
          >
            <CarouselContent>
              {USE_CASES.map((useCase, index) => (
                <CarouselItem key={index} className="pl-2 md:basis-1/3 md:pl-4">
                  <div className="flex flex-col overflow-hidden rounded-xl border p-6">
                    <useCase.icon className="size-8 text-gray-600" />
                    <h3 className="mt-4 text-lg font-semibold leading-7 text-gray-900">
                      {useCase.title}
                    </h3>
                    <p className="mt-2 flex-1 text-base leading-7 text-gray-600">
                      {useCase.description}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious className="-left-16" />
              <CarouselNext className="-right-16" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
