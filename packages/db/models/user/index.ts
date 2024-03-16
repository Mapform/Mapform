import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.user.findUnique>[0]["include"],
  U extends Prisma.UserGetPayload<{
    include: T;
  }>,
>(id: string, include?: T): Promise<U | null> {
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
    include,
  })) as U;

  return user;
}
