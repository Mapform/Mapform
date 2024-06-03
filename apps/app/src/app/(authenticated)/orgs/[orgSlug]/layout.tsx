import { prisma } from "@mapform/db";
import { cn } from "@mapform/lib/classnames";
import { Tabs } from "~/components/tabs";
import { CreateDialog } from "./dialog";

export default async function Organization({
  params,
  children,
}: {
  params: { orgSlug: string };
  children: React.ReactNode;
}) {
  const tabs = [
    { name: "Workspaces", href: `/orgs/${params.orgSlug}` },
    {
      name: "Settings",
      href: `/orgs/${params.orgSlug}/settings`,
    },
  ];

  const currentOrg = await prisma.organization.findUnique({
    where: {
      slug: params.orgSlug,
    },
  });

  if (!currentOrg) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="relative flex-1 p-6">
      <div className="md:flex md:items-center md:justify-between relative">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {currentOrg.name}
        </h3>
        <div className="mt-3 flex md:absolute md:right-0 md:top-3 md:mt-0">
          <CreateDialog organizationSlug={params.orgSlug} />
        </div>
      </div>
      <div className="mt-4 border-b border-gray-200">
        <Tabs tabs={tabs} />
      </div>
      <div className="py-6">{children}</div>
    </div>
  );
}
