"use client";

import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { deleteStep } from "~/server/actions/steps/delete";

interface DeleteButtonProps {
  stepId: string;
}

export function DeleteButton({ stepId }: DeleteButtonProps) {
  const { execute, status } = useAction(deleteStep);

  return (
    <Button
      disabled={status === "executing"}
      onClick={() => {
        execute({ stepId });
      }}
      variant="destructive"
    >
      Delete this step
    </Button>
  );
}
