import { DataTable } from "~/components/data-table";
import { authClient } from "~/lib/safe-action";

export default async function DatasetPage(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; dId: string }>;
}) {
  const params = await props.params;
  const datasetResponse = await authClient.getDataset({
    datasetId: params.dId,
  });
  const dataset = datasetResponse?.data;

  if (!dataset) {
    return null;
  }

  return <DataTable dataset={dataset} />;
}
