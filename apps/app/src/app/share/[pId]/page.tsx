import React, { cache } from "react";
import { cookies } from "next/headers";
import { Mapform } from "~/components/mapform";
import { type Row } from "@mapform/db/schema";
import { publicClient } from "~/lib/safe-action";
import { Map } from "./map";
import type { Responses } from "@mapform/backend/data/rows/get-responses";
import { BoxIcon } from "lucide-react";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await publicClient.getProjectWithPages({
    id,
  });

  const projectWithPages = projectWithPagesResponse?.data;

  return projectWithPages;
});

const fetchPageData = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const pageDataResponse = await publicClient.getPageData({
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
      ? await publicClient.getLayerPoint({
          rowId,
          pointLayerId: subLayerId,
        })
      : await publicClient.getLayerMarker({
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
  const formValues: NonNullable<NonNullable<Responses>["data"]>["cells"] = [];

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
  const isUsingSessions = Boolean(projectWithPages.submissionsDataset);

  if (isUsingSessions && submissionCookie) {
    session = (await publicClient.getSession({ rowId: submissionCookie.value }))
      ?.data;

    if (session) {
      const responsesResponse = await publicClient.getResponses({
        id: session.id,
      });
      const responses = responsesResponse?.data;

      formValues.push(...(responses?.cells ?? []));
    }
  }

  if (projectWithPages.visibility === "closed") {
    return (
      <div className="flex h-screen flex-1 flex-col justify-center px-2 pb-8">
        <div className="text-center">
          <BoxIcon className="mx-auto size-8 text-gray-400" />
          <h3 className="text-foreground mt-2 text-xl font-semibold">
            This project is closed
          </h3>
          <p className="text-based mt-1 text-gray-500">
            If you have access to this project, you can view it by signing in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-screen">
      <Mapform>
        <Map
          formValues={formValues}
          isUsingSessions={isUsingSessions}
          pageData={pageData}
          projectWithPages={projectWithPages}
          selectedFeature={selectedFeature}
          sessionId={session?.id ?? null}
        />
      </Mapform>
    </div>
  );
}
