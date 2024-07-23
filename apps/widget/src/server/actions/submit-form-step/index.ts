"use server";

import { v4 as uuidv4 } from "uuid";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { getFormSchemaFromBlockNote } from "@mapform/blocknote";
import { action } from "~/lib/safe-action";
import { submitFormStepSchema } from "./schema";

export const submitFormStep = action
  .schema(submitFormStepSchema)
  .action(async ({ parsedInput: { stepId, formSubmissionId, payload } }) => {
    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
      },
    });

    if (!step) {
      throw new Error("Step not found");
    }

    const documentContent = step.description?.content;

    if (!documentContent) {
      throw new Error("Step has no content");
    }

    // TODO: VALIDATION

    const validationSchema = getFormSchemaFromBlockNote(documentContent);

    const { data, error } = validationSchema.safeParse(payload);

    if (error) {
      throw new Error("Invalid payload");
    }

    console.log(1111, data);

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          const block = documentContent.find((b) => b.id === key);

          if (block?.type === "pin" && false) {
            tx.$executeRaw`
              INSERT INTO "PointCell" (id, cellvalueid, value)
              VALUES(${uuidv4()}, ${cell.id}, ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326))
            `;
          }

          // if (block?.type === "textInput") {
          //   return prisma.inputResponse.upsert({
          //     create: {
          //       formSubmissionId,
          //       blockNoteId: key,
          //       value: value as string,
          //       stepId,
          //     },
          //     update: {
          //       formSubmissionId,
          //       blockNoteId: key,
          //       value: value as string,
          //     },
          //     where: {
          //       blockNoteId_formSubmissionId: {
          //         blockNoteId: key,
          //         formSubmissionId,
          //       },
          //     },
          //   });
          // }

          // if (block?.type === "pin") {
          //   // First, create a Location with raw SQL query since Prisma doesn't support Postgis
          //   await prisma.$transaction(async (tx) => {
          //     const currentResponse = await tx.locationResponse.findUnique({
          //       where: {
          //         blockNoteId_formSubmissionId: {
          //           blockNoteId: key,
          //           formSubmissionId,
          //         },
          //       },
          //     });
          //     const currentLocationId = currentResponse?.locationId;

          //     const locationId: { id: number }[] = await tx.$queryRaw`
          //         INSERT INTO "Location" (geom)
          //         VALUES(ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326))
          //         RETURNING id
          //       `;

          //     if (!locationId[0]?.id) {
          //       throw new Error("Failed to create location");
          //     }

          //     await tx.locationResponse.upsert({
          //       create: {
          //         formSubmissionId,
          //         blockNoteId: key,
          //         locationId: locationId[0].id,
          //         stepId,
          //       },
          //       update: {
          //         formSubmissionId,
          //         blockNoteId: key,
          //         locationId: locationId[0].id,
          //       },
          //       where: {
          //         blockNoteId_formSubmissionId: {
          //           blockNoteId: key,
          //           formSubmissionId,
          //         },
          //       },
          //     });

          //     if (currentLocationId) {
          //       await tx.$queryRaw`
          //         DELETE FROM "Location" WHERE id = ${currentLocationId}
          //       `;
          //     }
          //   });
          // }
        })
      );
    });

    revalidatePath(`/${step.formId}`);
  });
