import { Toaster } from "@mapform/ui/components/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-full">{children}</div>
      <Toaster />
    </div>
  );
}
