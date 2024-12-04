import { NavSlot } from "~/components/nav-slot";
import { CreateDialog } from "./dialog";

export default async function Nav(props: {
  params: Promise<{ wsSlug: string; tsSlug: string }>;
}) {
  const params = await props.params;
  return (
    <NavSlot
      actions={<CreateDialog tsSlug={params.tsSlug} />}
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
