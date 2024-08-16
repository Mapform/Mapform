"use client";

import { cn } from "@mapform/lib/classnames";
import { Button } from "@mapform/ui/components/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabsProps {
  name?: string;
  tabs: { name: string; href: string }[];
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Tabs({ name, tabs, action, children }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center justify-between relative py-2 pl-4 pr-2 border-b">
        <div className="flex items-center">
          <h3 className="text-base font-semibold leading-6 text-stone-900">
            {name}
          </h3>
          <nav className="flex space-x-1 mx-8">
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
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        <div>{action}</div>
      </div>
      <div className="flex flex-col flex-1 p-4 overflow-hidden">{children}</div>
    </div>
  );
}
