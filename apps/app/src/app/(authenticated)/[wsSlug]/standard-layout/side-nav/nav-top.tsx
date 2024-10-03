"use client";

import { cn } from "@mapform/lib/classnames";
import { AccordionPrimitive } from "@mapform/ui/components/accordion";
import { HomeIcon, SettingsIcon, ChevronDownIcon, MapIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NavLink } from "./nav-link";
import { useStandardLayout } from "../context";

export function NavTop() {
  const router = useRouter();
  const pathname = usePathname();
  const { workspaceDirectory, workspaceSlug } = useStandardLayout();

  const topLinks = [
    { href: `/${workspaceSlug}`, icon: HomeIcon, label: "Home" },
    {
      href: `/${workspaceSlug}/settings`,
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
        isProjectActive(teamspace.slug, project.id)
      );
    })
    .map((workspace) => workspace.id);

  return (
    <div className="text-sm text-stone-700 space-y-4 mt-4">
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
        <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1">
          Teamspaces
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
                    "-mx-3 hover:bg-stone-100 pl-2 pr-2 py-1 rounded transition-colors flex items-center justify-between mb-[2px] cursor-pointer",
                    {
                      "bg-stone-100 text-stone-900": pathname.includes(
                        `/${workspaceSlug}/${teamspace.slug}`
                      ),
                    }
                  )}
                  // We use an on click event handler instead of a Link so that the nested e.stopPropagation() works
                  onClick={() => {
                    router.push(`/${workspaceSlug}/${teamspace.slug}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(`/${workspaceSlug}/${teamspace.slug}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-1 overflow-hidden">
                    <AccordionPrimitive.Trigger
                      className="flex rounded items-center justify-center flex-shrink-0 p-1 [&[data-state=closed]>svg]:-rotate-90 [&[data-state=open]>svg]:rotate-0 hover:bg-stone-200"
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
                      href={`/${workspaceSlug}/${teamspace.slug}/projects/${project.id}`}
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
