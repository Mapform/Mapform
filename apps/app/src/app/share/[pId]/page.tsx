// eslint-disable-next-line import/named -- It will work when React 19 is released
import React, { cache } from "react";
import { cookies } from "next/headers";
import { MapformProvider } from "@mapform/mapform";
import { type Row } from "@mapform/db/schema";
import { getSession } from "~/data/share/get-session";
import { getPageDataAction } from "~/data/share/get-page-data";
import { getProjectWithPagesAction } from "~/data/share/get-project-with-pages";
import { type Responses, getResponses } from "~/data/share/get-responses.ts";
import { getLayerPointAction } from "~/data/share/get-layer-point";
import { Map } from "./map";
import { getLayermarkerAction } from "~/data/datalayer/get-layer-marker";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await getProjectWithPagesAction({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  return projectWithPages;
});

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
      ? await getLayerPointAction({
          rowId,
          pointLayerId: subLayerId,
        })
      : await getLayermarkerAction({
          rowId,
          markerLayerId: subLayerId,
        });

  const feature = featureResponse?.data;

  return feature;
});

// The root Project Id
export default async function Page(props: {
  params: Promise<{ pId: string }>;
  searchParams?: Promise<{
    p?: string;
    feature?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const params = await props.params;
  const [projectWithPages, pageData, selectedFeature] = await Promise.all([
    fetchProjectWithPages(params.pId),
    fetchPageData(searchParams?.p),
    fetchSelectedFeature(searchParams?.feature),
  ]);

  const cookieStore = await cookies();
  const submissionCookie = cookieStore.get("mapform-submission");
  const projectCookie = cookieStore.get("mapform-project-id");
  const formValues: NonNullable<Responses>["cells"] = [];

  let session: Row | undefined;

  if (!projectWithPages) {
    return <div>Project not found</div>;
  }

  if (!projectWithPages.pages.length) {
    return <div>Project has no pages</div>;
  }

  /**
   * A project version mismatch occurs when a new version has been released
   */
  const projectVersionMismatch = projectCookie?.value !== projectWithPages.id;
  const isUsingSessions = Boolean(projectWithPages.submissionsDataset);

  if (isUsingSessions && submissionCookie) {
    session = await getSession(submissionCookie.value);

    if (session && !projectVersionMismatch) {
      const responsesResponse = await getResponses({ id: session.id });
      const responses = responsesResponse?.data;

      formValues.push(...(responses?.cells ?? []));
    }
  }

  return (
    <div className="md:h-screen">
      <MapformProvider>
        <Map
          formValues={formValues}
          isUsingSessions={isUsingSessions}
          pageData={pageData}
          projectWithPages={projectWithPages}
          selectedFeature={selectedFeature}
          // We clear the session id if the form id doesn't match the current form
          sessionId={!projectVersionMismatch && session ? session.id : null}
        />
      </MapformProvider>
    </div>
  );
}
