import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { getCurrentUserWorkspaceMemberships } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { notFound } from "next/navigation";
import { cache } from "react";
import { TopNav } from "./top-nav";
import { SideNav } from "./side-nav";
import {
  StandardLayoutProvider,
  type StandardLayoutProviderProps,
} from "./context";

export async function StandardLayout({
  children,
  drawerContent,
  workspaceSlug,
  ...rest
}: {
  children: React.ReactNode;
} & StandardLayoutProviderProps) {
  const [workspaceDirectory, workspaceMemberships] = await Promise.all([
    fetchWorkspaceDirectory(workspaceSlug),
    fetchWorkspaceMemberships(),
  ]);

  return (
    <StandardLayoutProvider
      workspaceSlug={workspaceSlug}
      drawerContent={drawerContent}
      workspaceDirectory={workspaceDirectory}
      workspaceMemberships={workspaceMemberships}
      {...rest}
    >
      <div className="flex-1 overflow-hidden flex">
        <SideNav workspaceSlug={workspaceSlug} />
        <TopNav>{children}</TopNav>
      </div>

      {drawerContent ? (
        <div className="flex flex-col w-[300px] flex-shrink-0 px-4 py-2 border-l">
          {drawerContent}
        </div>
      ) : null}
    </StandardLayoutProvider>
  );
}

/**
 * Cached fetch functions
 */
const fetchWorkspaceDirectory = cache(async (slug: string) => {
  const getWorkspaceDirectoryResponse = await getWorkspaceDirectory({
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
    await getCurrentUserWorkspaceMemberships();

  const workspaceMemberships = workspaceMembershipsResponse?.data;

  if (!workspaceMemberships) {
    throw new Error("Failed to fetch workspace memberships");
  }

  return workspaceMemberships;
});
