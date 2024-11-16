import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUserWorkspaceMembershipsAction } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { getWorkspaceDirectoryAction } from "~/data/workspaces/get-workspace-directory";
import { TopNav } from "./top-nav";
import { WorkspaceProvider } from "./workspace-context";
import { LeftSidebar } from "./left-sidebar";

export default async function WorkspaceLayout(props: {
  params: Promise<{ wsSlug: string }>;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultLeftOpen =
    cookieStore.get("sidebar-left:state")?.value === "true";
  const defaultRightOpen =
    cookieStore.get("sidebar-right:state")?.value === "true";
  const params = await props.params;
  const { children, nav } = props;

  const [workspaceDirectory, workspaceMemberships] = await Promise.all([
    fetchWorkspaceDirectory(params.wsSlug),
    fetchWorkspaceMemberships(),
  ]);

  return (
    <WorkspaceProvider
      defaultLeftOpen={defaultLeftOpen}
      defaultRightOpen={defaultRightOpen}
      workspaceDirectory={workspaceDirectory}
      workspaceMemberships={workspaceMemberships}
      workspaceSlug={params.wsSlug}
    >
      <LeftSidebar />
      <main className="flex flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopNav navSlot={nav} />
            {children}
          </div>
        </Suspense>
      </main>
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
