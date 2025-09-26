export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">{children}</div>
  );
}
