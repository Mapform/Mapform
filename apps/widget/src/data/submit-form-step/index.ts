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
    const [step, formSubmission] = await Promise.all([
      prisma.step.findUnique({
        where: {
          id: stepId,
        },
      }),
      prisma.formSubmission.findUnique({
        where: {
          id: formSubmissionId,
        },
      }),
    ]);

    if (!step) {
      throw new Error("Step not found");
    }

    if (!formSubmission) {
      throw new Error("Form submission not found");
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

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          const block = documentContent.find((b) => b.id === key);

          const column = await prisma.column.findUnique({
            where: {
              blockNoteId: block?.id,
            },
            select: {
              id: true,
            },
          });

          if (!column) {
            throw new Error("Column not found");
          }

          const cellValue = await prisma.cellValue.findUnique({
            where: {
              rowId_columnId: {
                columnId: column.id,
                rowId: formSubmission.rowId,
              },
            },
            include: {
              boolCell: true,
              geometryCell: true,
              stringCell: true,
            },
          });

          if (block?.type === "textInput") {
            if (cellValue?.stringCell) {
              return prisma.stringCell.update({
                where: {
                  id: cellValue.stringCell.id,
                },
                data: {
                  value: value as string,
                },
              });
            }

            return prisma.stringCell.create({
              data: {
                value: value as string,
                cellValue: {
                  create: {
                    columnId: column.id,
                    rowId: formSubmission.rowId,
                  },
                },
              },
            });
          }

          if (block?.type === "pin") {
            if (cellValue?.geometryCell) {
              return prisma.$executeRaw`
                UPDATE "GeometryCell" SET value = ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326)
                WHERE id = ${cellValue.geometryCell.id}
              `;
            }

            const newCellValue = await prisma.cellValue.create({
              data: {
                columnId: column.id,
                rowId: formSubmission.rowId,
              },
            });

            return prisma.$executeRaw`
              INSERT INTO "GeometryCell" (id, cellvalueid, value)
              VALUES (${uuidv4()}, ${newCellValue.id}, ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326));
            `;
          }
        })
      );
    });

    revalidatePath(`/${step.formId}`);
  });
