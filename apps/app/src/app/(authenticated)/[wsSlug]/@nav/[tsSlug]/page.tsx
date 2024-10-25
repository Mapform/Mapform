import { NavSlot } from "~/components/nav-slot";
import { CreateDialog } from "./dialog";

export default function Nav({
  params,
}: {
  params: { wsSlug: string; tsSlug: string };
}) {
  return (
    <NavSlot
      actions={<CreateDialog tsSlug={params.tsSlug} />}
      tabs={[
        {
          name: "Forms",
          href: `/${params.wsSlug}/${params.tsSlug}`,
        },
        {
          name: "Datasets",
          href: `/${params.wsSlug}/${params.tsSlug}/datasets`,
        },
        {
          name: "Settings",
          href: `/${params.wsSlug}/${params.tsSlug}/settings`,
        },
      ]}
    />
  );
}
