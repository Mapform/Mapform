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

    const formSubmission = await prisma.row.create({
      data: {
        publishedFormId: formId,
        datasetId: form.rootForm.datasetId,
      },
    });

    cookies().set("mapform-form-submission", formSubmission.id);

    return formSubmission.id;

    // const formSubmission = await prisma.formSubmission.create({
    //   data: {
    //     formId,
    //   },
    // });

    // cookies().set("mapform-form-submission", formSubmission.id);

    // return formSubmission.id;
  });
