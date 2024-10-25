"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function NavSlot({
  tabs = [],
  actions,
}: {
  tabs?: { name: string; href: string; isExternal?: boolean }[];
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <Link href={tab.href} key={tab.name}>
          <Button
            className={cn(
              tab.href === pathname && "bg-accent text-accent-foreground"
            )}
            size="sm"
            variant="ghost"
          >
            {tab.name}
            {tab.isExternal ? (
              <ArrowUpRightIcon className="w-4 h-4 ml-0.5 -mr-1" />
            ) : null}
          </Button>
        </Link>
      ))}
      <div className="ml-auto">{actions}</div>
    </div>
  );
}
