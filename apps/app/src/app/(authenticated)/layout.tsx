import { ClerkProvider } from "@clerk/nextjs";
import StackedLayout from "./StackedLayout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <StackedLayout>{children}</StackedLayout>
    </ClerkProvider>
  );
}
