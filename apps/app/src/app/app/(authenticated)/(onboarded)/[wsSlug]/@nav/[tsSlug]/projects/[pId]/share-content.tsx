"use client";

import { useAction } from "next-safe-action/hooks";
import { Button } from "@mapform/ui/components/button";
import { Spinner } from "@mapform/ui/components/spinner";
import { Clipboard } from "@mapform/ui/components/clipboard";
import type { GetProjectWithPages } from "@mapform/backend/data/projects/get-project-with-pages";
import { publishProjectAction } from "~/data/projects/publish-project";
import { env } from "~/env.mjs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@mapform/ui/components/tooltip";
import { TriangleAlertIcon } from "lucide-react";
import { toast } from "@mapform/ui/components/toaster";

export function ShareContent({
  project,
  isDirty,
  numberOfVersions,
}: {
  project: NonNullable<GetProjectWithPages["data"]>;
  isDirty: boolean;
  numberOfVersions: number;
}) {
  const { execute, isPending } = useAction(publishProjectAction, {
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your project has been published.",
      });
    },
    onError: ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: error.serverError,
        });
        return;
      }

      if (error.validationErrors) {
        toast({
          title: "Uh oh! Something went wrong.",
          description:
            "We we unable to publish your project. Please try again.",
        });
      }
    },
  });
  const hasBeenPublished = numberOfVersions > 0;

  const isMissingEndPage =
    project.formsEnabled &&
    !project.pages.some((p) => p.pageType === "page_ending");

  return (
    <div className="flex flex-col space-y-2">
      {hasBeenPublished ? (
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
      ) : (
        <div className="rounded bg-stone-50 p-4 text-center text-sm text-stone-500">
          Project has not yet been published.
        </div>
      )}
      {isMissingEndPage ? (
        <Tooltip>
          <TooltipTrigger>
            <div className="leading-0 flex h-8 flex-1 items-center rounded-lg bg-yellow-50 p-2 shadow-sm">
              <TriangleAlertIcon className="mr-2 size-4 text-yellow-400" />
              <p className="text-sm text-yellow-700">
                An <strong className="font-semibold">End Screen</strong> is
                required.
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-[200px]">
            When using Projects with{" "}
            <strong className="font-semibold">Forms Enabled</strong>, at least
            one <strong className="font-semibold">End Screen</strong> must be
            included before you can publish.
          </TooltipContent>
        </Tooltip>
      ) : null}
      <Button
        className="mt-4 w-full"
        disabled={!isDirty || isPending || isMissingEndPage}
        onClick={() => {
          execute({ projectId: project.id });
        }}
        variant="outline"
      >
        {isPending ? <Spinner variant="dark" /> : "Publish"}
      </Button>
    </div>
  );
}
