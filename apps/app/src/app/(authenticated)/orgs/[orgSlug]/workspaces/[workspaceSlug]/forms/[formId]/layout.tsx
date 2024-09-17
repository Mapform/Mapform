import { Tabs } from "~/components/tabs";
import { getForm } from "~/data/forms/get-form";

export default async function Layout({
  params,
  children,
  actions,
}: {
  params: { orgSlug: string; workspaceSlug: string; formId: string };
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const form = await getForm({
    formId: params.formId,
  });

  if (!form) {
    return null;
  }

  const tabs = [
    {
      name: "Create",
      href: `/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}/forms/${params.formId}`,
    },
    {
      name: "Submissions",
      href: `/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}/datasets/${form.datasetId}`,
      isExternal: true,
    },
  ];

  return (
    <Tabs
      action={actions}
      nameSections={[
        {
          name: form.workspace.name,
          href: `/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}`,
        },
        { name: form.name },
      ]}
      tabs={tabs}
    >
      {children}
    </Tabs>
  );
}
