export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      {children}
    </div>
  );
}
