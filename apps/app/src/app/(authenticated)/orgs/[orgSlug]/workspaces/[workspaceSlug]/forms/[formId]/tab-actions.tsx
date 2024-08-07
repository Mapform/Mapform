"use client";

import { Button } from "@mapform/ui/components/button";
import { SendIcon } from "lucide-react";

export function TabActions() {
  return (
    <div className="gap-2">
      <Button variant="outline">
        <SendIcon className="-ml-[2px] mr-2 h-4 w-4" /> Publish
      </Button>
    </div>
  );
}
