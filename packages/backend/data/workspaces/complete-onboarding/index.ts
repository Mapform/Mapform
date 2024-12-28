"server-only";

import { db } from "@mapform/db";
import { eq } from "@mapform/db/utils";
import {
  users,
  workspaces,
  teamspaces,
  workspaceMemberships,
  teamspaceMemberships,
  plans,
} from "@mapform/db/schema";
import Stripe from "stripe";
import { completeOnboardingSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";
import { env } from "../../../env.mjs";
import { PLANS } from "../../../constants/plans";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const completeOnboarding = (authClient: UserAuthClient) =>
  authClient
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

            // Create Stripe customer
            const customer = await stripe.customers.create({
              name: workspaceName, // Workspace name
              email: user.email, // Billing email associated with the workspace
            });

            await tx.insert(plans).values({
              name: PLANS.basic.name,
              workspaceSlug: workspace.slug,
              stripeCustomerId: customer.id,
              subscriptionStatus: "active",
              rowLimit: PLANS.basic.rowLimit,
            });

            return workspace;
          })
          .catch((error) => {
            if (error) {
              if ((error as unknown as { code: string }).code === "23505") {
                throw new ServerError("Workspace slug already exists");
              }
              throw new Error("Failed to complete onboarding: " + error);
            }
          });
      },
    );
