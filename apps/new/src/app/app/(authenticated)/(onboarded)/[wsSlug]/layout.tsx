import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { authClient } from "~/lib/safe-action";
import { WorkspaceProvider } from "./workspace-context";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@mapform/ui/components/sidebar";

export default async function WorkspaceLayout(props: {
  params: Promise<{ wsSlug: string }>;
  children: React.ReactNode;
  nav?: React.ReactNode;
  drawers?: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const leftSidebarCookie = cookieStore.get("sidebar-left:state");

  const defaultLeftOpen = leftSidebarCookie
    ? leftSidebarCookie.value === "true"
    : true;
  const params = await props.params;
  const { children } = props;

  const [workspaceDirectory, workspaceMemberships] = await Promise.all([
    fetchWorkspaceDirectory(params.wsSlug),
    fetchWorkspaceMemberships(),
  ]);

  return (
    <WorkspaceProvider
      defaultLeftOpen={defaultLeftOpen}
      workspaceDirectory={workspaceDirectory}
      workspaceMemberships={workspaceMemberships}
      workspaceSlug={params.wsSlug}
    >
      <SidebarProvider defaultOpen={defaultLeftOpen}>
        <AppSidebar />
        <main className="prose flex flex-1 overflow-hidden p-2 pl-0">
          {children}
          {props.drawers}
        </main>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}

/**
 * Cached fetch functions
 */
const fetchWorkspaceDirectory = cache(async (slug: string) => {
  const getWorkspaceDirectoryResponse = await authClient.getWorkspaceDirectory({
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
    await authClient.getUserWorkspaceMemberships({});

  const workspaceMemberships = workspaceMembershipsResponse?.data;

  if (!workspaceMemberships) {
    throw new Error("Failed to fetch workspace memberships");
  }

  return workspaceMemberships;
});
