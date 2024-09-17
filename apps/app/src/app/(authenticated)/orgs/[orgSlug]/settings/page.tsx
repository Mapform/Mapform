import { prisma } from "@mapform/db";
import { auth } from "~/lib/auth";

export default async function Settings({
  params,
}: {
  params: { orgSlug: string };
}) {
  const session = await auth();

  const currentOrg = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
      members: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
    include: {
      workspaces: true,
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-base font-semibold leading-6 text-stone-900 mb-4">
        Settings
      </h3>
    </div>
  );
}
