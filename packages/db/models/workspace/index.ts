import { prisma } from "../..";
import type { Prisma } from "../..";

export async function findOne<
  T extends Parameters<typeof prisma.workspace.findUnique>[0]["include"],
  U extends Prisma.WorkspaceGetPayload<{
    include: T;
  }>,
>(id: string, include?: T): Promise<U | null> {
  const workspace = (await prisma.workspace.findUnique({
    where: {
      id,
    },
    include,
  })) as U;

  return workspace;
}

export async function create(
  data: Prisma.Args<typeof prisma.workspace, "create">["data"]
) {
  return prisma.workspace.create({
    data,
  });
}
