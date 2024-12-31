import { NavSlot } from "~/components/nav-slot";
import { CreateProjectDialog } from "~/components/create-project-dialog";
import { Button } from "@mapform/ui/components/button";

export default async function Nav(props: {
  params: Promise<{ wsSlug: string; tsSlug: string }>;
}) {
  const params = await props.params;
  return (
    <NavSlot
      // actions={<CreateDialog tsSlug={params.tsSlug} />}
      actions={
        <CreateProjectDialog tsSlug={params.tsSlug}>
          <Button size="sm">Create Project</Button>
        </CreateProjectDialog>
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
        // {
        //   name: "Settings",
        //   href: `/${params.wsSlug}/${params.tsSlug}/settings`,
        // },
      ]}
    />
  );
}
