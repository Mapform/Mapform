import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 h-full">
      <ClerkProvider>
        <div className="flex flex-col h-full">{children}</div>
      </ClerkProvider>
    </div>
  );
}
