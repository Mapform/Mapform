"use server";

import { z } from "zod";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { formModel } from "@mapform/db/models";
import { v4 as uuidv4 } from "uuid";

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

  // This works 🎉
  // TODO:
  // 1. Figure out how to get ids working
  const locationId = uuidv4();
  // 2. Pass the location id to the step creation step
  const stepLocation = await prisma.$queryRaw`
      INSERT INTO "Location" (geom, id)
      VALUES(ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), ${locationId})
    `;

  await prisma.step.create({
    data: {
      type: validatedFields.data.type,
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: location.zoom,
      pitch: location.pitch,
      bearing: location.bearing,
      formId,
      locationId,
    },
  });

  revalidatePath("/");
};

export const getForm = async (
  formSlug: string,
  workspaceSlug: string,
  orgSlug: string
) => {
  return formModel.findOne(
    {
      slug: formSlug.toLocaleLowerCase(),
      workspaceSlug: workspaceSlug.toLocaleLowerCase(),
      organizationSlug: orgSlug.toLocaleLowerCase(),
    },
    {
      steps: {
        include: {
          location: true,
        },
      },
    }
  );
};

export type FormType = Awaited<ReturnType<typeof getForm>>;
