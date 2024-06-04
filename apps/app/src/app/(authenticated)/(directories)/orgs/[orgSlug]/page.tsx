import Link from "next/link";
import { prisma } from "@mapform/db";
import OrgLayout from "./org-layout";

export default async function Organization({
  params,
}: {
  params: { orgSlug: string };
  children: React.ReactNode;
}) {
  const currentOrg = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
    include: {
      workspaces: true,
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return (
    <OrgLayout name={currentOrg.name} slug={params.orgSlug}>
      <ul className="flex flex-wrap">
        {currentOrg.workspaces.map((workspace) => (
          <li
            className="overflow-hidden rounded-xl border w-72"
            key={workspace.id}
          >
            <Link href={`/orgs/${params.orgSlug}/workspaces/${workspace.slug}`}>
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-white p-6">
                {workspace.name}
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-700">
                    Some text
                    {/* <time dateTime={workspace.lastInvoice.dateTime}>
                      {client.lastInvoice.date}
                    </time> */}
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
