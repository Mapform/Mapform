"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import {
  CheckIcon,
  ChevronDown,
  LogOutIcon,
  PlusIcon,
  ChevronsLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@mapform/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mapform/ui/components/tooltip";
import { signOutAction } from "~/data/auth/sign-out";
import { useRootLayout } from "../context";

export function Switcher() {
  const { workspaceSlug, workspaceMemberships, toggleNav } = useRootLayout();
  const currentWorkspace = workspaceMemberships.find(
    (membership) => membership.workspace.slug === workspaceSlug,
  );

  return (
    <Popover>
      <div className="-mx-2 flex items-center rounded transition-colors hover:bg-stone-100">
        <PopoverTrigger className="mr-auto flex flex-1 items-center gap-1 py-1 pl-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* TODO: Add custom icon support */}
            <div className="text-md">🗺️</div>
            <div className="truncate text-left text-sm font-medium">
              {currentWorkspace?.workspace.name ?? "My Account"}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-stone-500" />
        </PopoverTrigger>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="mr-2 hover:bg-stone-200"
                onClick={toggleNav}
                size="icon-xs"
                variant="ghost"
              >
                <ChevronsLeftIcon className="size-5 flex-shrink-0" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Hide Navigation</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <PopoverContent className="overflow-hidden p-0">
        <div className="border-b px-3 py-2">
          {/* TODO: Add link to access accounts. This could open a modal possibly */}
          {/* <div className="w-full flex flex-col mb-2">
            <Link
              className="flex items-center justify-between hover:bg-stone-100 py-1.5 px-2 -mx-2 transition-colors rounded"
              href="/account"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="h-4 w-4 flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-4 w-4 flex-shrink-0" />
                </div>
                <span className="truncate">My Account</span>
              </div>
              {!currentWorkspace && (
                <div className="h-4 w-4 flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 flex-shrink-0" />
                </div>
              )}
            </Link>
          </div> */}
          <h3 className="mb-1 text-xs font-semibold leading-6 text-stone-400">
            Workspaces
          </h3>
          <ul className="text-sm">
            {workspaceMemberships.map((membership) => (
              <li
                className="flex w-full flex-col"
                key={membership.workspace.id}
              >
                <Link
                  className="-mx-2 flex items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-stone-100"
                  href={`/${membership.workspace.slug}`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                      🗺️
                    </div>
                    <span className="truncate">
                      {membership.workspace.name}
                    </span>
                  </div>
                  {currentWorkspace?.workspace.id ===
                    membership.workspace.id && (
                    <div className="flex h-4 w-4 items-center justify-center">
                      <CheckIcon className="h-4 w-4 flex-shrink-0" />
                    </div>
                  )}
                </Link>
              </li>
            ))}
            <li className="flex w-full flex-col">
              <button
                className="-mx-2 flex cursor-not-allowed appearance-none items-center gap-2 rounded px-2 py-1.5 text-left text-stone-500 transition-colors hover:bg-stone-100"
                disabled
                type="button"
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  <PlusIcon className="h-4 w-4 flex-shrink-0 text-stone-500" />
                </div>
                Create workspace (Coming soon)
              </button>
            </li>
          </ul>
        </div>
        <div className="bg-stone-50 px-3 py-2">
          <h3 className="mb-1 truncate text-xs font-semibold leading-6 text-stone-400">
            Signed in as {currentWorkspace?.user.email}
          </h3>
          <div className="flex w-full flex-col">
            <button
              className="-mx-2 flex appearance-none items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-stone-100"
              onClick={() => signOutAction()}
              type="button"
            >
              <div className="flex h-4 w-4 items-center justify-center">
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
