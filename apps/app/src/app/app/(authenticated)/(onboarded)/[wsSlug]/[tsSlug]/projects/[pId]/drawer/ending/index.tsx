import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRightMenuButton,
} from "@mapform/ui/components/sidebar";
import { FlagIcon } from "lucide-react";

export function Ending() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Ending</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarRightMenuButton className="pr-8">
                <FlagIcon />
                <span className="truncate text-sm">Redirect</span>
              </SidebarRightMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
