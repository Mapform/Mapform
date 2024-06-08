"use client";

import { type Form } from "@mapform/db";
import { usePathname } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Clipboard } from "@mapform/ui/components/clipboard";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { TopBar } from "~/components/top-bar";
import { publishForm } from "~/server/actions/forms/publish";

export function Nav({ form }: { form: Form }) {
  const pathname = usePathname();
  const { execute, status } = useAction(publishForm);

  const tabs = [
    {
      name: "Create",
      href: `/forms/${form.id}`,
    },
    // {
    //   name: "Branding",
    //   href: `/forms/${form.id}/branding`,
    // },
    {
      name: "Submissions",
      href: `/forms/${form.id}/submissions`,
    },
  ];

  return (
    <TopBar>
      <div className="flex justify-between items-center">
        {/* LEFT */}
        <div className="text-sm text-gray-700 font-semibold">{form.name}</div>

        {/* CENTER */}
        <div className="mt-0.5 space-x-4">
          {tabs.map((tab) => (
            <a
              className={cn(
                tab.href === pathname
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
              )}
              href={tab.href}
              key={tab.name}
            >
              {tab.name}
            </a>
          ))}
        </div>

        {/* RIGHT
        
        
        
        */}
        <div className="flex gap-2">
          {form.publishedFormId ? (
            <Clipboard
              clipboardText={`http://localhost:3001/${form.publishedFormId}`}
              copiedText="Copied!"
              copyText="Copy link"
              size="sm"
              variant="ghost"
            />
          ) : null}
          <Button
            disabled={!form.isDirty || status === "executing"}
            onClick={() => {
              execute({ formId: form.id });
            }}
            size="sm"
            variant="outline"
          >
            {status === "executing" ? <Spinner variant="dark" /> : "Publish"}
          </Button>
        </div>
      </div>
    </TopBar>
  );
}
