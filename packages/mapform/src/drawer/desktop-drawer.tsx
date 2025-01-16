"use client";

import { cn } from "@mapform/lib/classnames";

export function DesktopDrawer({
  children,
  withPadding = false,
  open,
  className,
}: {
  open: boolean;
  withPadding?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-background prose group absolute bottom-0 top-0 z-40 flex h-full max-w-full flex-col shadow-lg outline-none transition duration-500",
        withPadding ? "w-[392px] pl-8" : "w-[360px]",
        open
          ? "visible translate-x-0 opacity-100"
          : "-translate-x-full opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
