import { Tabs } from "~/components/tabs";

interface WorkspaceLayoutProps {
  wsSlug: string;
  tsSlug: string;
  name: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function WorkspaceLayout({
  wsSlug,
  tsSlug,
  name,
  children,
  action,
}: WorkspaceLayoutProps) {
  const tabs = [
    { name: "Forms", href: `/orgs/${wsSlug}/workspaces/${tsSlug}` },
    {
      name: "Datasets",
      href: `/orgs/${wsSlug}/workspaces/${tsSlug}/datasets`,
    },
    {
      name: "Settings",
      href: `/orgs/${wsSlug}/workspaces/${tsSlug}/settings`,
    },
  ];

  return (
    <Tabs action={action} nameSections={[{ name }]} tabs={tabs}>
      {children}
    </Tabs>
  );
}
