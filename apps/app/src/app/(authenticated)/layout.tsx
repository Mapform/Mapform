import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@mapform/ui/components/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <ClerkProvider>
        <div className="flex flex-col h-full">{children}</div>
        <Toaster />
      </ClerkProvider>
    </div>
  );
}
