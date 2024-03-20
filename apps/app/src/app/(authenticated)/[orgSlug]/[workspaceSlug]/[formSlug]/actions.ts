"use server";

import { z } from "zod";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";

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

  await prisma.step.create({
    data: {
      type: validatedFields.data.type,
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: location.zoom,
      pitch: location.pitch,
      bearing: location.bearing,
      formId,
    },
  });

  revalidatePath("/");
};
