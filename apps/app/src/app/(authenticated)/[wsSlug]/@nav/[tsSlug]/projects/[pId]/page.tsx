import { NavSlot } from "~/components/nav-slot";
import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { SendIcon } from "lucide-react";
import { getProjectWithTeamspace } from "~/data/projects/get-project-with-teamspace";
import { ShareContent } from "./share-content";
import TogglePages from "./toggle-pages";

export default async function Nav({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
}) {
  const projectResponse = await getProjectWithTeamspace({
    id: params.pId,
  });
  const project = projectResponse?.data;

  if (!project) {
    return null;
  }

  return (
    <NavSlot
      actions={
        <div className="flex gap-1 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost">
                <SendIcon className="h-4 w-4 mr-2" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent collisionPadding={16}>
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
        {
          name: "Submissions",
          href: `/${params.wsSlug}/${params.tsSlug}/datasets`,
        },
      ]}
    />
  );
}
