"use client";

import type { Dispatch, SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { deleteStep } from "~/server/actions/steps/delete";
import { useCreateQueryString } from "~/lib/create-query-string";

interface DeleteButtonProps {
  stepId: string;
  setDragSteps: Dispatch<SetStateAction<string[]>>;
}

export function DeleteButton({ stepId, setDragSteps }: DeleteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();
  const { execute, status } = useAction(deleteStep);

  return (
    <Button
      disabled={status === "executing"}
      onClick={() => {
        execute({ stepId });
        setDragSteps((prev) => {
          const newDragSteps = prev.filter((step) => step !== stepId);
          const lastDragStep = newDragSteps[newDragSteps.length - 1];

          if (lastDragStep) {
            router.push(`${pathname}?${createQueryString("s", lastDragStep)}`);
          }

          return newDragSteps;
        });
      }}
      variant="destructive"
    >
      Delete this step
    </Button>
  );
}
