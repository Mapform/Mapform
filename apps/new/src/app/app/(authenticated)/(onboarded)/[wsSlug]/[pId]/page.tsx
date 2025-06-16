import { notFound, redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { TableView } from "./table-view";
import type { QUERY_PARAMS } from "~/constants/query-params";

export default async function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<{ [QUERY_PARAMS.VIEW]: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const project = await authClient.getProject({
    projectId: params.pId,
  });

  if (!project) {
    return notFound();
  }

  const activeView = project.data?.views.find(
    (view) => view.id === searchParams.v,
  );

  if (!activeView) {
    const firstView = project.data?.views.find((v) => v.position === 0);

    if (!firstView) {
      return notFound();
    }

    redirect(`/app/${params.wsSlug}/${params.pId}?v=${firstView.id}`);
  }

  return (
    <ProjectProvider project={project.data} activeView={activeView}>
      {activeView.type === "table" && <TableView />}
    </ProjectProvider>
  );
}
