"use client";

import { Button } from "@mapform/ui/components/button";
import { TopBar } from "~/components/top-bar";
import { publishForm } from "./actions";

export function Nav({ formId }: { formId: string }) {
  return (
    <TopBar>
      <div className="flex">
        <Button
          className="ml-auto"
          onClick={() => publishForm({ formId })}
          variant="outline"
        >
          Publish
        </Button>
      </div>
    </TopBar>
  );
}
