import { notFound, redirect } from "next/navigation";
import { authClient } from "~/lib/safe-action";
import { ProjectProvider } from "./context";
import { loadSearchParams } from "~/lib/params/server";
import type { SearchParams } from "nuqs/server";
import { MapData } from "./map-data";
import { Views } from "./views";
import { Container } from "./container";
import { Suspense } from "react";
import { Skeleton } from "@mapform/ui/components/skeleton";

export default function ViewPage(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Container>
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        }
      >
        <ViewPageInner {...props} />
      </Suspense>
    </Container>
  );
}

export async function ViewPageInner(props: {
  params: Promise<{ wsSlug: string; pId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const params = await props.params;
  const { viewId, perPage, page, rowId } = await loadSearchParams(
    props.searchParams,
  );

  const [project, feature] = await Promise.all([
    authClient.getProject({
      projectId: params.pId,
      filter: {
        type: "page",
        page,
        perPage,
      },
    }),
    rowId ? authClient.getRow({ rowId }) : null,
  ]);

  if (!project) {
    return notFound();
  }

  const activeView = project.data?.views.find((view) => view.id === viewId);

  if (!project.data) {
    return notFound();
  }

  return (
    <ProjectProvider
      feature={feature?.data}
      project={project.data}
      activeView={activeView}
    >
      <Views />
      <MapData />
    </ProjectProvider>
  );
}
