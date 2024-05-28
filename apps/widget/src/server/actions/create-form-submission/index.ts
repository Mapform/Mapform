"use server";

import { prisma } from "@mapform/db";
import { cookies } from "next/headers";
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

    cookies().set("mapform-form-submission", formSubmission.id);

    return formSubmission.id;
  }
);
