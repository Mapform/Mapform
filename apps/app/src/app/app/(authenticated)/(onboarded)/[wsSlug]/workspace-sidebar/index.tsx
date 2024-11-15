import {
  SidebarLeft,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@mapform/ui/components/sidebar";

export function WorkspaceSidebar() {
  return (
    <SidebarLeft>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </SidebarLeft>
  );
}
