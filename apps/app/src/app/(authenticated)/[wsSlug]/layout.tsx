import { StandardLayout } from "./standard-layout";

export default async function WorkspaceLayout({
  params,
  children,
  nav,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <StandardLayout workspaceSlug={params.wsSlug} navSlot={nav}>
      {children}
    </StandardLayout>
  );
}
