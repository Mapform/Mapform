"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  users,
  workspaces,
  teamspaces,
  workspaceMemberships,
  teamspaceMemberships,
} from "@mapform/db/schema";
import { completeOnboardingSchema } from "./schema";
import type { AuthClient } from "../../../lib/types";
import { userAuthMiddlewareValidator } from "../../../lib/middleware";
import { ServerError } from "../../../lib/server-error";

export const completeOnboarding = (authClient: AuthClient) =>
  authClient
    .use(userAuthMiddlewareValidator)
    .schema(completeOnboardingSchema)
    .action(
      async ({
        parsedInput: { userName, workspaceName, workspaceSlug },
        ctx: { user },
      }) => {
        return db
          .transaction(async (tx) => {
            await tx
              .update(users)
              .set({
                name: userName,
                hasOnboarded: true,
              })
              .where(eq(users.id, user.id));

            const [workspace] = await tx
              .insert(workspaces)
              .values({
                slug: workspaceSlug,
                name: workspaceName,
              })
              .returning();

            const teamspaceName = "Personal";
            const teamspaceSlug = "personal";

            if (!workspace) {
              throw new Error("Failed to create workspace");
            }

            await tx.insert(workspaceMemberships).values({
              userId: user.id,
              workspaceId: workspace.id,
              role: "owner",
            });

            const [teamspace] = await tx
              .insert(teamspaces)
              .values({
                slug: teamspaceSlug,
                name: teamspaceName,
                workspaceSlug,
              })
              .returning();

            if (!teamspace) {
              throw new Error("Failed to create teamspace");
            }

            await tx.insert(teamspaceMemberships).values({
              userId: user.id,
              teamspaceId: teamspace.id,
              role: "owner",
            });

            return workspace;
          })
          .catch((error) => {
            if (error) {
              if ((error as unknown as { code: string }).code === "23505") {
                throw new ServerError("Workspace slug already exists");
              }

              throw new Error("Failed to complete onboarding");
            }
          });
      },
    );
