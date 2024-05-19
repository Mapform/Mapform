import { formModel } from "@mapform/db/models";
import { Nav } from "./nav";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string; workspaceSlug: string; formSlug: string };
}) {
  const form = await formModel.findOne({
    slug: params.formSlug.toLocaleLowerCase(),
    workspaceSlug: params.workspaceSlug.toLocaleLowerCase(),
    organizationSlug: params.orgSlug.toLocaleLowerCase(),
    isPublished: false,
  });

  if (!form) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col">
      <Nav formId={form.id} />
      {children}
    </div>
  );
}
