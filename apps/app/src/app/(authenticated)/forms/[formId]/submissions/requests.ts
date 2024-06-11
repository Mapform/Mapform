import { prisma } from "@mapform/db";

export function getFormSubmissions({ formId }: { formId: string }) {
  return prisma.formSubmission.findMany({
    where: {
      form: {
        draftForm: {
          id: formId,
        },
      },
    },
    include: {
      inputResponses: true,
      form: {
        include: {
          steps: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type FormSubmissions = NonNullable<
  Awaited<ReturnType<typeof getFormSubmissions>>
>;
