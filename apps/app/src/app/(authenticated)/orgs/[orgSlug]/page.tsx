import Link from "next/link";
import { prisma } from "@mapform/db";
import { format } from "date-fns";
import { auth } from "~/lib/auth";
import OrgLayout from "./org-layout";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string };
  children: React.ReactNode;
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
      workspaces: {
        include: {
          _count: {
            select: { forms: true },
          },
        },
      },
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return (
    <OrgLayout name={currentOrg.name} slug={params.orgSlug}>
      <ul className="flex flex-wrap gap-4">
        {currentOrg.workspaces.map((workspace) => (
          <li
            className="overflow-hidden rounded-xl border w-72"
            key={workspace.id}
          >
            <Link href={`/orgs/${params.orgSlug}/workspaces/${workspace.slug}`}>
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                {workspace.name}
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-stone-500">Forms</dt>
                  <dd className="text-stone-700">{workspace._count.forms}</dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-stone-500">Created</dt>
                  <dd className="text-stone-700">
                    <time dateTime={workspace.createdAt.toDateString()}>
                      {format(workspace.createdAt, "MMMM do, yyyy")}
                    </time>
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </OrgLayout>
  );
}
