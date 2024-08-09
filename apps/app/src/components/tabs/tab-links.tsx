"use client";

import { cn } from "@mapform/lib/classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabLinksProps {
  tabs: { name: string; href: string }[];
}

export function TabLinks({ tabs }: TabLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex space-x-3 mx-4">
      {tabs.map((tab) => (
        <Link
          className={cn(
            tab.href === pathname
              ? "border-primary text-primary"
              : "border-transparent text-stone-500 hover:border-gray-300 hover:text-stone-700",
            "whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium"
          )}
          href={tab.href}
          key={tab.name}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
