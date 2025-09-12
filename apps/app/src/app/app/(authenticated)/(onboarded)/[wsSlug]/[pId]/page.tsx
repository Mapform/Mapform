import { notFound } from "next/navigation";
import { authClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { loadSearchParams } from "~/lib/params/server";
import type { SearchParams } from "nuqs/server";
import { MapData } from "./map-data";
import { Views } from "./views";
import { MapPositioner } from "~/components/map-positioner";

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page } = await loadSearchParams(props.searchParams);

  const [project] = await Promise.all([
    authClient.getProject({
      projectId: params.pId,
      filter: {
        type: "page",
        page,
        perPage,
      },
    }),
  ]);

  if (!project) {
    return notFound();
  }

  const activeView = project.data?.views.find((view) => view.id === viewId);

  if (!project.data) {
    return notFound();
  }

  if (!activeView) {
    return notFound();
  }

  return (
    <ProjectProvider project={project.data} activeView={activeView}>
      <MapPositioner
        center={project.data.center.coordinates}
        pitch={project.data.pitch}
        bearing={project.data.bearing}
        zoom={project.data.zoom}
      >
        <Views />
        <MapData />
      </MapPositioner>
    </ProjectProvider>
  );
}
