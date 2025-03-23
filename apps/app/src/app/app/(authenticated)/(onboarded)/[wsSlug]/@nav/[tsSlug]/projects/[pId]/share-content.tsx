"use client";

import { Clipboard } from "@mapform/ui/components/clipboard";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { env } from "~/env.mjs";

export function ShareContent({
  project,
}: {
  project: NonNullable<GetProjectWithPages["data"]>;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="space-y-1">
        <Clipboard
          className="w-full justify-start"
          clipboardText={`${env.NEXT_PUBLIC_BASE_URL}/share/${project.id}`}
          copiedText="Copied!"
          copyText="Copy shareable link"
          size="sm"
          variant="ghost"
        />
      </div>
    </div>
  );
}
