import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { authClient, publicClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
// import { TableView } from "./views/table-view";
// import { MapView } from "./views/map-view";
import { loadSearchParams } from "~/lib/params/server";
import type { SearchParams } from "nuqs/server";
import { Source } from "react-map-gl/mapbox";

const getGeoapifyPlaceDetails = cache(async (placeId: string) => {
  const placeDetails = await publicClient.getPlaceDetails({
    placeId,
  });
  return placeDetails;
});

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page, rowId, geoapifyPlaceId } =
    await loadSearchParams(props.searchParams);

  const [project, feature, geoapifyPlaceDetails] = await Promise.all([
    authClient.getProject({
      projectId: params.pId,
      filter: {
        type: "page",
        page,
        perPage,
      },
    }),
    rowId ? authClient.getRow({ rowId }) : null,
    geoapifyPlaceId ? getGeoapifyPlaceDetails(geoapifyPlaceId) : null,
  ]);

  if (!project) {
    return notFound();
  }

  const activeView = project.data?.views.find((view) => view.id === viewId);

  if (!activeView) {
    const firstView = project.data?.views.find((v) => v.position === 0);

    if (!firstView) {
      return notFound();
    }

    redirect(
      `/app/${params.wsSlug}/${params.pId}?v=${firstView.id}&pp=${perPage}&p=${page}`,
    );
  }

  if (!project.data) {
    return notFound();
  }

  return (
    <ProjectProvider
      feature={feature?.data}
      project={project.data}
      activeView={activeView}
      geoapifyPlaceDetails={geoapifyPlaceDetails?.data}
    >
      {/* {activeView.type === "table" && <TableView />}
        {activeView.type === "map" && <MapView />} */}
    </ProjectProvider>
  );
}
