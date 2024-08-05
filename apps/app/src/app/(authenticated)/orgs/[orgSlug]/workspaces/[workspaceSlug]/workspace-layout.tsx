import { Tabs } from "~/components/tabs";

interface WorkspaceLayoutProps {
  orgSlug: string;
  workspaceSlug: string;
  workspaceId: string;
  name?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function WorkspaceLayout({
  orgSlug,
  workspaceSlug,
  name,
  children,
  action,
}: WorkspaceLayoutProps) {
  const tabs = [
    { name: "Forms", href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}` },
    {
      name: "Datasets",
      href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}/datasets`,
    },
    {
      name: "Settings",
      href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}/settings`,
    },
  ];

  return (
    <Tabs action={action} name={name} tabs={tabs}>
      {children}
    </Tabs>
  );
}
