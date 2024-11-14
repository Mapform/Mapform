"use client";

import Link from "next/link";
import { Button } from "@mapform/ui/components/button";
import { MenuIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { useRootLayout } from "./context";

export function TopNav({ children }: { children: React.ReactNode }) {
  const params = useParams<{
    wsSlug: string;
    tsSlug?: string;
    pId?: string;
    dId?: string;
  }>();
  const { showNav, toggleNav, navSlot, workspaceDirectory } = useRootLayout();

  const teamspaces = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === params.tsSlug,
  );
  const project = teamspaces?.projects.find((p) => p.id === params.pId);
  const dataset = teamspaces?.datasets.find((d) => d.id === params.dId);

  const pathNav = teamspaces
    ? [
        {
          name: teamspaces.name,
          href: `/app/${params.wsSlug}/${params.tsSlug}`,
        },
        {
          name: project?.name,
          href: `/app/${params.wsSlug}/${params.tsSlug}/${params.pId}`,
        },
        { name: dataset?.name },
      ].filter((section) => section.name)
    : [{ name: "Home", href: `/app/${params.wsSlug}` }];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex h-[50px] items-center border-b px-4 py-2">
        <nav className="-mr-2 flex flex-1 items-center">
          {!showNav ? (
            <div className="mr-2 flex">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="-ml-2"
                      onClick={toggleNav}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <MenuIcon className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Show Navigation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : null}
          <h3 className="flex items-center text-base font-semibold leading-6 text-stone-900">
            {pathNav.map((section, index) => {
              return (
                <div key={section.name}>
                  {section.href ? (
                    <Link href={section.href}>{section.name}</Link>
                  ) : (
                    section.name
                  )}
                  {index < pathNav.length - 1 && (
                    <span className="mx-3 text-sm text-stone-200">/</span>
                  )}
                </div>
              );
            })}
          </h3>
          <div className="ml-8 flex-1">{navSlot}</div>
        </nav>
      </div>

      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
