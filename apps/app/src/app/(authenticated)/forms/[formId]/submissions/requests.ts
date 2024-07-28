import { prisma } from "@mapform/db";

export async function getFormData({ formId }: { formId: string }) {
  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      dataset: {
        include: {
          columns: true,
          rows: {
            include: {
              formSubmission: true,
              cellValues: {
                include: {
                  boolCell: true,
                  pointCell: true,
                  stringCell: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return form;
}
