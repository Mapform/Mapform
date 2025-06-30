import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { authClient, publicClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { TableView } from "./table-view";
import { MapView } from "./map-view";
import { loadSearchParams } from "~/lib/params/server";
import type { SearchParams } from "nuqs/server";

/**
 * Cached search rows function
 *
 * Note: React cache only works within a single server request.
 * The cache is invalidated on every new request, so this won't
 * provide cross-request caching. It's useful for sharing work
 * between multiple components in the same render tree.
 */
const getVectorSearchResults = cache(
  async (query: string, projectId: string) => {
    const searchResults = await authClient.searchRows({
      query,
      projectId,
    });
    return searchResults;
  },
);

const getGeoapifySearchResults = cache(
  async (query: string, bounds?: [number, number, number, number]) => {
    const searchResults = await publicClient.searchPlaces({
      query,
      bounds,
    });
    return searchResults;
  },
);

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page, rowId, query } = await loadSearchParams(
    props.searchParams,
  );

  const [project, feature, vectorSearchResults, geoapifySearchResults] =
    await Promise.all([
      authClient.getProject({
        projectId: params.pId,
        filter: {
          type: "page",
          page,
          perPage,
        },
      }),
      rowId ? authClient.getRow({ rowId }) : null,
      query ? getVectorSearchResults(query, params.pId) : null,
      query ? getGeoapifySearchResults(query, undefined) : null,
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
      vectorSearchResults={vectorSearchResults?.data}
      geoapifySearchResults={geoapifySearchResults?.data}
    >
      <div className="relative h-full">
        {activeView.type === "table" && <TableView />}
        {activeView.type === "map" && <MapView />}
      </div>
    </ProjectProvider>
  );
}
