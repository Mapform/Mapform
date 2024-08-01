import { prisma } from "@mapform/db";

export async function getForm(formId: string) {
  return prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      _count: {
        select: { formVersions: true },
      },
    },
  });
}

export type Form = NonNullable<Awaited<ReturnType<typeof getForm>>>;
