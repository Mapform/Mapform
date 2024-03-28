import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.organization.findUnique>[0]["include"],
>(
  {
    slug,
  }: {
    slug: string;
  },
  include?: T
) {
  const organization = await prisma.organization.findUnique({
    where: {
      slug,
    },
    include,
  });

  return organization;
}
