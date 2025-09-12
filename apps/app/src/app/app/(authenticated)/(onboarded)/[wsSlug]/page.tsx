import { notFound } from "next/navigation";

import { getWorkspaceDirectory } from "~/data/workspaces/get-workspace-directory";

import { WelcomeTour } from "./welcome-tour";
import { ProjectMarkers } from "./project-markers";
import { MapPositioner } from "~/components/map-positioner";

export default async function HomePage(props: {
  params: Promise<{ wsSlug: string }>;
}) {
  const params = await props.params;
  const [getWorkspaceDirectoryResponse] = await Promise.all([
    getWorkspaceDirectory({
      slug: params.wsSlug,
    }),
  ]);
  const workspaceDirectory = getWorkspaceDirectoryResponse?.data;

  if (!workspaceDirectory) {
    return notFound();
  }

  return (
    <MapPositioner
      center={[0, 0]}
      zoom={2}
      pitch={0}
      bearing={0}
      listenToChanges
    >
      <WelcomeTour />
      <ProjectMarkers />
    </MapPositioner>
  );
}
