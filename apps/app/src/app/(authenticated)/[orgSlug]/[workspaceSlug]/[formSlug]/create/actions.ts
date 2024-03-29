"use server";

import { z } from "zod";
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

export const getSteps = (formId: string) => {
  return prisma.step.findManyWithLocation({
    formId,
  });
};

export const updateStep = async ({
  title,
  description,
  stepId,
}: {
  title?: string;
  description?: string;
  stepId: string;
}) => {
  return prisma.step.update({
    where: {
      id: stepId,
    },
    data: {
      title,
      description,
    },
  });
};

export const deleteStep = (stepId: string) => {
  return prisma.step.deleteWithLocation({
    stepId,
  });
};

export type FormType = Awaited<ReturnType<typeof getForm>>;
export type StepsType = Awaited<ReturnType<typeof getSteps>>;
