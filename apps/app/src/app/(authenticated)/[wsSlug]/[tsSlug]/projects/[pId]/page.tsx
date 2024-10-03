// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { cn } from "@mapform/lib/classnames";
import { MapProvider } from "@mapform/mapform";
import { notFound, redirect } from "next/navigation";
import { getPageData } from "~/data/datalayer/get-page-data";
import { getPageWithLayers } from "~/data/pages/get-page-with-layers";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { listAvailableDatasets } from "~/data/datasets/list-available-datasets";
import { ProjectProvider } from "./project-context";
import Project from "./project";
import { PageProvider } from "./page-context";
import { WorkspaceLayout } from "../../../workspace-layout";

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

const fetchAvailableDatasets = cache(async (id: string) => {
  if (!id) {
    return undefined;
  }

  const availableDatasetsResponse = await listAvailableDatasets({
    projectId: id,
  });
  const availableDatasets = availableDatasetsResponse?.data;

  return availableDatasets;
});

const fetchPageData = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageDataResponse = await getPageData({
    pageId: id,
  });
  const pageData = pageDataResponse?.data;

  return pageData;
});

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
  searchParams?: {
    page?: string;
    edit?: string;
  };
}) {
  const { pId } = params;

  const [projectWithPages, pageWithLayers, availableDatasets, pageData] =
    await Promise.all([
      fetchProjectWithPages(pId),
      fetchPageWithLayers(searchParams?.page),
      searchParams?.edit ? fetchAvailableDatasets(pId) : undefined,
      fetchPageData(searchParams?.page),
    ]);

  if (!pageWithLayers) {
    redirect(
      `/${params.wsSlug}/${params.tsSlug}/projects/${pId}?page=${projectWithPages.pages[0]?.id}`
    );
  }

  return (
    <MapProvider>
      <ProjectProvider projectWithPages={projectWithPages}>
        <PageProvider
          availableDatasets={availableDatasets ?? []}
          pageData={pageData}
          pageWithLayers={pageWithLayers}
        >
          <WorkspaceLayout
            initialShowNav={false}
            pathNav={[
              {
                name: projectWithPages.teamspace.name,
                href: `/${params.wsSlug}/${params.tsSlug}`,
              },
              {
                name: projectWithPages.name,
                href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}`,
              },
            ]}
            tabs={[
              {
                name: "Create",
                href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}`,
              },
              ...(projectWithPages.submissionsDataset
                ? [
                    {
                      name: "Submissions",
                      href: `/${params.wsSlug}/${params.tsSlug}/datasets/${projectWithPages.submissionsDataset.id}`,
                      isExternal: true,
                    },
                  ]
                : []),
            ]}
            currentWorkspaceSlug={params.wsSlug}
            drawerContent={<div>Test</div>}
          >
            <div className="-m-4 flex flex-col flex-1 overflow-hidden bg-background">
              <Project />
            </div>
          </WorkspaceLayout>
        </PageProvider>
      </ProjectProvider>
    </MapProvider>
  );
}
