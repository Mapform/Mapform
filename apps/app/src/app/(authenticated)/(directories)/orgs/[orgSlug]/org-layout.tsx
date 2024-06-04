import { Skeleton } from "@mapform/ui/components/skeleton";
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
    <div className="relative flex-1 p-6">
      <div className="md:flex md:items-center md:justify-between relative">
        {isLoading ? (
          <Skeleton className="w-48 h-6" />
        ) : (
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {name}
          </h3>
        )}
        <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
          <CreateDialog disabled={isLoading} organizationSlug={slug} />
        </div>
      </div>
      <div className="mt-4 border-b border-gray-200">
        <Tabs tabs={tabs} />
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
