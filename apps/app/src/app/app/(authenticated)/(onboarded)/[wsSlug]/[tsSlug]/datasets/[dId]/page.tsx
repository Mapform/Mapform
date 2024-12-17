import { notFound } from "next/navigation";
import { cache } from "react";
import { DataTable } from "~/components/data-table";
import { authClient } from "~/lib/safe-action";

const fetchDataset = cache(async (dId: string) => {
  const datasetResponse = await authClient.getDataset({
    datasetId: dId,
  });

  const dataset = datasetResponse?.data;

  if (dataset === undefined) {
    return notFound();
  }

  return dataset;
});

export default async function DatasetPage(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; dId: string }>;
}) {
  const params = await props.params;
  const dataset = await fetchDataset(params.dId);

  return <DataTable dataset={dataset} />;
}
