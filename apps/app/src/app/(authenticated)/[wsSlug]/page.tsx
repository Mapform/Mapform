import { ConstructionIcon } from "lucide-react";
import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: { wsSlug: string };
}) {
  const getWorkspaceDirectoryResponse = await getWorkspaceDirectory({
    slug: params.wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceDirectoryResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <div className="flex justify-center items-center w-full">
      <div className="text-muted-foreground flex flex-col gap-2 items-center">
        <ConstructionIcon className="size-6" />
        <p>This page is under construction</p>
      </div>
    </div>
  );
}
