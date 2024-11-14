import { RootLayout } from "./root-layout";

export default async function WorkspaceLayout(
  props: {
    params: Promise<{ wsSlug: string }>;
    children: React.ReactNode;
    nav?: React.ReactNode;
  }
) {
  const params = await props.params;

  const {
    children,
    nav
  } = props;

  return (
    <RootLayout navSlot={nav} workspaceSlug={params.wsSlug}>
      {children}
    </RootLayout>
  );
}
