import { getDatasetAction } from "~/data/datasets/get-dataset";
import { DataTable } from "~/components/data-table";

export default async function DatasetPage(
  props: {
    params: Promise<{ wsSlug: string; tsSlug: string; dId: string }>;
  }
) {
  const params = await props.params;
  const datasetResponse = await getDatasetAction({ datasetId: params.dId });
  const dataset = datasetResponse?.data;

  if (!dataset) {
    return null;
  }

  return <DataTable dataset={dataset} />;
}
