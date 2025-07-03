import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import { EarthIcon } from "lucide-react";
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { DragItem, DragHandle } from "~/components/draggable";
import { useWorkspace } from "../workspace-context";
import type { WorkspaceDirectory } from "@mapform/backend/data/workspaces/get-workspace-directory";
import { updateProjectOrderAction } from "~/data/projects/update-project-order";
import { useAction } from "next-safe-action/hooks";

export function Files({
  teamspace,
}: {
  teamspace: NonNullable<WorkspaceDirectory["data"]>["teamspaces"][number];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { workspaceSlug, workspaceDirectory, updateWorkspaceDirectory } =
    useWorkspace();

  const { executeAsync: updateProjectOrderAsync } = useAction(
    updateProjectOrderAction,
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

    const activeProjectIndex = teamspace.projects.findIndex(
      (project) => project.id === active.id,
    );
    const overProjectIndex = teamspace.projects.findIndex(
      (project) => project.id === over.id,
    );

    const newProjects = arrayMove(
      teamspace.projects,
      activeProjectIndex,
      overProjectIndex,
    );

    // Update optimistic state
    updateWorkspaceDirectory({
      ...workspaceDirectory,
      teamspaces: workspaceDirectory.teamspaces.map((ts) =>
        ts.id === teamspace.id
          ? {
              ...ts,
              projects: newProjects.map((project, index) => ({
                ...project,
                position: index,
              })),
            }
          : ts,
      ),
    });

    // Update backend
    await updateProjectOrderAsync({
      teamspaceId: teamspace.id,
      projectOrder: newProjects.map((project) => project.id),
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={teamspace.projects.map((project) => project.id)}
        strategy={verticalListSortingStrategy}
      >
        <SidebarMenu>
          {teamspace.projects.map((project) => (
            <DragItem key={project.id} id={project.id}>
              <DragHandle id={project.id}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                    isActive={
                      pathname === `/app/${workspaceSlug}/${project.id}`
                    }
                    onClick={() => {
                      router.push(`/app/${workspaceSlug}/${project.id}`);
                    }}
                  >
                    <div>
                      {project.icon ? (
                        <span>{project.icon}</span>
                      ) : (
                        <EarthIcon />
                      )}
                      <span>{project.name || "New project"}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </DragHandle>
            </DragItem>
          ))}
        </SidebarMenu>
      </SortableContext>
    </DndContext>
  );
}
