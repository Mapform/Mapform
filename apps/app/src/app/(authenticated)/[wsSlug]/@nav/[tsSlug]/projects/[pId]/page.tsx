import { NavSlot } from "~/components/nav-slot";

export default function Nav({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; pId: string };
}) {
  return (
    <NavSlot
      tabs={[
        {
          name: "Create",
          href: `/${params.wsSlug}/${params.tsSlug}/projects/${params.pId}`,
        },
        {
          name: "Submissions",
          href: `/${params.wsSlug}/${params.tsSlug}/datasets`,
        },
      ]}
    />
  );
}
