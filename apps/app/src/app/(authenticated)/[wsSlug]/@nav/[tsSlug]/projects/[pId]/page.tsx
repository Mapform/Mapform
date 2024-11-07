import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { SendIcon } from "lucide-react";
import { NavSlot } from "~/components/nav-slot";
import { getProjectWithTeamspaceAction } from "~/data/projects/get-project-with-teamspace";
import { ShareContent } from "./share-content";
import TogglePages from "./toggle-pages";

export default async function Nav({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
}) {
  const projectResponse = await getProjectWithTeamspaceAction({
    id: params.pId,
  });
  const project = projectResponse?.data;

  if (!project) {
    return null;
  }

  return (
    <NavSlot
      actions={
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost">
                <SendIcon className="mr-2 h-4 w-4" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <ShareContent
                isDirty={project.isDirty}
                numberOfVersions={project.childProjects.length}
                projectId={params.pId}
              />
            </PopoverContent>
          </Popover>
          <TogglePages />
        </div>
      }
      tabs={[
        {
          name: "Create",
          href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}`,
        },
        ...(projectResponse.data?.submissionsDataset.id
          ? [
              {
                name: "Responses",
                href: `/${params.wsSlug}/${params.tsSlug}/datasets/${projectResponse.data.submissionsDataset.id}`,
              },
            ]
          : []),
      ]}
    />
  );
}
