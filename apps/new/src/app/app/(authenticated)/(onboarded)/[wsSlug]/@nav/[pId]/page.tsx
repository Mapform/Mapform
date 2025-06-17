import { NavSlot } from "~/components/nav-slot";
import { Import } from "./import";

export default async function Nav({
  params,
}: {
  params: Promise<{ wsSlug: string; pId: string }>;
}) {
  const { pId } = await params;

  return (
    <NavSlot
      actions={
        <div className="flex items-center">
          <Import projectId={pId} />
        </div>
      }
    />
  );
}
