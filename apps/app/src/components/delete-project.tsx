"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@mapform/ui/components/alert-dialog";
import { deleteProjectAction } from "~/data/projects/delete-project";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@mapform/ui/components/toaster";
import { useWorkspace } from "~/app/app/(authenticated)/(onboarded)/[wsSlug]/workspace-context";

export function DeleteProjectContent({
  project,
}: {
  project: { id: string; teamspaceId: string };
}) {
  const { workspaceSlug, workspaceDirectory, updateWorkspaceDirectory } =
    useWorkspace();
  const { execute, isPending: isDeletingProject } = useAction(
    deleteProjectAction,
    {
      onError: () => {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was an error deleting the project.",
        });
      },
    },
  );

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          All associated data will be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeletingProject}
          onClick={() => {
            updateWorkspaceDirectory({
              ...workspaceDirectory,
              teamspaces: workspaceDirectory.teamspaces.map((ts) =>
                ts.id === project.teamspaceId
                  ? {
                      ...ts,
                      projects: ts.projects.filter((p) => p.id !== project.id),
                    }
                  : ts,
              ),
            });

            execute({
              projectId: project.id,
              redirect: `/app/${workspaceSlug}`,
            });
          }}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

export {
  AlertDialogTrigger as DeleteProjectTrigger,
  AlertDialog as DeleteProject,
};
