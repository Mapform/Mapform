import Link from "next/link";
import { format } from "date-fns";
import { listTeamspaceDatasetsAction } from "~/data/datasets/list-teamspace-datasets";

export default async function DatasetsPage({
  params,
}: {
  params: { wsSlug: string; tsSlug: string };
}) {
  const teamspaceDatasets = await listTeamspaceDatasetsAction({
    workspaceSlug: params.wsSlug,
    teamspaceSlug: params.tsSlug,
  });
  const datasets = teamspaceDatasets?.data;

  if (!datasets) {
    return <div>Datasets not found</div>;
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
              href={`/${params.wsSlug}/${params.tsSlug}/datasets/${dataset.id}`}
            >
              <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-stone-50 p-6">
                {dataset.name}
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
