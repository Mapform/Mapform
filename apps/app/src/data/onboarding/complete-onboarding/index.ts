"use server";

import { redirect } from "next/navigation";
import { catchError } from "@mapform/lib/catch-error";
import { completeOnboarding } from "@mapform/backend/onboarding/complete-onboarding";
import { completeOnboardingSchema } from "@mapform/backend/onboarding/complete-onboarding/schema";
import { authAction } from "~/lib/safe-action";
import { ServerError } from "~/lib/server-error";

export const completeOnboardingAction = authAction
  .schema(completeOnboardingSchema)
  .action(
    async ({
      parsedInput: { userName, workspaceName, workspaceSlug },
      ctx: { user },
    }) => {
      const [error, workspace] = await catchError(
        completeOnboarding({
          userName,
          workspaceName,
          workspaceSlug,
          userId: user.id,
        }),
      );

      if (error) {
        if ((error as unknown as { code: string }).code === "23505") {
          throw new ServerError("Workspace slug already exists");
        }

        throw new Error("Failed to complete onboarding");
      }

      redirect(`/app/${workspace.slug}`);
    },
  );
