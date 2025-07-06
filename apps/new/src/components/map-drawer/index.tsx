import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@mapform/ui/components/carousel";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
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
          <div className="flex h-full w-full grow flex-col overflow-y-auto rounded-lg border bg-white p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MapDrawerActionButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="-mx-6 -mt-6">{children}</div>;
}

interface MapDrawerImagesProps {
  images: WikidataImageItem[];
}

export function MapDrawerImages({ images }: MapDrawerImagesProps) {
  return (
    <Carousel
      className="-mx-6 w-[calc(100%+3rem)]"
      opts={{
        loop: true,
        align: "center",
      }}
    >
      <CarouselContent className="ml-0">
        {images.map((image) => (
          <CarouselItem
            className="relative h-40 basis-4/5 pl-1"
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
