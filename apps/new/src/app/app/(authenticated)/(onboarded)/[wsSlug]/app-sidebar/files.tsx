import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@mapform/ui/components/sidebar";
import { EarthIcon, Trash2Icon } from "lucide-react";
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mapform/ui/components/context-menu";
import { deleteProjectAction } from "~/data/projects/delete-project";
import { toast } from "@mapform/ui/components/toaster";

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

  const { executeAsync: deleteProjectAsync, isPending: isDeletingProject } =
    useAction(deleteProjectAction, {
      onError: () => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was an error deleting the project.",
        });
      },
    });

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

  const handleDeleteProject = async (projectId: string) => {
    updateWorkspaceDirectory({
      ...workspaceDirectory,
      teamspaces: workspaceDirectory.teamspaces.map((ts) =>
        ts.id === teamspace.id
          ? { ...ts, projects: ts.projects.filter((p) => p.id !== projectId) }
          : ts,
      ),
    });

    await deleteProjectAsync({
      projectId,
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
                <ContextMenu>
                  <ContextMenuTrigger>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="cursor-pointer"
                        isActive={
                          pathname === `/app/${workspaceSlug}/${project.id}`
                        }
                        onClick={() => {
                          router.push(
                            `/app/${workspaceSlug}/${project.id}?v=${project.views[0]!.id}`,
                          );
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
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      disabled={isDeletingProject}
                      onClick={() => {
                        void handleDeleteProject(project.id);
                      }}
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </DragHandle>
            </DragItem>
          ))}
        </SidebarMenu>
      </SortableContext>
    </DndContext>
  );
}
