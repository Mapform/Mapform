"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mapform/ui/components/button";
import { useAction } from "next-safe-action/hooks";
import { deleteStep } from "~/data/steps/delete";
import { useCreateQueryString } from "~/lib/create-query-string";
import { useContainerContext } from "../context";

interface DeleteButtonProps {
  stepId: string;
}

export function DeleteButton({ stepId }: DeleteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCreateQueryString();
  const { execute, status } = useAction(deleteStep);
  const { setDragSteps, setCurrentStep } = useContainerContext();

  return (
    <Button
      disabled={status === "executing"}
      onClick={() => {
        execute({ stepId });
        setDragSteps((prev) => {
          const newDragSteps = prev.filter((step) => step !== stepId);
          const lastDragStep = newDragSteps[newDragSteps.length - 1];

          if (lastDragStep) {
            setCurrentStep(lastDragStep);
            router.push(`${pathname}?${createQueryString("s", lastDragStep)}`);
          }

          return newDragSteps;
        });
      }}
      size="sm"
      variant="destructive"
    >
      Delete this step
    </Button>
  );
}
