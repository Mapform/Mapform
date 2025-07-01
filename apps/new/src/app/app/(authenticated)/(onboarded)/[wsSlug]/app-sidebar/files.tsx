import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import Link from "next/link";
import { EarthIcon, FolderOpenIcon, GripVerticalIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAction } from "next-safe-action/hooks";
import { updateFileTreePositionsAction } from "~/data/file-tree-positions/update-positions";
import {
  DraggableSidebarItem,
  SidebarDragHandle,
} from "~/components/draggable";
import { useState } from "react";

export function Files({
  space,
}: {
  space: {
    id: string;
    projects: {
      id: string;
      title: string | null;
      url: string;
      icon: string | null;
      fileTreePosition: {
        position: number;
        parentId: string | null;
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
        id: string;
      };
    }[];
  };
}) {
  const pathname = usePathname();
  const [optimisticFiles, setOptimisticFiles] = useState(() => {
    const files = [
      ...space.projects.map((project) => ({
        ...project,
        type: "project" as const,
      })),
      ...space.folders.map((folder) => ({
        ...folder,
        type: "folder" as const,
      })),
    ].sort((a, b) => a.fileTreePosition.position - b.fileTreePosition.position);
    return files;
  });

  const { execute: executeUpdatePositions } = useAction(
    updateFileTreePositionsAction,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIndex = optimisticFiles.findIndex(
      (file) => file.id === active.id,
    );
    const overIndex = optimisticFiles.findIndex((file) => file.id === over.id);

    if (activeIndex === -1 || overIndex === -1) {
      return;
    }

    const newFiles = arrayMove(optimisticFiles, activeIndex, overIndex);
    setOptimisticFiles(newFiles);

    // Update backend
    const items = newFiles.map((file, index) => ({
      id: file.fileTreePosition.id,
      itemType: file.type,
      position: index,
    }));

    await executeUpdatePositions({
      teamspaceId: space.id,
      parentId:
        space.projects[0]?.fileTreePosition.parentId ||
        space.folders[0]?.fileTreePosition.parentId ||
        null,
      items,
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={optimisticFiles.map((file) => file.id)}
        strategy={verticalListSortingStrategy}
      >
        <SidebarMenu>
          {optimisticFiles.map((file) => (
            <DraggableSidebarItem key={file.id} id={file.id}>
              <SidebarMenuItem>
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
                    <SidebarDragHandle id={file.id}>
                      <GripVerticalIcon className="ml-auto h-4 w-4" />
                    </SidebarDragHandle>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DraggableSidebarItem>
          ))}
        </SidebarMenu>
      </SortableContext>
    </DndContext>
  );
}
