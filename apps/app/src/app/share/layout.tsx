export default function ShareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-full overflow-y-auto">{children}</div>;
}
