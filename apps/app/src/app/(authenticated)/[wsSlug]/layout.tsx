import { RootLayout } from "./root-layout";

export default function WorkspaceLayout({
  params,
  children,
  nav,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
  nav?: React.ReactNode;
}) {
  return (
    <RootLayout navSlot={nav} workspaceSlug={params.wsSlug}>
      {children}
    </RootLayout>
  );
}
