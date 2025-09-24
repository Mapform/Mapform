"use client";

import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogPrimitive,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
import { CreativeCommonsIcon, UserIcon, XIcon } from "lucide-react";
import { Spinner } from "@mapform/ui/components/spinner";
import { useEffect, useState } from "react";
import { cn } from "@mapform/lib/classnames";

interface ImageLightboxProps {
  activeImage: {
    url: string;
    description?: string;
    licenseUrl?: string;
    sourceUrl?: string;
    license?: string;
    author?: string;
    source: "internal" | "wikidata";
  };
  children: React.ReactNode;
}

export function ImageLightbox({ activeImage, children }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loading state when the image changes
    setIsLoaded(false);
  }, [activeImage.url]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setIsLoaded(false);
      }}
    >
      <DialogTrigger className="cursor-pointer" asChild>
        {children}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogClose className="pointer-events-auto fixed right-4 top-4 z-[9999] text-white">
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogPrimitive.Content
          className={`data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] fixed left-[50%] top-[50%] z-50 flex translate-x-[-50%] translate-y-[-50%] flex-col p-4 outline-none duration-200 sm:rounded-lg md:p-8`}
        >
          <div className="relative flex max-h-[calc(100vh-4rem)] max-w-[calc(100vw-4rem)] items-center justify-center overflow-hidden">
            {!isLoaded && (
              <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
                <Spinner />
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={cn(
                "m-0 block h-auto max-h-[calc(100vh-4rem)] w-auto max-w-[calc(100vw-4rem)] flex-none rounded-md object-contain opacity-0 transition-opacity duration-200",
                {
                  "opacity-100": isLoaded,
                },
              )}
              src={activeImage.url}
              alt={activeImage.description ?? ""}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
            />
          </div>
          {(activeImage.author || activeImage.license) && (
            <div className="mt-2 flex w-full max-w-[calc(100vw-4rem)] text-center text-xs text-white/80">
              {activeImage.author && (
                <span className="mr-auto flex items-center gap-1.5">
                  <UserIcon className="size-4" />
                  {activeImage.sourceUrl ? (
                    <a
                      href={activeImage.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2"
                    >
                      {activeImage.author}
                    </a>
                  ) : (
                    activeImage.author
                  )}
                </span>
              )}
              {activeImage.license && (
                <span className="ml-auto flex items-center gap-1.5">
                  <CreativeCommonsIcon className="size-4" />
                  {activeImage.licenseUrl ? (
                    <a
                      href={activeImage.licenseUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline underline-offset-2"
                    >
                      {activeImage.license}
                    </a>
                  ) : (
                    activeImage.license
                  )}
                </span>
              )}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
