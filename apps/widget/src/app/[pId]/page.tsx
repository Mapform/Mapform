// eslint-disable-next-line import/named -- It will work when React 19 is released
import React, { cache } from "react";
import { cookies } from "next/headers";
import { MapProvider } from "@mapform/mapform";
import { type Row } from "@mapform/db/schema";
import { getSession } from "~/data/get-session";
import { getPageData } from "~/data/get-page-data";
import { getProjectWithPages } from "~/data/get-project-with-pages";
import { type Responses, getResponses } from "~/data/get-responses.ts";
import { Map } from "./map";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await getProjectWithPages({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  return projectWithPages;
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

// The root Project Id
export default async function Page({
  params,
  searchParams,
}: {
  params: { pId: string };
  searchParams?: {
    p?: string;
  };
}) {
  const [projectWithPages, pageData] = await Promise.all([
    fetchProjectWithPages(params.pId),
    fetchPageData(searchParams?.p),
  ]);

  const cookieStore = cookies();
  const submissionCookie = cookieStore.get("mapform-submission");
  const projectCookie = cookieStore.get("mapform-project-id");
  const formValues: NonNullable<Responses>["cells"] = [];
  const s = searchParams?.p;

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

  if (submissionCookie) {
    session = await getSession(submissionCookie.value);

    if (session && !projectVersionMismatch) {
      const responsesResponse = await getResponses({ id: session.id });
      const responses = responsesResponse?.data;

      formValues.push(...(responses?.cells ?? []));
    }
  }

  return (
    <MapProvider>
      <Map
        formValues={formValues}
        pageData={pageData ?? []}
        projectWithPages={projectWithPages}
        // We clear the session id if the form id doesn't match the current form
        sessionId={!projectVersionMismatch && session ? session.id : null}
      />
    </MapProvider>
  );
}
