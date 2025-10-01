"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useAuth } from "~/app/root-providers";
import {
  WelcomeTour as WT,
  WelcomeTourContent,
} from "~/components/tours/welcome-tour";
import { updateCurrentUserAction } from "~/data/users/update-current-user";

export function WelcomeTour() {
  const { user } = useAuth();

  const [isTourOpen, setIsTourOpen] = useState(!user?.workspaceGuideCompleted);
  const { execute } = useAction(updateCurrentUserAction);

  return (
    <WT
      open={isTourOpen}
      onOpenChange={(open) => {
        setIsTourOpen(open);
        if (!open) {
          execute({
            workspaceGuideCompleted: true,
          });
        }
      }}
    >
      <WelcomeTourContent className="fixed bottom-0 right-0" />
    </WT>
  );
}
