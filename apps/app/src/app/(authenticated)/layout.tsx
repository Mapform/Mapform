import { Toaster } from "@mapform/ui/components/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden">{children}</div>
      <Toaster />
    </div>
  );
}
