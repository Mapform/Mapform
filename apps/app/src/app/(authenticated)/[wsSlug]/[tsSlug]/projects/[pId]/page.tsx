// eslint-disable-next-line import/named -- It will work when React 19 is released
import { cache } from "react";
import { cn } from "@mapform/lib/classnames";
import { MapProvider } from "@mapform/mapform";
import { notFound } from "next/navigation";
import { getPageWithData } from "~/data/pages/get-page-with-data";
import { getProjectWithPages } from "~/data/projects/get-project-with-pages";
import { ProjectProvider } from "./project-context";
import Project from "./project";
import { PageProvider } from "./page-context";
import { listAvailableDatasets } from "~/data/datasets/list-available-datasets";

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

const fetchPageWithData = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageWithDataResponse = await getPageWithData({
    id,
  });
  const pageWithData = pageWithDataResponse?.data;

  if (!pageWithData) {
    return notFound();
  }

  return pageWithData;
});

const fetchAvailableDatasets = cache(async (id: string) => {
  if (!id) {
    return undefined;
  }

  const availableDatasetsResponse = await listAvailableDatasets({
    projectId: id,
  });
  const availableDatasets = availableDatasetsResponse?.data;

  if (!availableDatasets) {
    return notFound();
  }

  return availableDatasets;
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

  const [projectWithPages, pageWithData, availableDatasets] = await Promise.all(
    [
      fetchProjectWithPages(pId),
      fetchPageWithData(searchParams?.page),
      searchParams?.edit && fetchAvailableDatasets(pId),
    ]
  );

  return (
    <div className="-m-4 flex flex-col flex-1 overflow-hidden">
      <MapProvider>
        <ProjectProvider projectWithPages={projectWithPages}>
          <PageProvider
            availableDatasets={availableDatasets}
            pageWithData={pageWithData}
          >
            <div
              className={cn(
                "flex flex-col flex-1 overflow-hidden bg-background"
              )}
            >
              <Project />
            </div>
          </PageProvider>
        </ProjectProvider>
      </MapProvider>
    </div>
  );
}
