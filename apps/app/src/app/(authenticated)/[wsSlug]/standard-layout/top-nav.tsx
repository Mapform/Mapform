"use client";

import Link from "next/link";
import { Button } from "@mapform/ui/components/button";
import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { useStandardLayout } from "./context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useParams } from "next/navigation";

export function TopNav({ children }: { children: React.ReactNode }) {
  const params = useParams<{
    wsSlug: string;
    tsSlug?: string;
    pId?: string;
    dId?: string;
  }>();
  const { showNav, setShowNav, navSlot, workspaceDirectory } =
    useStandardLayout();

  const workspace = workspaceDirectory.name;
  const teamspaces = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === params.tsSlug
  );
  const project = teamspaces?.projects.find((p) => p.id === params.pId);
  const dataset = teamspaces?.datasets.find((d) => d.id === params.dId);

  const pathNav = teamspaces
    ? [
        { name: teamspaces?.name, href: `/${params.wsSlug}/${params.tsSlug}` },
        {
          name: project?.name,
          href: `/${params.wsSlug}/${params.tsSlug}/${params.pId}`,
        },
        { name: dataset?.name },
      ].filter((section) => section.name)
    : [{ name: "Home", href: `/${params.wsSlug}` }];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center py-2 px-4 border-b h-[50px]">
        <nav className="flex flex-1 items-center">
          <div className="mr-2 text-muted-foreground">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowNav((prev) => !prev)}
                    size="icon-sm"
                    variant="ghost"
                  >
                    {showNav ? (
                      <ChevronsLeftIcon className="size-4" />
                    ) : (
                      <ChevronsRightIcon className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent collisionPadding={16}>
                  {showNav ? "Hide Navigation" : "Show Navigation"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
                    <span className="mx-3 text-stone-200 text-sm">/</span>
                  )}
                </div>
              );
            })}
          </h3>
          <div className="ml-8 flex-1">{navSlot}</div>
        </nav>
      </div>
      <div className="flex flex-col flex-1 p-4 overflow-hidden">{children}</div>
    </div>
  );
}
