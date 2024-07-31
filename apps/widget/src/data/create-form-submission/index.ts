"use server";

import { prisma } from "@mapform/db";
import { cookies } from "next/headers";
import { action } from "~/lib/safe-action";
import { createFormSubmissionSchema } from "./schema";

export const createFormSubmission = action
  .schema(createFormSubmissionSchema)
  .action(async ({ parsedInput: { formId } }) => {
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
      },
      include: {
        rootForm: {
          select: {
            id: true,
            datasetId: true,
          },
        },
      },
    });

    if (!form?.rootForm) {
      throw new Error("Form not found");
    }

    if (!form.rootForm.datasetId) {
      throw new Error("Form has no dataset");
    }

    const row = await prisma.row.create({
      data: {
        datasetId: form.rootForm.datasetId,
        formSubmission: {
          create: {
            publishedFormId: form.id,
          },
        },
      },
      include: {
        formSubmission: true,
      },
    });

    if (!row.formSubmission) {
      throw new Error("Row not created");
    }

    cookies().set("mapform-form-submission", row.formSubmission.id);

    return row.formSubmission.id;
  });
