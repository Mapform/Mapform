"use server";

import type { z } from "zod";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { formModel } from "@mapform/db/models";
import {
  FormUpdateArgsSchema,
  StepUpdateArgsSchema,
  StepUpdateManyArgsSchema,
} from "@mapform/db/prisma/zod";

export const createStep = async (
  formId: string,
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
  }
) => {
  /**
   * This uses the Prisma extension to create a step with a location
   */
  await prisma.step.createWithLocation({
    formId,
    zoom: location.zoom,
    pitch: location.pitch,
    bearing: location.bearing,
    latitude: location.latitude,
    longitude: location.longitude,
  });

  revalidatePath("/");
};

export const getFormWithSteps = async (
  formSlug: string,
  workspaceSlug: string,
  orgSlug: string
) => {
  const form = await formModel.findOne({
    slug: formSlug.toLocaleLowerCase(),
    workspaceSlug: workspaceSlug.toLocaleLowerCase(),
    organizationSlug: orgSlug.toLocaleLowerCase(),
    isPublished: false,
  });

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
};

/**
 * TODO: Update these to use next-safe-action. Also, do more validation
 */
export const updateForm = async (
  input: z.infer<typeof FormUpdateArgsSchema>
) => {
  const validatedFields = FormUpdateArgsSchema.safeParse(input);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await prisma.form.update(validatedFields.data);

  revalidatePath("/");
};

export const getSteps = (formId: string) => {
  return prisma.step.findManyWithLocation({
    formId,
  });
};

export const updateStep = async (
  input: z.infer<typeof StepUpdateArgsSchema>
) => {
  const validatedFields = StepUpdateArgsSchema.safeParse(input);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  if (!validatedFields.data.data.formId) {
    throw new Error("formId is required");
  }

  await prisma.step.update(validatedFields.data);
  await prisma.form.update({
    where: {
      id: validatedFields.data.data.formId as string,
    },
    data: {
      isDirty: true,
    },
  });

  revalidatePath("/");
};

export const deleteStep = async (stepId: string) => {
  await prisma.step.deleteWithLocation({
    stepId,
  });

  revalidatePath("/");
};

export type StepsType = Awaited<ReturnType<typeof getSteps>>;