import { notFound, redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { TableView } from "./table-view";
import { MapView } from "./map-view";
import { loadSearchParams } from "./params";
import type { SearchParams } from "nuqs/server";

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page } = await loadSearchParams(props.searchParams);

  const project = await authClient.getProject({
    projectId: params.pId,
    filter: {
      type: "page",
      page,
      perPage,
    },
  });

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
      `/app/${params.wsSlug}/${params.pId}?viewId=${firstView.id}&perPage=${perPage}&page=${page}`,
    );
  }

  return (
    <ProjectProvider project={project.data} activeView={activeView}>
      {activeView.type === "table" && <TableView />}
      {activeView.type === "map" && <MapView />}
    </ProjectProvider>
  );
}
