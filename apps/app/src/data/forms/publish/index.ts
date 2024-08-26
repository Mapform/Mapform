"use server";

import { v4 as uuidv4 } from "uuid";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { authAction } from "~/lib/safe-action";
import { publishFormSchema } from "./schema";

/**
 * When we publish, we always create a new form version. By keeping track of
 * version history, we can allow users to revert to previous versions, and we
 * can show more detailed submission results.
 */
export const publishForm = authAction
  .schema(publishFormSchema)
  .action(async ({ parsedInput: { formId } }) => {
    const rootForm = await prisma.form.findUnique({
      where: {
        id: formId,
        isRoot: true,
      },
      include: {
        layers: {
          include: {
            pointLayer: true,
          },
        },
        _count: {
          select: { formVersions: true },
        },
      },
    });

    if (!rootForm) {
      throw new Error("Form not found");
    }

    const steps = await prisma.step.findManyWithLocation({
      formId: rootForm.id,
    });

    /**
     * Note: We create with empty stepOrder since we need to create brand new steps and log those IDs later on.
     * Note 2: Transactions currently don't work due to the createWithLocation extension.
     */
    await prisma.$transaction(async (tx) => {
      const newPublishedForm = await prisma.form.create({
        data: {
          name: rootForm.name,
          slug: rootForm.slug,
          stepOrder: [],
          workspaceId: rootForm.workspaceId,
          isRoot: false,
          rootFormId: rootForm.id,
          version: rootForm._count.formVersions + 1,
        },
      });

      const rootLayersWithIds = rootForm.layers.map((layer) => ({
        ...layer,
        newId: uuidv4(),
      }));

      // /**
      //  * We duplidate the layers and sub layer types for the new form.
      //  * We do NOT duplicate the data itself (dataset).
      //  */
      const newLayers = await prisma.layer.createManyAndReturn({
        data: rootLayersWithIds.map((layer) => ({
          id: layer.newId,
          type: layer.type,
          formId: newPublishedForm.id,
          datasetId: layer.datasetId,
        })),
      });

      const pointLayersToCreate = rootLayersWithIds
        .map((layer) => ({
          pointColumnId: layer.pointLayer?.pointColumnId,
          layerId: newLayers.find((l) => l.id === layer.newId)?.id,
        }))
        .filter((layer) => layer.pointColumnId) as {
        pointColumnId: string;
        layerId: string;
      }[];

      await tx.pointLayer.createManyAndReturn({
        data: pointLayersToCreate,
      });

      // TODO: Improve this. This query is very slow and inefficient.Note that
      // createWithLocation creates a stepOrder on the form. Steps must be created
      // sequentially and NOT in parallel, otherwise the step order will be
      // incorrect.
      for (const step of steps) {
        // eslint-disable-next-line no-await-in-loop -- We want to execute sequentially
        await prisma.step.createWithLocation({
          formId: newPublishedForm.id,
          zoom: step.zoom,
          pitch: step.pitch,
          bearing: step.bearing,
          latitude: step.latitude,
          longitude: step.longitude,
          title: step.title,
          description: step.description || undefined,
          layerOrder: step.layerOrder,
          layers: {
            connect: rootLayersWithIds
              .map((layer) => ({
                id: newLayers.find((l) => l.id === layer.newId)?.id,
              }))
              .filter((l) => l.id),
          },
        });
      }

      await prisma.form.update({
        where: {
          id: rootForm.id,
        },
        data: {
          isDirty: false,
        },
      });
    });

    revalidatePath("/");
  });
