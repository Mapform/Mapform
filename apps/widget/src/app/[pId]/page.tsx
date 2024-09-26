import React from "react";
import { cookies } from "next/headers";
import { MapProvider } from "@mapform/mapform";
import { type Row } from "@mapform/db/schema";
import { getSession } from "~/data/get-session";
// import { getStepData } from "~/data/get-step-data";
import { getProjectWithPages } from "~/data/get-project-with-pages";
import { type Responses, getResponses } from "~/data/get-responses.ts";
import { Map } from "./map";

// The root Project Id
export default async function Page({
  params,
  searchParams,
}: {
  params: { pId: string };
  searchParams?: {
    s?: string;
  };
}) {
  const projectWithPagesResponse = await getProjectWithPages({
    id: params.pId,
  });
  const projectWithPages = projectWithPagesResponse?.data;
  const cookieStore = cookies();
  const submissionCookie = cookieStore.get("mapform-submission");
  const projectCookie = cookieStore.get("mapform-project-id");
  const formValues: NonNullable<Responses>["cells"] = [];
  const s = searchParams?.s;

  let session: Row | undefined;
  // let stepData = null;

  if (!projectWithPages) {
    return <div>Project not found</div>;
  }

  if (!projectWithPages.pages.length) {
    return <div>Project has no pages</div>;
  }

  if (submissionCookie) {
    session = await getSession(submissionCookie.value);

    if (session && projectCookie?.value === projectWithPages.id) {
      const responsesResponse = await getResponses({ id: session.id });
      const responses = responsesResponse?.data;

      formValues.push(...(responses?.cells ?? []));
    }
  }

  if (s) {
    // stepData = await getStepData({ stepId: s });
  }

  return (
    <MapProvider>
      <Map
        formValues={formValues}
        projectWithPages={projectWithPages}
        // points={stepData?.data ?? []}
        // We clear the session id if the form id doesn't match the current form
        sessionId={session?.id ?? null}
      />
    </MapProvider>
  );
}
