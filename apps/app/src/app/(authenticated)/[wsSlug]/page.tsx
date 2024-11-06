import { notFound } from "next/navigation";
import { ConstructionIcon } from "lucide-react";
import { getWorkspaceDirectoryAction } from "~/data/workspaces/get-workspace-directory";

export default async function HomePage({
  params,
}: {
  params: { wsSlug: string };
}) {
  const getWorkspaceDirectoryResponse = await getWorkspaceDirectoryAction({
    slug: params.wsSlug,
  });
  const workspaceWithTeamspaces = getWorkspaceDirectoryResponse?.data;

  if (!workspaceWithTeamspaces) {
    return notFound();
  }

  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <ConstructionIcon className="size-6" />
        <p>This page is under construction</p>
      </div>
    </div>
  );
}
