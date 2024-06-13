"use server";

import { type LocationResponse, prisma } from "@mapform/db";

export type LocationResponseWithLocation = LocationResponse & {
  latitude: number;
  longitude: number;
};

export async function getFormWithSteps(formId: string) {
  const form = (
    await prisma.form.findMany({
      where: { draftFormId: formId },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    })
  )[0];

  if (!form) {
    return null;
  }

  const steps = await prisma.step.findManyWithLocation({
    formId: form.id,
  });

  return {
    ...form,
    steps,
  };
}

export type FormWithSteps = Awaited<ReturnType<typeof getFormWithSteps>>;

export async function getInputValues(formSubmissionId: string) {
  return prisma.inputResponse.findMany({
    where: {
      formSubmissionId,
    },
  });
}

export async function getLocationValues(formSubmissionId: string) {
  // Make raw query to get LocationResponse with Location lat lng
  const locationResponse: LocationResponseWithLocation[] =
    await prisma.$queryRaw`
    SELECT "LocationResponse".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
    FROM "LocationResponse"
    LEFT JOIN "Location" ON "LocationResponse"."locationId" = "Location".id
    WHERE "LocationResponse"."formSubmissionId" = ${formSubmissionId};
  `;

  return locationResponse;
}

export async function getSession(formSubmissionId: string) {
  return prisma.formSubmission.findUnique({
    where: {
      id: formSubmissionId,
    },
  });
}
