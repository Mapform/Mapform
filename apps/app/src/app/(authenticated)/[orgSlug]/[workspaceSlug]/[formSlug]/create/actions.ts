"use server";

import { z } from "zod";
import type { Step } from "@mapform/db";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { formModel } from "@mapform/db/models";

const schema = z.object({
  type: z.enum(["SHORT_TEXT", "LONG_TEXT", "CONTENT"]),
});

export const createStep = async (
  formId: string,
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  },
  formData: FormData
) => {
  const validatedFields = schema.safeParse({
    type: formData.get("type"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  /**
   * This uses the Prisma extension to create a step with a location
   */
  await prisma.step.createWithLocation({
    formId,
    type: validatedFields.data.type,
    zoom: location.zoom,
    pitch: location.pitch,
    bearing: location.bearing,
    latitude: location.latitude,
    longitude: location.longitude,
  });

  revalidatePath("/");
};

export const getForm = async (
  formSlug: string,
  workspaceSlug: string,
  orgSlug: string
) => {
  return formModel.findOne({
    slug: formSlug.toLocaleLowerCase(),
    workspaceSlug: workspaceSlug.toLocaleLowerCase(),
    organizationSlug: orgSlug.toLocaleLowerCase(),
  });
};

export const getSteps = async (
  formId: string
): Promise<(Step & { latitude: number; longitude: number })[]> => {
  return prisma.$queryRaw`
    SELECT "Step".*, ST_X("Location".geom) AS longitude, ST_Y("Location".geom) AS latitude
    FROM "Step"
    LEFT JOIN "Location" ON "Step"."locationId" = "Location".id
    WHERE "Step"."formId" = ${formId};
  `;
};

export const getLocation = async (locationId: string) => {
  return prisma.$queryRaw`
    SELECT ST_X(geom) AS longitude, ST_Y(geom) AS latitude FROM "Location" WHERE id = ${locationId}
  `;
};

export type FormType = Awaited<ReturnType<typeof getForm>>;
export type StepsType = Awaited<ReturnType<typeof getSteps>>;
