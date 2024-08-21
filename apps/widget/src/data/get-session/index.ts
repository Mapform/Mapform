"server-only";

import { prisma } from "@mapform/db";

export async function getSession(formSubmissionId: string, formId: string) {
  return prisma.formSubmission.findUnique({
    where: {
      id: formSubmissionId,
      publishedFormId: formId,
    },
  });
}
