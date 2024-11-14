"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { XIcon } from "lucide-react";

export function MobileDrawer({
  children,
  withPadding = false,
  onClose,
}: {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-background prose relative z-40 flex h-full min-h-[200px] w-full max-w-full flex-col rounded-t-xl shadow-lg outline-none",
        withPadding ? "pl-8" : "pl-0",
      )}
    >
      {onClose ? (
        <Button
          className="absolute right-2 top-2"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <XIcon className="size-5" />
        </Button>
      ) : null}
      {children}
    </div>
  );
}
