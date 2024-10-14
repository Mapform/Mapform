"use client";

import * as Portal from "@radix-ui/react-portal";
import { useStandardLayout } from "../../../standard-layout/context";
import { useEffect } from "react";

export function Drawer() {
  const { drawerRef, setDrawerExists } = useStandardLayout();

  useEffect(() => {
    setDrawerExists(true);
    return () => setDrawerExists(false);
  }, []);

  return (
    <Portal.Root container={drawerRef.current}>
      <div className="flex flex-col w-[300px] flex-shrink-0 px-4 pb-2 border-l">
        <div className="h-[50px] flex items-center">
          <h3 className="font-semibold">Pages</h3>
        </div>
        {/* <PagePicker /> */}
      </div>
    </Portal.Root>
  );
}
