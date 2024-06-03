"use client";

import Link from "next/link";
import { cn } from "@mapform/lib/classnames";
import { usePathname } from "next/navigation";
import { type UserOrgs } from "./requests";

interface ActiveLinksProps {
  userOrgs: UserOrgs;
}

export default function ActiveLinks({ userOrgs }: ActiveLinksProps) {
  const pathname = usePathname();

  return (
    <ul className="-mx-2 space-y-1 my-2">
      {userOrgs?.organizationMemberships.map((membership) => (
        <li key={membership.organization.id}>
          <Link
            className={cn(
              pathname === `/orgs/${membership.organization.slug}`
                ? "bg-gray-50 text-indigo-600"
                : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
              "group flex gap-x-3 rounded-md p-1.5 text-sm leading-6 font-semibold"
            )}
            href={`/orgs/${membership.organization.slug}`}
          >
            <span
              className={cn(
                pathname === `/orgs/${membership.organization.slug}`
                  ? "text-indigo-600 border-indigo-600"
                  : "text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600",
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white"
              )}
            >
              {membership.organization.name[0]}
            </span>
            <span className="truncate">{membership.organization.name}</span>
          </Link>
          <ul className="space-y-1 mt-1">
            {membership.organization.workspaces.map((workspace) => (
              <li key={workspace.id}>
                <Link
                  className={cn(
                    pathname ===
                      `/orgs/${membership.organization.slug}/workspaces/${workspace.slug}`
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group flex gap-x-3 rounded-md p-1.5 text-sm leading-6"
                  )}
                  href={`/orgs/${membership.organization.slug}/workspaces/${workspace.slug}`}
                >
                  <span className="truncate ml-[37px]">{workspace.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
