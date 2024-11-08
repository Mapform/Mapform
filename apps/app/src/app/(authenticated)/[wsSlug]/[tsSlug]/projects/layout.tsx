export default function TeamspaceLayout({
  children,
  modal,
}: {
  params: { wsSlug: string };
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
