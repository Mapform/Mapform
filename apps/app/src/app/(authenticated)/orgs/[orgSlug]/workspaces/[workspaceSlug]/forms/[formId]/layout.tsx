import { Tabs } from "~/components/tabs";

export default function Layout({
  params,
  children,
  actions,
}: {
  params: { orgSlug: string; workspaceSlug: string; formId: string };
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const tabs = [
    {
      name: "Create",
      href: `/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}/forms/${params.formId}`,
    },
    {
      name: "Submissions",
      href: `/orgs/${params.orgSlug}/workspaces/${params.workspaceSlug}/forms/${params.formId}/submissions`,
    },
  ];

  return (
    <Tabs action={actions} name="Some form" tabs={tabs}>
      {children}
    </Tabs>
  );
}
