import Image from "next/image";
import React, { cache } from "react";
import { cookies } from "next/headers";
import { Mapform } from "~/components/mapform";
import { publicClient } from "~/lib/safe-action";
import { Map } from "./map";
import type { GetSubmission } from "@mapform/backend/data/form-submissions/get-submission";
import mapform from "public/static/images/mapform.svg";
import Link from "next/link";
import { ERROR_CODES_USER } from "@mapform/backend/lib/server-error";

const fetchProjectWithPages = cache(async (id: string) => {
  const projectWithPagesResponse = await publicClient.getProjectWithPages({
    id,
  });

  return projectWithPagesResponse;
});

const fetchFatures = cache(async (id?: string) => {
  if (!id) {
    return undefined;
  }

  const featuresResponse = await publicClient.getFeatures({
    pageId: id,
  });
  const features = featuresResponse?.data;

  return features;
});

const fetchSelectedFeature = cache(async (param?: string) => {
  if (!param) {
    return undefined;
  }

  const [rowId, layerId] = param.split("_");

  if (!rowId || !layerId) {
    return undefined;
  }

  const featureResponse = await publicClient.getFeature({
    rowId,
    layerId,
  });

  const feature = featureResponse?.data;

  return feature;
});

// The root Project Id
export default async function Page(props: {
  params: Promise<{ pId: string; wsSlug: string }>;
  searchParams?: Promise<{
    p?: string;
    feature?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const submissionCookie = cookieStore.get("mapform-submission");
  const formValues: NonNullable<
    NonNullable<GetSubmission>["data"]
  >["row"]["cells"] = [];

  const params = await props.params;

  const [projectWithPagesResponse, features, selectedFeature] =
    await Promise.all([
      fetchProjectWithPages(params.pId),
      fetchFatures(searchParams?.p),
      fetchSelectedFeature(searchParams?.feature),
    ]);

  let formSubmissionId: string | null = null;
  const projectWithPages = projectWithPagesResponse?.data;

  if (projectWithPagesResponse?.serverError) {
    if (
      projectWithPagesResponse.serverError ===
      ERROR_CODES_USER.ROW_LIMIT_EXCEEDED
    ) {
      return (
        <WarningScreen
          title="Submission limit reached"
          description="This project has reached its submission limit. Please contact the project owner to increase the limit."
        />
      );
    }

    return (
      <WarningScreen
        title="Project error"
        description="There was an error loading this project. Please try again later."
      />
    );
  }

  if (
    !projectWithPages ||
    projectWithPages.teamspace.workspace.slug !== params.wsSlug
  ) {
    return (
      <WarningScreen
        title="Project not found"
        description="The project you are trying to view does not exist."
      />
    );
  }

  if (!projectWithPages.pages.length) {
    return (
      <WarningScreen
        title="Project has no pages"
        description="The project you are trying to view does not have any pages."
      />
    );
  }

  const isUsingSessions = Boolean(projectWithPages.submissionsDataset);

  if (isUsingSessions && submissionCookie) {
    const response = (
      await publicClient.getSubmission({
        submissionId: submissionCookie.value,
      })
    )?.data;

    if (response) {
      if (response.row.datasetId !== projectWithPages.datasetId) {
        // This should never happen unless the user has tampered with the cookie
        throw new Error("The project and submission datasets do not match.");
      }

      formSubmissionId = response.id;
      formValues.push(...response.row.cells);
    }
  }

  if (projectWithPages.visibility === "closed") {
    return (
      <WarningScreen
        title="This project is closed"
        description="If you have access to this project, you can view it by signing in."
      />
    );
  }

  return (
    <div className="md:h-screen">
      <Mapform>
        <Map
          formValues={formValues}
          isUsingSessions={isUsingSessions}
          features={features}
          projectWithPages={projectWithPages}
          selectedFeature={selectedFeature}
          formSubmissionId={formSubmissionId}
        />
      </Mapform>
    </div>
  );
}

function WarningScreen({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-2 pb-8">
      <div className="text-center">
        <Link href="https://mapform.co">
          <Image
            alt="Logo"
            className="mx-auto size-8 text-gray-400"
            src={mapform}
          />
        </Link>
        <h3 className="text-foreground mt-2 text-xl font-semibold">{title}</h3>
        <p className="text-based mt-1 text-gray-500">{description}</p>
      </div>
    </div>
  );
}
