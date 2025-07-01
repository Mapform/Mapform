import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import Link from "next/link";
import { EarthIcon, FolderOpenIcon } from "lucide-react";
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
      fileTreePosition: {
        position: number;
        parentId: string | null;
        itemType: "project";
        id: string;
      };
    }[];
    folders: {
      id: string;
      title: string | null;
      url: string;
      icon: string | null;
      fileTreePosition: {
        position: number;
        parentId: string | null;
        itemType: "folder";
        id: string;
      };
    }[];
  };
}) {
  const pathname = usePathname();

  const files = [
    ...space.projects.map((project) => ({
      ...project,
      type: "project",
    })),
    ...space.folders.map((folder) => ({
      ...folder,
      type: "folder",
    })),
  ].sort((a, b) => a.fileTreePosition.position - b.fileTreePosition.position);

  return (
    <SidebarMenu>
      {files.map((file) => (
        <SidebarMenuItem key={file.id}>
          <SidebarMenuButton asChild isActive={pathname === file.url}>
            <Link href={file.url}>
              {file.icon ? (
                <span>{file.icon}</span>
              ) : file.type === "project" ? (
                <EarthIcon />
              ) : (
                <FolderOpenIcon />
              )}
              <span>
                {file.title
                  ? file.title
                  : file.type === "project"
                    ? "New project"
                    : "New folder"}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
