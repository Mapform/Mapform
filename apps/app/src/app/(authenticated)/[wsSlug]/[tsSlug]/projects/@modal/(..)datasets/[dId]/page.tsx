import { getDatasetAction } from "~/data/datasets/get-dataset";
import { DataTable } from "~/components/data-table";
import { Modal } from "./modal";

export default async function DatasetPage({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; dId: string };
}) {
  const datasetResponse = await getDatasetAction({ datasetId: params.dId });
  const dataset = datasetResponse?.data;

  if (!dataset) {
    return null;
  }

  return (
    <Modal>
      <DataTable dataset={dataset} />
    </Modal>
  );
}
