"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Spinner } from "@mapform/ui/components/spinner";
import { Clipboard } from "@mapform/ui/components/clipboard";
import { publishProjectAction } from "~/data/projects/publish-project";
import { env } from "~/env.mjs";

export function ShareContent({
  projectId,
  isDirty,
  numberOfVersions,
}: {
  projectId: string;
  isDirty: boolean;
  numberOfVersions: number;
}) {
  const { execute, status } = useAction(publishProjectAction);
  const hasBeenPublished = numberOfVersions > 0;

  console.log(99999, env);

  return (
    <div className="space-y-2">
      {hasBeenPublished ? (
        <div className="space-y-1">
          <Clipboard
            className="w-full justify-start"
            clipboardText={`${env.NEXT_PUBLIC_BASE_URL}/share/${projectId}`}
            copiedText="Copied!"
            copyText="Copy shareable link"
            size="sm"
            variant="ghost"
          />
        </div>
      ) : (
        <div className="rounded bg-stone-50 p-4 text-center text-sm text-stone-500">
          Project has not yet been published.
        </div>
      )}
      <Button
        className="mt-4 w-full"
        disabled={!isDirty || status === "executing"}
        onClick={() => {
          execute({ projectId });
        }}
        variant="outline"
      >
        {status === "executing" ? <Spinner variant="dark" /> : "Publish"}
      </Button>
    </div>
  );
}
