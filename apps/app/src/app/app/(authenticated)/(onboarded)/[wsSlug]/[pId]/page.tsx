import { notFound, redirect } from "next/navigation";
import { authDataService } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { loadSearchParams } from "~/lib/params/server";
import type { SearchParams } from "nuqs/server";
import { MapData } from "./map-data";
import { Views } from "./views";
import { ServerMapPositioner } from "~/lib/map/map-positioner";

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page } = await loadSearchParams(props.searchParams);

  const [project] = await Promise.all([
    authDataService.getProject({
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

  if (project.data.views.length === 0) {
    return notFound();
  }

  if (!activeView) {
    const firstView = project.data.views[0];
    if (!firstView) {
      return notFound();
    }
    return redirect(`/app/${params.wsSlug}/${params.pId}?v=${firstView.id}`);
  }

  return (
    <ProjectProvider project={project.data} activeView={activeView}>
      <ServerMapPositioner
        viewState={{
          center: project.data.center.coordinates,
          zoom: project.data.zoom,
          pitch: project.data.pitch,
          bearing: project.data.bearing,
        }}
      >
        <Views />
        <MapData />
      </ServerMapPositioner>
    </ProjectProvider>
  );
}
