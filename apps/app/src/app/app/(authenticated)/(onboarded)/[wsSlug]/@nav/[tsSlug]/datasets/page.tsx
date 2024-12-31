import { NavSlot } from "~/components/nav-slot";
import { CreateDatasetDialog } from "~/components/create-dataset-dialog";
import { Button } from "@mapform/ui/components/button";

export default async function Nav(props: {
  params: Promise<{ wsSlug: string; tsSlug: string }>;
}) {
  const params = await props.params;
  return (
    <NavSlot
      actions={
        <CreateDatasetDialog tsSlug={params.tsSlug}>
          <Button size="sm">Create Dataset</Button>
        </CreateDatasetDialog>
      }
      tabs={[
        {
          name: "Projects",
          href: `/app/${params.wsSlug}/${params.tsSlug}`,
        },
        {
          name: "Datasets",
          href: `/app/${params.wsSlug}/${params.tsSlug}/datasets`,
        },
      ]}
    />
  );
}
