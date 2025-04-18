import { cache } from "react";
import { Mapform } from "~/components/mapform";
import { redirect } from "next/navigation";
import { ProjectProvider } from "./project-context";
import Project from "./project";
import { Drawer } from "./drawer";
import { authClient } from "~/lib/safe-action";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await authClient.getProjectWithPages({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  if (!projectWithPages) {
    return null;
  }

  return projectWithPages;
});

const fetchPageWithLayers = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageWithLayersResponse = await authClient.getPageWithLayers({
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
    const availableDatasetsResponse = await authClient.listTeamspaceDatasets({
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

  const pageDataResponse = await authClient.getPageData({
    pageId: id,
  });
  const pageData = pageDataResponse?.data;

  return pageData;
});

const fetchSelectedFeature = cache(async (param?: string) => {
  if (!param) {
    return undefined;
  }

  const [type, rowId, subLayerId] = param.split("_");

  if (!type || !rowId || !subLayerId) {
    return undefined;
  }

  const featureResponse =
    type === "point"
      ? await authClient.getLayerPoint({
          rowId,
          pointLayerId: subLayerId,
        })
      : await authClient.getLayerMarker({
          rowId,
          markerLayerId: subLayerId,
        });

  const feature = featureResponse?.data;

  return feature;
});

export default async function ProjectPage(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; pId: string }>;
  searchParams?: Promise<{
    page?: string;
    feature?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { pId } = params;

  const [
    projectWithPages,
    pageWithLayers,
    availableDatasets,
    pageData,
    selectedFeature,
  ] = await Promise.all([
    fetchProjectWithPages(pId),
    fetchPageWithLayers(searchParams?.page),
    fetchAvailableDatasets(params.wsSlug, params.tsSlug),
    fetchPageData(searchParams?.page),
    fetchSelectedFeature(searchParams?.feature),
  ]);

  console.log(1111, pageData);

  if (!projectWithPages) {
    return redirect(`/app/${params.wsSlug}/${params.tsSlug}`);
  }

  const fallbackPage = projectWithPages.pages[0]?.id;

  if (!pageWithLayers) {
    if (!fallbackPage) {
      return redirect(`/app/${params.wsSlug}/${params.tsSlug}`);
    }

    redirect(
      `/app/${params.wsSlug}/${params.tsSlug}/projects/${pId}?page=${projectWithPages.pages[0]?.id}`,
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4">
      <Mapform>
        <ProjectProvider
          availableDatasets={availableDatasets ?? []}
          pageData={pageData}
          pageWithLayers={pageWithLayers}
          projectWithPages={projectWithPages}
          selectedFeature={selectedFeature}
        >
          <div className="bg-background -m-4 flex flex-1 flex-col overflow-hidden">
            <Project />
          </div>
          <Drawer />
        </ProjectProvider>
      </Mapform>
    </div>
  );
}
