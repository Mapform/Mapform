"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { ChevronsLeftIcon } from "lucide-react";

export function DesktopDrawer({
  children,
  withPadding = false,
  onClose,
  open,
}: {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-background prose group absolute bottom-0 top-0 z-40 flex h-full max-w-full flex-col shadow-lg outline-none transition-transform max-md:!w-full max-md:rounded-t-xl max-md:shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] md:rounded-r-lg",
        withPadding ? "w-[392px] pl-8" : "w-[360px]",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <Button
        className="absolute right-2 top-2"
        onClick={onClose}
        size="icon-sm"
        variant="ghost"
      >
        <ChevronsLeftIcon className="size-5" />
      </Button>
      {children}
    </div>
  );
}
