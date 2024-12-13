import Link from "next/link";
import { format } from "date-fns";
import { TableIcon } from "lucide-react";
import { listTeamspaceDatasetsAction } from "~/actions/datasets/list-teamspace-datasets";

export default async function DatasetsPage(props: {
  params: Promise<{ wsSlug: string; tsSlug: string }>;
}) {
  const params = await props.params;
  const teamspaceDatasets = await listTeamspaceDatasetsAction({
    workspaceSlug: params.wsSlug,
    teamspaceSlug: params.tsSlug,
  });
  const datasets = teamspaceDatasets?.data;

  if (!datasets?.length) {
    return (
      <div className="flex flex-1 flex-col justify-center pb-8">
        <div className="text-center">
          <TableIcon className="mx-auto size-8 text-gray-400" />
          <h3 className="text-foreground mt-2 text-sm font-semibold">
            No datasets
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new dataset.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4">
      <ul className="flex flex-wrap gap-4">
        {datasets.map((dataset) => (
          <li
            className="w-72 overflow-hidden rounded-xl border"
            key={dataset.id}
          >
            <Link
              href={`/app/${params.wsSlug}/${params.tsSlug}/datasets/${dataset.id}`}
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                {dataset.name || "Untitled"}
              </div>
              <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-stone-500">Created</dt>
                  <dd className="text-stone-700">
                    <time dateTime={dataset.createdAt.toDateString()}>
                      {format(dataset.createdAt, "MMMM do, yyyy")}
                    </time>
                  </dd>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
