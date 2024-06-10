"use client";

import Link from "next/link";
import { cn } from "@mapform/lib/classnames";
import { usePathname } from "next/navigation";
import { Clock4Icon } from "lucide-react";
import { type UserOrgs } from "./requests";

interface ActiveLinksProps {
  userOrgs: UserOrgs;
}

export default function ActiveLinks({ userOrgs }: ActiveLinksProps) {
  const pathname = usePathname();

  return (
    <>
      <h3 className="text-xs font-semibold leading-6 text-gray-400 mb-2">
        My Files
      </h3>
      <div className="-mx-2">
        <Link
          className={cn(
            pathname === "/"
              ? "bg-gray-50 text-primary"
              : "text-gray-700 hover:text-primary hover:bg-gray-50",
            "group flex gap-x-3 rounded-md p-1.5 text-sm leading-6 font-semibold"
          )}
          href="/"
        >
          <span
            className={cn(
              pathname === "/"
                ? "text-primary border-primary"
                : "text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary",
              "flex h-6 w-6 shrink-0 items-center justify-center text-[0.625rem] font-medium"
            )}
          >
            <Clock4Icon size={20} />
          </span>
          <span className="truncate">Recent</span>
        </Link>
      </div>
      <h3 className="text-xs font-semibold leading-6 text-gray-400 mt-8">
        Teams
      </h3>
      <ul className="-mx-2 space-y-1 my-2">
        {userOrgs?.organizationMemberships.map((membership) => (
          <li key={membership.organization.id}>
            <Link
              className={cn(
                pathname === `/orgs/${membership.organization.slug}`
                  ? "bg-gray-50 text-primary"
                  : "text-gray-700 hover:text-primary hover:bg-gray-50",
                "group flex gap-x-3 rounded-md p-1.5 text-sm leading-6 font-semibold"
              )}
              href={`/orgs/${membership.organization.slug}`}
            >
              <span
                className={cn(
                  pathname === `/orgs/${membership.organization.slug}`
                    ? "text-primary border-primary"
                    : "text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary",
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
                        ? "bg-gray-50 text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50",
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
    </>
  );
}
