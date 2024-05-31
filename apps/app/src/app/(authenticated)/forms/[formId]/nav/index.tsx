"use client";

import { type Form } from "@mapform/db";
import { Button } from "@mapform/ui/components/button";
import { TopBar } from "~/components/top-bar";
import { publishForm } from "~/server/actions/forms/publish";

export function Nav({ form }: { form: Form }) {
  return (
    <TopBar>
      <div className="flex">
        <div className="flex gap-2 ml-auto">
          {form.publishedFormId ? (
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `http://localhost:3001/${form.publishedFormId}`
                );
              }}
              variant="outline"
            >
              Copy link
            </Button>
          ) : null}
          <Button
            disabled={!form.isDirty}
            onClick={() => publishForm({ formId: form.id })}
            variant="outline"
          >
            Publish
          </Button>
        </div>
      </div>
    </TopBar>
  );
}
