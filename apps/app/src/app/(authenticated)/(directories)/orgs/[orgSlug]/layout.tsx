import { StandardLayout } from "~/components/standard-layout";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug?: string };
}) {
  return (
    <StandardLayout currentOrgSlug={params.orgSlug}>{children}</StandardLayout>
  );
}
