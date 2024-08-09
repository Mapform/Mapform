"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Spinner } from "@mapform/ui/components/spinner";
import { Clipboard } from "@mapform/ui/components/clipboard";
import { publishForm } from "~/data/forms/publish";

export function ShareContent({
  formId,
  isDirty,
  numberOfVersions,
}: {
  formId: string;
  isDirty: boolean;
  numberOfVersions: number;
}) {
  const { execute, status } = useAction(publishForm);
  const hasBeenPublished = numberOfVersions > 0;

  return (
    <div className="space-y-2">
      {hasBeenPublished ? (
        <div className="space-y-1">
          <Clipboard
            className="w-full justify-start"
            clipboardText={
              process.env.NODE_ENV === "production"
                ? `mapform.co/${formId}`
                : `localhost:3001/${formId}`
            }
            copiedText="Copied!"
            copyText="Copy shareable link"
            size="sm"
            variant="ghost"
          />
        </div>
      ) : (
        <div className="p-4 bg-stone-50 rounded text-sm text-stone-500 text-center">
          Form not yet been published.
        </div>
      )}
      <Button
        className="w-full mt-4"
        disabled={!isDirty || status === "executing"}
        onClick={() => {
          execute({ formId });
        }}
        variant="outline"
      >
        {status === "executing" ? <Spinner variant="dark" /> : "Publish"}
      </Button>
      <p className="text-xs text-muted-foreground">
        Publishing will create a new form version.
      </p>
    </div>
  );
}
