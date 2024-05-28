"use server";

import { prisma } from "@mapform/db";
import { action } from "~/lib/safe-action";
import { createFormSubmissionSchema } from "./schema";

export const createFormSubmission = action(
  createFormSubmissionSchema,
  async ({ formId }) => {
    const formSubmission = await prisma.formSubmission.create({
      data: {
        formId,
      },
    });

    return formSubmission.id;
  }
);
