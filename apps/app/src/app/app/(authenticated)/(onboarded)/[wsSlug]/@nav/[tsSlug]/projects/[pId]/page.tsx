import { Button } from "@mapform/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@mapform/ui/components/popover";
import Link from "next/link";
import { NavSlot } from "~/components/nav-slot";
import { authClient } from "~/lib/safe-action";
import { ShareContent } from "./share-content";
import TogglePages from "./toggle-pages";

export default async function Nav(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; pId: string }>;
}) {
  const params = await props.params;
  const projectResponse = await authClient.getProjectWithPages({
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
              href={`/app/${params.wsSlug}/${params.tsSlug}/projects/${project.id}/responses/${project.submissionsDataset.id}`}
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
            <PopoverContent className="w-[400px]">
              <ShareContent project={project} />
            </PopoverContent>
          </Popover>
          <TogglePages />
        </div>
      }
    />
  );
}
