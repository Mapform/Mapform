"use client";

import Link from "next/link";
import { Button } from "@mapform/ui/components/button";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { useParams } from "next/navigation";
import { cn } from "@mapform/lib/classnames";
import { useSidebarLeft } from "@mapform/ui/components/sidebar";
import { RenameProjectPopover } from "~/components/rename-project-popover";
import { RenameDatasetPopover } from "~/components/rename-dataset-popover";
import { useWorkspace } from "./workspace-context";

interface TopNavProps {
  navSlot?: React.ReactNode;
}

export function TopNav({ navSlot }: TopNavProps) {
  const params = useParams<{
    wsSlug: string;
    tsSlug?: string;
    pId?: string;
    dId?: string;
  }>();
  const { open, setOpen } = useSidebarLeft();
  const { workspaceDirectory } = useWorkspace();

  const teamspaces = workspaceDirectory.teamspaces.find(
    (ts) => ts.slug === params.tsSlug,
  );
  const project = teamspaces?.projects.find((p) => p.id === params.pId);
  const dataset = teamspaces?.datasets.find((d) => d.id === params.dId);

  const breadcrumbs = [
    { name: "Home", href: `/app/${params.wsSlug}` },
    ...(teamspaces
      ? [
          {
            name: teamspaces.name,
            href: `/app/${params.wsSlug}/${params.tsSlug}`,
          },
        ]
      : []),
    ...(project
      ? [
          {
            name: project.name,
            isProject: true,
          },
        ]
      : []),
    ...(dataset
      ? [
          {
            name: dataset.name,
            isDataset: true,
          },
        ]
      : []),
  ];

  return (
    <div className="flex h-16 items-center px-4 py-2">
      <nav className="-mr-2 flex flex-1 items-center">
        <div className="mr-2 flex">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="-ml-2"
                  onClick={() => {
                    setOpen(!open);
                  }}
                  size="icon-sm"
                  variant="ghost"
                >
                  {open ? (
                    <PanelLeftCloseIcon className="size-5" />
                  ) : (
                    <PanelLeftOpenIcon className="size-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {open ? "Hide" : "Show"} Navigation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <h3 className="flex items-center text-base font-medium leading-6 text-stone-900">
          {breadcrumbs.map((breadcrumb, index) => {
            const content = (
              <>
                {breadcrumb.href ? (
                  <Link
                    className={cn(
                      index < breadcrumbs.length - 1
                        ? "text-muted-foreground hover:text-foreground"
                        : "text-foreground",
                    )}
                    href={breadcrumb.href}
                  >
                    {breadcrumb.name || "Untitled"}
                  </Link>
                ) : (
                  breadcrumb.name || "Untitled"
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-muted-foreground mx-3 text-sm">/</span>
                )}
              </>
            );

            if (breadcrumb.isProject && project) {
              return (
                <RenameProjectPopover
                  key={breadcrumb.name}
                  project={{
                    id: project.id,
                    title: project.name,
                  }}
                >
                  {content}
                </RenameProjectPopover>
              );
            }

            if (breadcrumb.isDataset && dataset) {
              return (
                <RenameDatasetPopover
                  dataset={{
                    id: dataset.id,
                    title: dataset.name,
                  }}
                  key={breadcrumb.name}
                >
                  {content}
                </RenameDatasetPopover>
              );
            }

            return <div key={breadcrumb.name}>{content}</div>;
          })}
        </h3>
        <div className="ml-8 flex-1">{navSlot}</div>
      </nav>
    </div>
  );
}
