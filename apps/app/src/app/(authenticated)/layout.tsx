import { ClerkProvider } from "@clerk/nextjs";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <main>{children}</main>
    </ClerkProvider>
  );
}
