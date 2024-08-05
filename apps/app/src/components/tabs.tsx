"use client";

import { cn } from "@mapform/lib/classnames";
import { Skeleton } from "@mapform/ui/components/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  name?: string;
  isLoading?: boolean;
  tabs: { name: string; href: string }[];
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Tabs({ name, isLoading, tabs, action, children }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex-1 p-6">
      <div className="md:flex md:items-center md:justify-between relative">
        {isLoading ? (
          <Skeleton className="w-48 h-6" />
        ) : (
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {name}
          </h3>
        )}
        <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
          {action}
        </div>
      </div>
      <div className="mt-4 border-b border-gray-200">
        <div className="sm:hidden">
          <label className="sr-only" htmlFor="current-tab">
            Select a tab
          </label>
          <select className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary">
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <Link
                className={cn(
                  tab.href === pathname
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
                href={tab.href}
                key={tab.name}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
