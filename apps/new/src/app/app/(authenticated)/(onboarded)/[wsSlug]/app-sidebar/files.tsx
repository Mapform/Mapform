import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@mapform/ui/components/sidebar";
import { EarthIcon, FolderOpenIcon, PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { DragItem, DragHandle } from "~/components/draggable";
import { useMemo, useState } from "react";

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
  const router = useRouter();
  const pathname = usePathname();

  const allFiles = useMemo(() => {
    return [
      ...space.projects.map((project) => ({
        ...project,
        type: "project" as const,
      })),
      ...space.folders.map((folder) => ({
        ...folder,
        type: "folder" as const,
      })),
    ];
  }, [space.projects, space.folders]);

  const [optimisticFiles, setOptimisticFiles] = useState(() => {
    type FileItem = (typeof allFiles)[0] & { children: FileItem[] };

    const buildTree = (
      items: typeof allFiles,
      parentId: string | null = null,
    ): FileItem[] => {
      return items
        .filter((item) => item.fileTreePosition.parentId === parentId)
        .sort(
          (a, b) => a.fileTreePosition.position - b.fileTreePosition.position,
        )
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };

    return buildTree(allFiles);
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
            <DragItem key={file.id} id={file.id}>
              <DragHandle id={file.id}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                    isActive={pathname === file.url}
                    onClick={() => {
                      if (file.type === "project") {
                        router.push(file.url);
                      }
                    }}
                  >
                    <div>
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
                    </div>
                  </SidebarMenuButton>
                  {file.type === "folder" && (
                    <SidebarMenuBadge>{file.children.length}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
                {file.type === "folder" && file.children.length > 0 && (
                  <SidebarMenuSub>
                    {file.children.map((child) => (
                      <SidebarMenuSubItem key={child.id}>
                        <SidebarMenuSubButton>
                          {child.title}
                        </SidebarMenuSubButton>
                        {file.type === "folder" && (
                          <SidebarMenuBadge>
                            {file.children.length}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </DragHandle>
            </DragItem>
          ))}
        </SidebarMenu>
      </SortableContext>
    </DndContext>
  );
}
