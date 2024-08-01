"use client";

import { usePathname } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Clipboard } from "@mapform/ui/components/clipboard";
import { Spinner } from "@mapform/ui/components/spinner";
import { cn } from "@mapform/lib/classnames";
import { TopBar } from "~/components/top-bar";
import { publishForm } from "~/data/forms/publish";
import { type Form } from "../requests";

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
      <div className="grid grid-cols-3 items-center">
        {/* LEFT */}
        <div className="text-sm text-gray-700 font-semibold">{form.name}</div>

        {/* CENTER */}
        <div className="mt-5 space-x-4 flex justify-center">
          {tabs.map((tab) => (
            <a
              className={cn(
                tab.href === pathname
                  ? "border-primary text-primary"
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

        {/* RIGHT */}
        <div className="flex gap-2 justify-end">
          {form._count.formVersions > 0 ? (
            <Clipboard
              clipboardText={`http://localhost:3001/${form.id}`}
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
