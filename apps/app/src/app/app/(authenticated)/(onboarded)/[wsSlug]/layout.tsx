import {
  SidebarLeftProvider,
  SidebarLeftTrigger,
} from "@mapform/ui/components/sidebar";
import { WorkspaceSidebar } from "./workspace-sidebar";

export default async function WorkspaceLayout(props: {
  params: Promise<{ wsSlug: string }>;
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  const params = await props.params;

  const { children, nav } = props;

  return (
    <SidebarLeftProvider>
      <WorkspaceSidebar />
      <main>
        <SidebarLeftTrigger />
        {children}
      </main>
      {/* <RootLayout navSlot={nav} workspaceSlug={params.wsSlug}>
        {children}
      </RootLayout> */}
    </SidebarLeftProvider>
  );
}
