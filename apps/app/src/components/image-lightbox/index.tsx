"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mapform/ui/components/dialog";
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
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex bg-transparent">
        <div className="flex flex-col"></div>
        <Image src={activeImage.url} alt={activeImage.alt ?? ""} />
      </DialogContent>
    </Dialog>
  );
}
