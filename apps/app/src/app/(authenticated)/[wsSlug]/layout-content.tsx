"use client";

import {
  ChevronDownIcon,
  HomeIcon,
  ListOrderedIcon,
  MapIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@mapform/lib/classnames";
import { AccordionPrimitive } from "@mapform/ui/components/accordion";
import { useRouter, usePathname } from "next/navigation";
import type { WorkspaceWithTeamspaces } from "~/data/workspaces/get-workspace-with-teamspaces";

const bottomLinks = [
  { href: "https://todo.com", icon: ListOrderedIcon, label: "Roadmap" },
];

export function BottomContent() {
  return (
    <>
      <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1">
        Resources
      </h3>
      <div className="text-sm text-stone-700">
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </div>
    </>
  );
}

export function TopContent({
  workspaceSlug,
  workspaceWithTeamspaces,
}: {
  workspaceSlug: string;
  workspaceWithTeamspaces: NonNullable<WorkspaceWithTeamspaces>;
}) {
  const router = useRouter();
  const pathname = usePathname();

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

  const defaultOpenTeamspaces = workspaceWithTeamspaces.teamspaces
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
            {workspaceWithTeamspaces.teamspaces.map((teamspace) => (
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

function NavLink(link: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      className={cn(
        "-mx-3 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between mb-[2px]",
        {
          "bg-stone-100 text-stone-900": link.isActive,
        }
      )}
      href={link.href}
    >
      <div
        className={cn("flex items-center gap-2 overflow-hidden", {
          "pl-4": link.nested,
        })}
      >
        <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
          <link.icon className="h-4 w-4 flex-shrink-0" />
        </div>
        <span className="truncate">{link.label}</span>
      </div>
    </Link>
  );
}
