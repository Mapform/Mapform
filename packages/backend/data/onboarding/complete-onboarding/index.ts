import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  users,
  workspaces,
  teamspaces,
  workspaceMemberships,
  teamspaceMemberships,
} from "@mapform/db/schema";
import type { CompleteOnboardingSchema } from "./schema";

export const completeOnboarding = async ({
  userName,
  workspaceName,
  workspaceSlug,
  userId,
}: CompleteOnboardingSchema & { userId: string }) => {
  return db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        name: userName,
        hasOnboarded: true,
      })
      .where(eq(users.id, userId));

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
      userId,
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
      userId,
      teamspaceId: teamspace.id,
      role: "owner",
    });

    return workspace;
  });
};
