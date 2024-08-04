import { StandardLayout } from "~/components/standard-layout";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  params: { orgSlug?: string };
}) {
  return (
    <StandardLayout
      bottomContent={
        <>
          <h3 className="text-xs font-semibold leading-6 text-gray-400 mt-8">
            Resources
          </h3>
          <ul className="-mx-2 space-y-1 my-2"></ul>
        </>
      }
      currentOrgSlug={params.orgSlug}
      topContent={
        <>
          <h3 className="text-xs font-semibold leading-6 text-gray-400 mt-8">
            Workspaces
          </h3>
          <ul className="-mx-2 space-y-1 my-2"></ul>
        </>
      }
    >
      {children}
    </StandardLayout>
  );
}
