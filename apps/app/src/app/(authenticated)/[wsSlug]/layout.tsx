import { StandardLayout } from "./standard-layout";

export default async function WorkspaceLayout({
  params,
  children,
  nav,
  drawer,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
  nav?: React.ReactNode;
  drawer?: React.ReactNode;
}) {
  return (
    <StandardLayout workspaceSlug={params.wsSlug} navSlot={nav} drawer={drawer}>
      {children}
    </StandardLayout>
  );
}
