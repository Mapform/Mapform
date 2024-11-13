import { notFound } from "next/navigation";
// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { getWorkspaceDirectoryAction } from "~/data/workspaces/get-workspace-directory";
import { getCurrentUserWorkspaceMembershipsAction } from "~/data/workspace-memberships/get-current-user-workspace-memberships";
import { TopNav } from "./top-nav";
import { SideNav } from "./side-nav";
import { RootLayoutProvider, type RootLayoutProviderProps } from "./context";

export async function RootLayout({
  children,
  workspaceSlug,
  ...rest
}: {
  children: React.ReactNode;
} & RootLayoutProviderProps) {
  const [workspaceDirectory, workspaceMemberships] = await Promise.all([
    fetchWorkspaceDirectory(workspaceSlug),
    fetchWorkspaceMemberships(),
  ]);

  return (
    <RootLayoutProvider
      workspaceDirectory={workspaceDirectory}
      workspaceMemberships={workspaceMemberships}
      workspaceSlug={workspaceSlug}
      {...rest}
    >
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <TopNav>{children}</TopNav>
      </div>
    </RootLayoutProvider>
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