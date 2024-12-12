"use client";

import { createContext, useContext } from "react";
import type { CurrentUserWorkspaceMemberships } from "@mapform/backend/workspace-memberships/get-current-user-workspace-memberships";
import type { WorkspaceDirectory } from "@mapform/backend/workspaces/get-workspace-directory";
import {
  SidebarLeftProvider,
  SidebarRightProvider,
} from "@mapform/ui/components/sidebar";
import { useParams } from "next/navigation";
import { RightSidebar } from "./right-sidebar";

export interface WorkspaceContextInterface {
  workspaceSlug: string;
  workspaceDirectory: NonNullable<WorkspaceDirectory>;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  currentWorkspace: CurrentUserWorkspaceMemberships[number] | undefined;
}

export interface WorkspaceProviderProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export const WorkspaceContext = createContext<WorkspaceContextInterface>(
  {} as WorkspaceContextInterface,
);
export const useWorkspace = () => useContext(WorkspaceContext);

export function WorkspaceProvider({
  children,
  workspaceSlug,
  workspaceDirectory,
  workspaceMemberships,
  defaultLeftOpen,
  defaultRightOpen,
}: {
  defaultLeftOpen?: boolean;
  defaultRightOpen?: boolean;
  workspaceMemberships: CurrentUserWorkspaceMemberships;
  workspaceDirectory: NonNullable<WorkspaceDirectory>;
} & WorkspaceProviderProps) {
  const params = useParams<{
    pId?: string;
  }>();
  /**
   * This array can be used to determine if the current page has a drawer. We
   * define it at the root (instead of at a Leaf node), so that we can
   * immeditately render the initial drawer state. Otherwise, the drawer
   * animates in after a delay when the client component loads, which looks
   * weird.
   */
  const hasDrawer = [Boolean(params.pId)].some(Boolean);
  // const pathname = usePathname();
  const currentWorkspace = workspaceMemberships.find(
    (membership) => membership.workspace.slug === workspaceSlug,
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceDirectory,
        workspaceMemberships,
        workspaceSlug,
        currentWorkspace,
      }}
    >
      <SidebarLeftProvider defaultOpen={defaultLeftOpen}>
        <SidebarRightProvider defaultOpen={defaultRightOpen}>
          {children}
          {hasDrawer ? <RightSidebar /> : null}
        </SidebarRightProvider>
      </SidebarLeftProvider>
    </WorkspaceContext.Provider>
  );
}
