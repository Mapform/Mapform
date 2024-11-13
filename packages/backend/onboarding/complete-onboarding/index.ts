import slugify from "slugify";
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
  name,
  userId,
}: CompleteOnboardingSchema & { userId: string }) => {
  const randomChars = Math.random().toString(36).substring(7);

  const workspaceName = `${name}'s Mapform`;
  const workspacelug = `${slugify(workspaceName, {
    lower: true,
    strict: true,
  })}-${randomChars}`;

  const teamspaceName = "Personal";
  const teamspaceSlug = "personal";

  return db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        name,
        hasOnboarded: true,
      })
      .where(eq(users.id, userId));

    const [workspace] = await tx
      .insert(workspaces)
      .values({
        slug: workspacelug,
        name: workspaceName,
      })
      .returning();

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
        workspaceSlug: workspacelug,
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
