"use client";

import { cn } from "@mapform/lib/classnames";
import { usePathname } from "next/navigation";

interface TabsProps {
  tabs: { name: string; href: string }[];
}

export function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="sm:hidden">
        <label className="sr-only" htmlFor="current-tab">
          Select a tab
        </label>
        <select className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <a
              className={cn(
                tab.href === pathname
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
              )}
              href={tab.href}
              key={tab.name}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
