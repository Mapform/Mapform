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
    <Carousel color="w-full h-32">
      <CarouselContent>
        {images.map((image) => (
          <CarouselItem
            className="h-32 w-full basis-4/5 rounded-lg pl-2"
            key={image.imageUrl}
          >
            <Image
              src={image.imageUrl}
              alt="Image"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
