import {
  SidebarLeftProvider,
  SidebarRightProvider,
} from "@mapform/ui/components/sidebar";
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { getCurrentUserWorkspaceMembershipsAction } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { getWorkspaceDirectoryAction } from "~/data/workspaces/get-workspace-directory";
import { TopNav } from "./top-nav";
import { LeftSidebar } from "./left-sidebar";
import { WorkspaceProvider } from "./workspace-context";
import { RightSidebar } from "./right-sidebar";

export default async function WorkspaceLayout(props: {
  params: Promise<{ wsSlug: string }>;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  const params = await props.params;
  const { children, nav } = props;

  const [workspaceDirectory, workspaceMemberships] = await Promise.all([
    fetchWorkspaceDirectory(params.wsSlug),
    fetchWorkspaceMemberships(),
  ]);

  return (
    <WorkspaceProvider
      workspaceDirectory={workspaceDirectory}
      workspaceMemberships={workspaceMemberships}
      workspaceSlug={params.wsSlug}
    >
      <SidebarLeftProvider>
        <SidebarRightProvider>
          <LeftSidebar />
          <main className="flex flex-1 overflow-hidden">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="flex flex-1 flex-col overflow-hidden">
                <TopNav navSlot={nav} />
                {children}
              </div>
            </Suspense>
          </main>
          <RightSidebar />
        </SidebarRightProvider>
      </SidebarLeftProvider>
    </WorkspaceProvider>
  );
}

/**
 * Cached fetch functions
 */
const fetchWorkspaceDirectory = cache(async (slug: string) => {
  const getWorkspaceDirectoryResponse = await getWorkspaceDirectoryAction({
    slug,
  });

  const workspaceDirectory = getWorkspaceDirectoryResponse?.data;

  if (!workspaceDirectory) {
    return notFound();
  }

  return workspaceDirectory;
});

const fetchWorkspaceMemberships = cache(async () => {
  const workspaceMembershipsResponse =
    await getCurrentUserWorkspaceMembershipsAction();

  const workspaceMemberships = workspaceMembershipsResponse?.data;

  if (!workspaceMemberships) {
    throw new Error("Failed to fetch workspace memberships");
  }

  return workspaceMemberships;
});
