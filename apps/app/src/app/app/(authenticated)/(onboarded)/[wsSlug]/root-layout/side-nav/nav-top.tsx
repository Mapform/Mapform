"use client";

import { cn } from "@mapform/lib/classnames";
import { AccordionPrimitive } from "@mapform/ui/components/accordion";
import { HomeIcon, SettingsIcon, ChevronDownIcon, MapIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRootLayout } from "../context";
import { NavLink } from "./nav-link";

export function NavTop() {
  const router = useRouter();
  const pathname = usePathname();
  const { workspaceDirectory, workspaceSlug } = useRootLayout();

  const topLinks = [
    { href: `/app/${workspaceSlug}`, icon: HomeIcon, label: "Home" },
    {
      href: `/app/${workspaceSlug}/settings`,
      icon: SettingsIcon,
      label: "Settings",
    },
  ];

  const isProjectActive = (teamspaceSlug: string, projectId: string) => {
    return pathname.includes(`/${workspaceSlug}/${teamspaceSlug}/${projectId}`);
  };

  const defaultOpenTeamspaces = workspaceDirectory.teamspaces
    .filter((teamspace) => {
      return teamspace.projects.some((project) =>
        isProjectActive(teamspace.slug, project.id),
      );
    })
    .map((workspace) => workspace.id);

  return (
    <div className="mt-4 space-y-4 text-sm text-stone-700">
      <section>
        {topLinks.map((link) => (
          <NavLink
            isActive={pathname === link.href}
            key={link.href}
            {...link}
          />
        ))}
      </section>
      <section>
        <h3 className="mb-1 text-xs font-semibold leading-6 text-stone-400">
          Spaces
        </h3>
        <AccordionPrimitive.Root
          defaultValue={defaultOpenTeamspaces}
          type="multiple"
        >
          <ul>
            {workspaceDirectory.teamspaces.map((teamspace) => (
              <AccordionPrimitive.Item key={teamspace.id} value={teamspace.id}>
                <div
                  className={cn(
                    "-mx-2 mb-[2px] flex cursor-pointer items-center justify-between rounded p-1 transition-colors hover:bg-stone-100",
                    {
                      "bg-stone-100 text-stone-900": pathname.includes(
                        `/app/${workspaceSlug}/${teamspace.slug}`,
                      ),
                    },
                  )}
                  // We use an on click event handler instead of a Link so that the nested e.stopPropagation() works
                  onClick={() => {
                    router.push(`/app/${workspaceSlug}/${teamspace.slug}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(`/app/${workspaceSlug}/${teamspace.slug}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    <AccordionPrimitive.Trigger
                      className="flex flex-shrink-0 items-center justify-center rounded p-1 hover:bg-stone-200 [&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
                    </AccordionPrimitive.Trigger>
                    <span className="truncate">{teamspace.name}</span>
                  </div>
                </div>
                <AccordionPrimitive.Content>
                  {teamspace.projects.map((project) => (
                    <NavLink
                      href={`/app/${workspaceSlug}/${teamspace.slug}/projects/${project.id}`}
                      icon={MapIcon}
                      isActive={isProjectActive(teamspace.slug, project.id)}
                      key={project.id}
                      label={project.name}
                      nested
                    />
                  ))}
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </ul>
        </AccordionPrimitive.Root>
      </section>
    </div>
  );
}
