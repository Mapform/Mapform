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
        dataTracks: {
          include: {
            layers: {
              include: {
                pointLayer: true,
              },
            },
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

      const rootDataTracksWithIds = rootForm.dataTracks.map((dataTrack) => ({
        ...dataTrack,
        newId: uuidv4(),
      }));

      /**
       * We duplidate the datatrack, layers, and sub layer types for the new form.
       * We do NOT duplicate the data itself (dataset).
       */
      const newDataTracks = await prisma.dataTrack.createManyAndReturn({
        data: rootDataTracksWithIds.map((dataTrack) => ({
          id: dataTrack.newId,
          formId: newPublishedForm.id,
          startStepIndex: dataTrack.startStepIndex,
          endStepIndex: dataTrack.endStepIndex,
        })),
      });

      await Promise.all(
        rootDataTracksWithIds.flatMap((dataTrack) =>
          dataTrack.layers.map((layer) => {
            const newDataTrack = newDataTracks.find(
              (ndt) => ndt.id === dataTrack.newId
            );

            if (!newDataTrack) {
              throw new Error("Data track not found");
            }

            if (!layer.pointLayer) {
              throw new Error("Point layer not found");
            }

            return prisma.layer.create({
              data: {
                type: layer.type,
                name: layer.name,
                dataTrackId: newDataTrack.id,
                datasetId: layer.datasetId,
                pointLayer: {
                  create: {
                    pointColumnId: layer.pointLayer.pointColumnId,
                  },
                },
              },
            });
          })
        )
      );

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
