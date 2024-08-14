"use server";

import slugify from "slugify";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { createFormSchema } from "./schema";

const initialViewState = {
  longitude: -122.4,
  latitude: 37.8,
  zoom: 14,
  bearing: 0,
  pitch: 0,
};

export const createForm = authAction
  .schema(createFormSchema)
  .action(async ({ parsedInput: { name, workspaceId } }) => {
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // TODO: Check if user has access to the workspace

    const newForm = await prisma.form.create({
      data: {
        slug,
        name,
        isRoot: true,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        dataset: {
          create: {
            name: `${name} dataset`,
            workspaceId,
          },
        },
      },
    });

    /**
     * Add a default step
     */
    await prisma.step.createWithLocation({
      formId: newForm.id,
      zoom: initialViewState.zoom,
      pitch: initialViewState.pitch,
      bearing: initialViewState.bearing,
      latitude: initialViewState.latitude,
      longitude: initialViewState.longitude,
    });

    revalidatePath("/");
  });
