import { Tabs } from "~/components/tabs";
import { CreateDialog } from "./dialog";

interface OrgLayoutProps {
  orgSlug: string;
  workspaceSlug: string;
  workspaceId: string;
  name: string;
  children: React.ReactNode;
}

export default function WorkspaceLayout({
  orgSlug,
  workspaceSlug,
  workspaceId,
  name,
  children,
}: OrgLayoutProps) {
  const tabs = [
    { name: "Forms", href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}` },
    {
      name: "Settings",
      href: `/orgs/${orgSlug}/workspaces/${workspaceSlug}/settings`,
    },
  ];

  return (
    <div className="relative flex-1 p-6">
      <div className="md:flex md:items-center md:justify-between relative">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {name}
        </h3>
        <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
          <CreateDialog workspaceId={workspaceId} />
        </div>
      </div>
      <div className="mt-4 border-b border-gray-200">
        <Tabs tabs={tabs} />
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
