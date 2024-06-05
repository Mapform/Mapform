"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { deleteStep } from "~/server/actions/steps/delete";
import { useCreateQueryString } from "~/lib/create-query-string";
import { type StepsType } from "~/server/actions/forms/get-form-with-steps/schema";

interface DeleteButtonProps {
  stepId: string;
  setDragSteps: React.Dispatch<React.SetStateAction<StepsType>>;
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
          const newDragSteps = prev.filter((step) => step.id !== stepId);
          const lastDragStep = newDragSteps[newDragSteps.length - 1];

          if (lastDragStep) {
            router.push(
              `${pathname}?${createQueryString("s", lastDragStep.id)}`
            );
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
