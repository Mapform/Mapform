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
            }}
          >
            <CarouselContent>
              {TABS.map((tab) => (
                <CarouselItem
                  className="relative h-[500px] w-full overflow-hidden"
                  key={tab.id}
                >
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
