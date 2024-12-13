import { getDatasetAction } from "~/actions/datasets/get-dataset";
import { DataTable } from "~/components/data-table";
import { Modal } from "./modal";

export default async function DatasetPage(props: {
  params: Promise<{ wsSlug: string; tsSlug: string; dId: string }>;
}) {
  const params = await props.params;
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
