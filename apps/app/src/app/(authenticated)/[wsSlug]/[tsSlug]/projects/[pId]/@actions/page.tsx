import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import { SendIcon } from "lucide-react";
import { getProjectWithTeamspace } from "~/data/projects/get-project-with-teamspace";
import { ShareContent } from "./share-content";

export default async function Actions({ params }: { params: { pId: string } }) {
  const projectResponse = await getProjectWithTeamspace({
    id: params.pId,
  });
  const project = projectResponse?.data;

  if (!project) {
    return null;
  }

  return (
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
          projectId={params.pId}
          // numberOfVersions={form._count.formVersions}
        />
      </PopoverContent>
    </Popover>
  );
}
