import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import Link from "next/link";
import { NavSlot } from "~/components/nav-slot";
import { getProjectWithTeamspaceAction } from "~/data/projects/get-project-with-teamspace";
import { ShareContent } from "./share-content";
import TogglePages from "./toggle-pages";

export default async function Nav(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; pId: string }>;
}) {
  const params = await props.params;
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
        <div className="flex items-center">
          {project.submissionsDataset ? (
            <Link
              href={`/app/${params.wsSlug}/${params.tsSlug}/datasets/${project.submissionsDataset.id}`}
            >
              <Button size="sm" variant="ghost">
                Responses
              </Button>
            </Link>
          ) : null}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="ghost">
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
    />
  );
}
