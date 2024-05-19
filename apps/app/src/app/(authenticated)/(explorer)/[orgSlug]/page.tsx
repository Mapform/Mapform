import { CreateDialog } from "./dialog";

export default function Organization({
  params,
}: {
  params: { orgSlug: string };
}) {
  return (
    <form>
      <h1>Organization</h1>
      <CreateDialog organizationSlug={params.orgSlug} />
    </form>
  );
}
