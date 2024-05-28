"use server";

import { prisma } from "@mapform/db";
import { getZodSchemaFromBlockNote } from "@mapform/mapform/lib/zod-schema-from-blocknote";
import { action } from "~/lib/safe-action";
import { submitFormStepSchema } from "./schema";

export const submitFormStep = action(
  submitFormStepSchema,
  async ({ stepId, formSubmissionId, payload }) => {
    const step = await prisma.step.findUnique({
      where: {
        id: stepId,
      },
    });

    console.log(stepId, step);

    if (!step) {
      throw new Error("Step not found");
    }

    // TODO: VALIDATION

    const validationSchema = getZodSchemaFromBlockNote(
      (step.description as any).content
    );

    const { data, error } = validationSchema.safeParse(payload);

    if (error) {
      throw new Error("Invalid payload");
    }

    await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        const block = (step.description as any).content.find(
          (b) => b.id === key
        );

        if (block?.type === "short-text-input") {
          return prisma.shortTextInputResponse.upsert({
            create: {
              formSubmissionId,
              stepId,
              blockNoteId: key,
              value: value as string,
              title: block.props.label,
            },
            update: {
              formSubmissionId,
              stepId,
              blockNoteId: key,
              value: value as string,
              title: block.props.label,
            },
            where: {
              blockNoteId_formSubmissionId: {
                blockNoteId: key,
                formSubmissionId,
              },
            },
          });
        }
      })
    );

    // return formSubmissionStep;
  }
);
