"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { type UserOrgs } from "~/data/orgs/get-user-orgs";

interface SwitcherPopoverProps {
  userOrgs: UserOrgs;
}

export function SwitcherPopover({ userOrgs }: SwitcherPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger className="-mx-3 -mt-1.5 hover:bg-stone-100 px-3 py-1.5 rounded transition-colors flex items-center justify-between">
        <div className="flex gap-3 items-center">
          {/* TODO: Add custom icon support */}
          <div className="text-md">🗺️</div>
          <div className="text-left text-sm font-medium">Name</div>
        </div>
        <ChevronDown className="text-stone-500 w-4 h-4" />
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
                  className="hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
                  href="/"
                >
                  📍 {membership.organization.name}
                </Link>
              </li>
            ))}
            <li className="w-full flex flex-col">
              <button
                className="appearance-none text-stone-500 text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
                disabled
                type="button"
              >
                Create organization (Coming soon)
              </button>
            </li>
          </ul>
        </div>
        <div className="px-3 py-2 bg-stone-50">
          <h3 className="text-xs font-semibold leading-6 text-stone-400 mb-1">
            Signed in as {userOrgs?.name}
          </h3>
          <div className="w-full flex flex-col">
            <button
              className="appearance-none text-left hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              onClick={() => signOut()}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
