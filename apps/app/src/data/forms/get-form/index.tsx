import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";

export async function getForm({ formId }: { formId: string }) {
  const session = await auth();
  const userId = session?.user?.id;

  return prisma.form.findUnique({
    where: {
      id: formId,
      workspace: {
        organization: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      isRoot: true,
      isClosed: true,
      isDirty: true,
      _count: {
        select: { formVersions: true },
      },
    },
  });
}

export type Form = NonNullable<Awaited<ReturnType<typeof getForm>>>;
