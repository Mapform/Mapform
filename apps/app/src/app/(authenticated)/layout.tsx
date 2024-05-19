import { ClerkProvider } from "@clerk/nextjs";
import { StackedLayout } from "./StackedLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 h-full">
      <ClerkProvider>
        <StackedLayout>{children}</StackedLayout>
      </ClerkProvider>
    </div>
  );
}
