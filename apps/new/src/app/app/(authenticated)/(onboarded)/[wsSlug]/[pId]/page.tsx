import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { authClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { TableView } from "./table-view";
import { MapView } from "./map-view";
import { loadSearchParams } from "./params";
import type { SearchParams } from "nuqs/server";

/**
 * Cached search rows function
 */
const fetchSearchResults = cache(async (query: string, projectId: string) => {
  const searchResults = await authClient.searchRows({
    query,
    projectId,
  });
  return searchResults;
});

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page, rowId, query } = await loadSearchParams(
    props.searchParams,
  );

  const [project, feature, searchResults] = await Promise.all([
    authClient.getProject({
      projectId: params.pId,
      filter: {
        type: "page",
        page,
        perPage,
      },
    }),
    rowId ? authClient.getRow({ rowId }) : null,
    query ? fetchSearchResults(query, params.pId) : null,
  ]);

  console.log(1111, searchResults);

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

  return (
    <ProjectProvider
      feature={feature?.data}
      project={project.data}
      activeView={activeView}
    >
      <div className="relative h-full">
        {activeView.type === "table" && <TableView />}
        {activeView.type === "map" && <MapView />}
      </div>
    </ProjectProvider>
  );
}
