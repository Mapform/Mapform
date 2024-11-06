// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { MapformProvider } from "@mapform/mapform";
import { notFound, redirect } from "next/navigation";
import { getPageDataAction } from "~/data/datalayer/get-page-data";
import { getPageWithLayers } from "~/data/pages/get-page-with-layers";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { listTeamspaceDatasetsAction } from "~/data/datasets/list-teamspace-datasets";
import { ProjectProvider } from "./project-context";
import Project from "./project";
import { PageProvider } from "./page-context";
import { Drawer } from "./drawer";
import { getLayerPointAction } from "~/data/datalayer/get-layer-point";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await getProjectWithPages({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  if (!projectWithPages) {
    return notFound();
  }

  return projectWithPages;
});

const fetchPageWithLayers = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageWithLayersResponse = await getPageWithLayers({
    id,
  });
  const pageWithLayers = pageWithLayersResponse?.data;

  if (!pageWithLayers) {
    return null;
  }

  return pageWithLayers;
});

const fetchAvailableDatasets = cache(
  async (workspaceSlug: string, teamspaceSlug: string) => {
    const availableDatasetsResponse = await listTeamspaceDatasetsAction({
      workspaceSlug,
      teamspaceSlug,
    });
    const availableDatasets = availableDatasetsResponse?.data;

    return availableDatasets;
  },
);

const fetchPageData = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageDataResponse = await getPageDataAction({
    pageId: id,
  });
  const pageData = pageDataResponse?.data;

  return pageData;
});

const fetchLayerPoint = cache(async (layer_point?: string) => {
  if (!layer_point) {
    return undefined;
  }

  const [rowId, pointLayerId] = layer_point.split("_");

  if (!rowId || !pointLayerId) {
    return undefined;
  }

  const layerPointResponse = await getLayerPointAction({
    rowId,
    pointLayerId,
  });

  const layerPoint = layerPointResponse?.data;

  return layerPoint;
});

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
  searchParams?: {
    page?: string;
    layer?: string;
    layer_point?: string;
  };
}) {
  const { pId } = params;

  const [
    projectWithPages,
    pageWithLayers,
    availableDatasets,
    pageData,
    layerPoint,
  ] = await Promise.all([
    fetchProjectWithPages(pId),
    fetchPageWithLayers(searchParams?.page),
    fetchAvailableDatasets(params.wsSlug, params.tsSlug),
    fetchPageData(searchParams?.page),
    fetchLayerPoint(searchParams?.layer_point),
  ]);

  const fallbackPage = projectWithPages.pages[0]?.id;

  if (!pageWithLayers) {
    if (!fallbackPage) {
      return notFound();
    }

    redirect(
      `/${params.wsSlug}/${params.tsSlug}/projects/${pId}?page=${projectWithPages.pages[0]?.id}`,
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4">
      <MapformProvider>
        <ProjectProvider
          projectWithPages={projectWithPages}
          layerPoint={layerPoint}
        >
          <PageProvider
            availableDatasets={availableDatasets ?? []}
            pageData={pageData}
            pageWithLayers={pageWithLayers}
          >
            <div className="bg-background -m-4 flex flex-1 flex-col overflow-hidden">
              <Project />
            </div>
            <Drawer />
          </PageProvider>
        </ProjectProvider>
      </MapformProvider>
    </div>
  );
}
