import Link from "next/link";
import { prisma } from "@mapform/db";
import WorkspaceLayout from "../workspace-layout";
import { CreateDialog } from "./create-dialog";

export default async function WorkspaceDatasets({
  params,
}: {
  params: { orgSlug: string; workspaceSlug: string };
}) {
  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: params.workspaceSlug,
      organization: {
        slug: params.orgSlug,
      },
    },
    include: {
      datasets: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { rows: true, columns: true },
          },
        },
      },
    },
  });

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  return (
    <WorkspaceLayout
      action={<CreateDialog workspaceId={workspace.id} />}
      name={workspace.name}
      orgSlug={params.orgSlug}
      workspaceId={workspace.id}
      workspaceSlug={params.workspaceSlug}
    >
      <div>
        <ul className="flex flex-wrap gap-4">
          {workspace.datasets.map((dataset) => (
            <li
              className="overflow-hidden rounded-xl border w-72"
              key={dataset.id}
            >
              <Link href={`/forms/${dataset.id}`}>
                <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                  {dataset.name}
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Columns</dt>
                    <dd className="text-gray-700">{dataset._count.columns}</dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Rows</dt>
                    <dd className="text-gray-700">{dataset._count.rows}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </WorkspaceLayout>
  );
}
