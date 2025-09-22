"use client";

import { cn } from "@mapform/lib/classnames";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import { XIcon } from "lucide-react";
import Image from "next/image";

interface Image {
  url: string;
  alt?: string;
  attribution?: string;
  source: "internal" | "wikidata";
}

interface ImageLightboxProps {
  activeImage: Image;
  images: Image[];
  children: React.ReactNode;
}

export function ImageLightbox({ activeImage, children }: ImageLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {children}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 size-full w-full translate-x-[-50%] translate-y-[-50%] p-8 duration-200 sm:rounded-lg">
          <DialogClose>
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="flex flex-col"></div>
          <div className="relative size-full flex-1 overflow-hidden">
            <Image
              src={activeImage.url}
              alt={activeImage.alt ?? ""}
              fill
              objectFit="contain"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
      {/* <DialogContent className="flex size-full bg-transparent">
        <div className="flex flex-col"></div>
        <div className="size-full flex-1">
          <Image
            src={activeImage.url}
            alt={activeImage.alt ?? ""}
            fill
            objectFit="contain"
          />
        </div>
      </DialogContent> */}
    </Dialog>
  );
}
