"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { CheckIcon, ChevronDown, LogOutIcon, PlusIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { type UserOrgs } from "~/data/orgs/get-user-orgs";

interface SwitcherPopoverProps {
  currentOrgSlug?: string;
  userOrgs: UserOrgs;
}

export function SwitcherPopover({
  currentOrgSlug,
  userOrgs,
}: SwitcherPopoverProps) {
  const currentOrg = userOrgs?.organizationMemberships.find(
    (membership) => membership.organization.slug === currentOrgSlug
  );

  return (
    <Popover>
      <PopoverTrigger className="-mx-3 -mt-1.5 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between">
        <div className="flex gap-3 items-center overflow-hidden">
          {/* TODO: Add custom icon support */}
          <div className="text-md">🗺️</div>
          <div className="text-left text-sm font-medium truncate">
            {currentOrg?.organization.name ?? "Account"}
          </div>
        </div>
        <ChevronDown className="text-stone-500 w-4 h-4 flex-shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="p-0 overflow-hidden">
        <div className="px-3 py-2 border-b">
          <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1">
            Organizations
          </h3>
          <ul className="text-sm">
            {userOrgs?.organizationMemberships.map((membership) => (
              <li
                className="w-full flex flex-col"
                key={membership.organization.id}
              >
                <Link
                  className="flex items-center justify-between hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
                  href={`/orgs/${membership.organization.slug}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                      🗺️
                    </div>
                    <span className="truncate">
                      {membership.organization.name}
                    </span>
                  </div>
                  {currentOrg?.organization.id ===
                    membership.organization.id && (
                    <div className="h-4 w-4 flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 flex-shrink-0" />
                    </div>
                  )}
                </Link>
              </li>
            ))}
            <li className="w-full flex flex-col">
              <button
                className="appearance-none flex gap-2 items-center text-stone-500 text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
                disabled
                type="button"
              >
                <div className="h-4 w-4 flex items-center justify-center">
                  <PlusIcon className="h-4 w-4 text-stone-500 flex-shrink-0" />
                </div>
                Create organization (Coming soon)
              </button>
            </li>
          </ul>
        </div>
        <div className="px-3 py-2 bg-stone-50">
          <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1 truncate">
            Signed in as {userOrgs?.email}
          </h3>
          <div className="w-full flex flex-col">
            <button
              className="appearance-none flex gap-2 items-center text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              onClick={() => signOut()}
              type="button"
            >
              <div className="h-4 w-4 flex items-center justify-center">
                <LogOutIcon className="h-4 w-4 flex-shrink-0" />
              </div>
              Sign out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
