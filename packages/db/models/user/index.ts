import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.user.findUnique>[0]["include"],
>({ id }: { id: string }, include?: T) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include,
  });

  return user;
}
