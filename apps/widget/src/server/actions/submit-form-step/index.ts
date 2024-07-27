"use server";

import { v4 as uuidv4 } from "uuid";
import { prisma } from "@mapform/db";
import { revalidatePath } from "next/cache";
import { getFormSchemaFromBlockNote } from "@mapform/blocknote";
import { action } from "~/lib/safe-action";
import { submitFormStepSchema } from "./schema";
import { connect } from "http2";

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
                rowId: formSubmissionId,
              },
            },
            include: {
              boolCell: true,
              pointCell: true,
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
                    rowId: formSubmissionId,
                  },
                },
              },
            });
          }

          if (block?.type === "pin") {
            if (cellValue?.pointCell) {
              return prisma.$executeRaw`
                UPDATE "PointCell" SET value = ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326)
                WHERE id = ${cellValue.pointCell.id}
              `;
            }

            const newCellValue = await prisma.cellValue.create({
              data: {
                columnId: column.id,
                rowId: formSubmissionId,
              },
            });

            return prisma.$executeRaw`
              INSERT INTO "PointCell" (id, cellvalueid, value)
              VALUES (${uuidv4()}, ${newCellValue.id}, ST_SetSRID(ST_MakePoint(${value.longitude}, ${value.latitude}), 4326));
            `;
          }
        })
      );
    });

    revalidatePath(`/${step.formId}`);
  });
