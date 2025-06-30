import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import Link from "next/link";
import { BoxIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export function Files({
  space,
}: {
  space: {
    projects: {
      id: string;
      title: string | null;
      url: string;
      icon: string | null;
    }[];
  };
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {space.projects.map((project) => (
        <SidebarMenuItem key={project.id}>
          <SidebarMenuButton asChild isActive={pathname === project.url}>
            <Link href={project.url}>
              {project.icon ? <span>{project.icon}</span> : <BoxIcon />}
              <span>{project.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
