import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.organization.findUnique>[0]["include"],
  U extends Prisma.OrganizationGetPayload<{
    include: T;
  }>,
>(slug: string, include?: T): Promise<U | null> {
  const organization = (await prisma.organization.findUnique({
    where: {
      slug,
    },
    include,
  })) as U;

  return organization;
}
