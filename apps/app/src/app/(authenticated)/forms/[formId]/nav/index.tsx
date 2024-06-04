"use client";

import { type Form } from "@mapform/db";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Clipboard } from "@mapform/ui/components/clipboard";
import { Spinner } from "@mapform/ui/components/spinner";
import { TopBar } from "~/components/top-bar";
import { publishForm } from "~/server/actions/forms/publish";

export function Nav({ form }: { form: Form }) {
  const { execute, status } = useAction(publishForm);

  return (
    <TopBar>
      <div className="flex">
        <div className="flex gap-2 ml-auto">
          {form.publishedFormId ? (
            <Clipboard
              clipboardText={`http://localhost:3001/${form.publishedFormId}`}
              copiedText="Copied!"
              copyText="Copy link"
              variant="ghost"
            />
          ) : null}
          <Button
            disabled={!form.isDirty || status === "executing"}
            onClick={() => {
              execute({ formId: form.id });
            }}
            variant="outline"
          >
            {status === "executing" ? <Spinner variant="dark" /> : "Publish"}
          </Button>
        </div>
      </div>
    </TopBar>
  );
}
