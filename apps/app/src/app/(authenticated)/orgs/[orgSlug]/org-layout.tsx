import { Tabs } from "~/components/tabs";
import { CreateDialog } from "./dialog";

interface OrgLayoutProps {
  slug: string;
  name?: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function OrgLayout({
  slug,
  name,
  children,
  isLoading = false,
}: OrgLayoutProps) {
  const tabs = [
    { name: "Workspaces", href: `/orgs/${slug}` },
    {
      name: "Settings",
      href: `/orgs/${slug}/settings`,
    },
  ];

  return (
    <Tabs
      action={<CreateDialog disabled={isLoading} organizationSlug={slug} />}
      isLoading={isLoading}
      name={name}
      tabs={tabs}
    >
      {children}
    </Tabs>
  );
}
