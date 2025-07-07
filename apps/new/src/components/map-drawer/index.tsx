import { cn } from "@mapform/lib/classnames";
import type { CarouselApi } from "@mapform/ui/components/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { WikidataImageItem } from "~/lib/wikidata-image";

interface MapDrawerProps {
  // isPending: boolean;
  open: boolean;
  depth?: number;
  children: React.ReactNode;
}

const DRAWER_WIDTH = 360;

export function MapDrawer({ open, depth = 0, children }: MapDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute bottom-2 top-2 z-20 flex !select-text outline-none"
          style={{
            width: DRAWER_WIDTH,
          }}
          initial={{ x: -DRAWER_WIDTH }}
          animate={{
            x: 8 + 16 * depth,
            scale: depth > 0 ? 0.985 : 1,
          }}
          exit={{ x: -DRAWER_WIDTH }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* Copy content with mask when when other drawers open on top */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-50 rounded-lg bg-gray-950 transition-opacity duration-200",
              {
                "opacity-50": depth > 0,
                "opacity-0": depth === 0,
              },
            )}
          />
          <div className="flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MapDrawerActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky -top-6 z-30 -mx-6 -mt-6 flex h-[52px] p-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface MapDrawerImagesProps {
  images: WikidataImageItem[];
}

export function MapDrawerImages({ images }: MapDrawerImagesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      className="-mx-6 w-[calc(100%+3rem)]"
      opts={{
        loop: true,
        align: "center",
      }}
      setApi={setApi}
    >
      <CarouselContent className="ml-0">
        {images.map((image, index) => (
          <CarouselItem
            className={cn(
              "relative h-40 basis-[calc(100%-2rem)] pl-1 transition-opacity duration-300",
              {
                "opacity-20": current !== index,
              },
            )}
            key={image.imageUrl}
          >
            <div className="relative size-full overflow-hidden rounded-lg">
              <Image
                src={image.imageUrl}
                alt="Image"
                fill
                className="h-full w-full object-cover object-center"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
