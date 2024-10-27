"use client";

import { Dialog, DialogContent } from "@mapform/ui/components/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      onOpenChange={(val) => {
        console.log(11111, val);
        // setOpen(val);
        // router.push(
        //   "http://localhost:3000/nics-mapform-cxyfum/personal/projects/b0e51900-36f9-43a8-9789-7693adef606b?page=3d8ae629-743e-4f3d-8f5f-1010a222f5c6",
        // );

        if (!val) {
          router.back();
        }
      }}
      open={open}
    >
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
