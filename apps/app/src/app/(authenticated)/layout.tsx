import { ClerkProvider } from "@clerk/nextjs";
import { StackedLayout } from "./StackedLayout";

export default async function Layout({
  children,
  subnav,
}: {
  children: React.ReactNode;
  subnav: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <StackedLayout subnav={subnav}>{children}</StackedLayout>
    </ClerkProvider>
  );
}
