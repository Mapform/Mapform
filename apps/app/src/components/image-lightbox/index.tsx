"use client";

import { Button } from "@mapform/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogPrimitive,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import Image from "next/image";

interface ImageLightboxProps {
  activeImage: {
    url: string;
    alt?: string;
    attribution?: string;
    source: "internal" | "wikidata";
  };
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function ImageLightbox({
  activeImage,
  children,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {children}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 flex size-full w-full translate-x-[-50%] translate-y-[-50%] p-8 duration-200 sm:rounded-lg">
          <DialogClose className="absolute right-4 top-4 z-[60] text-white">
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="relative size-full flex-1 overflow-hidden">
            <Image
              className="m-0 rounded-md"
              src={activeImage.url}
              alt={activeImage.alt ?? ""}
              fill
              objectFit="contain"
            />
          </div>
          {onPrevious && (
            <div className="absolute left-0 top-1/2 z-10 size-full -translate-y-1/2">
              <Button variant="ghost" size="icon" onClick={onPrevious}>
                <ChevronLeftIcon className="size-5" />
              </Button>
            </div>
          )}
          {onNext && (
            <div className="absolute right-0 top-1/2 z-10 size-full -translate-y-1/2">
              <Button variant="ghost" size="icon" onClick={onNext}>
                <ChevronRightIcon className="size-5" />
              </Button>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
