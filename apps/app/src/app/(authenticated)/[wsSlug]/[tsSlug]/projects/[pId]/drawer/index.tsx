"use client";

import * as Portal from "@radix-ui/react-portal";
import { useIsClient } from "@mapform/lib/hooks/use-is-client";
import { useStandardLayout } from "../../../../standard-layout/context";
import { PagePicker } from "./page-picker";

export function Drawer() {
  const isClient = useIsClient();
  const { drawerRef } = useStandardLayout();

  if (!isClient) return null;

  return (
    <Portal.Root container={drawerRef.current}>
      <div className="h-[50px] flex items-center">
        <h3 className="font-semibold">Pages</h3>
      </div>
      <PagePicker />
    </Portal.Root>
  );
}
