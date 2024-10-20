import { RootLayout } from "./root-layout";

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
    <RootLayout workspaceSlug={params.wsSlug} navSlot={nav}>
      {children}
    </RootLayout>
  );
}
