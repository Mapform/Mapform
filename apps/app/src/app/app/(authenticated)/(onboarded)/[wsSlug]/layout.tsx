import { cache } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { authDataService } from "~/lib/safe-action";
import { WorkspaceProvider } from "./workspace-context";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@mapform/ui/components/sidebar";
import { SIDEBAR_WIDTH } from "~/constants/sidebars";
import { Drawers } from "./drawers";
import { MobileMenu } from "./mobile-menu";

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
      <SidebarProvider
        defaultOpen={defaultLeftOpen}
        width={`${SIDEBAR_WIDTH}px`}
      >
        <AppSidebar />
        <main className="prose pointer-events-none relative flex max-w-none flex-1 overflow-y-auto pl-0 md:overflow-hidden">
          {/* Page-Based Drawers */}
          {/* Drawers are rendered in the layout so that they don't unmount between route changes. NOTE: This means that ALL content will render in the drawers. If this is not desired, I could consider moving the drawer content into a Next.js SLOT. */}
          <Drawers>{children}</Drawers>

          {/* Query Param-Based Drawers */}
          {props.drawers}
        </main>

        <MobileMenu />
      </SidebarProvider>
    </WorkspaceProvider>
  );
}

/**
 * Cached fetch functions
 */
const fetchWorkspaceDirectory = cache(async (slug: string) => {
  const getWorkspaceDirectoryResponse =
    await authDataService.getWorkspaceDirectory({
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
    await authDataService.getUserWorkspaceMemberships({});

  const workspaceMemberships = workspaceMembershipsResponse?.data;

  if (!workspaceMemberships) {
    throw new Error("Failed to fetch workspace memberships");
  }

  return workspaceMemberships;
});
