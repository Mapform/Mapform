"use client";

import { Dialog, DialogContent } from "@mapform/ui/components/dialog";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={() => {
        // We need to go back twice because the query params get set and add an
        // extra push to the route history
        router.back();
        router.back();
      }}
      open
    >
      <DialogContent
        className="max-w-screen max-h-fit"
        style={{
          height: "calc(100vh - 40px)",
          width: "calc(100vw - 40px)",
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
