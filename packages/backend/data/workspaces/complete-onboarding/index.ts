"server-only";

import { eq } from "@mapform/db/utils";
import { sql } from "@mapform/db";
import {
  users,
  workspaces,
  teamspaces,
  workspaceMemberships,
  teamspaceMemberships,
  plans,
  projects,
  views,
  mapViews,
} from "@mapform/db/schema";
import Stripe from "stripe";
import { PLANS } from "@mapform/lib/constants/plans";
import { completeOnboardingSchema } from "./schema";
import type { UserAuthClient } from "../../../lib/types";
import { ServerError } from "../../../lib/server-error";
import { env } from "../../../env.mjs";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const completeOnboarding = (authClient: UserAuthClient) =>
  authClient
    .schema(completeOnboardingSchema)
    .action(
      async ({
        parsedInput: { userName, workspaceName, workspaceSlug },
        ctx: { user, db },
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

            const teamspaceName = "My Maps";
            const teamspaceSlug = "my-maps";

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
                ownerUserId: user.id,
                isPrivate: true,
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

            // Scaffold two default projects with a default map view each
            const defaultCenter = sql.raw(
              `ST_GeomFromGeoJSON('{"type":"Point","coordinates":[0,0]}')`,
            );

            const [wantToGo] = await tx
              .insert(projects)
              .values({
                name: "Want to go",
                icon: "🌎",
                teamspaceId: teamspace.id,
                position: 1,
                center: defaultCenter,
              })
              .returning();

            if (wantToGo) {
              const [wtgView] = await tx
                .insert(views)
                .values({ projectId: wantToGo.id, type: "map" })
                .returning();
              if (wtgView) {
                await tx.insert(mapViews).values({ viewId: wtgView.id });
              }
            }

            const [favourites] = await tx
              .insert(projects)
              .values({
                name: "Favourites",
                icon: "⭐️",
                teamspaceId: teamspace.id,
                position: 0,
                center: defaultCenter,
              })
              .returning();

            if (favourites) {
              const [favView] = await tx
                .insert(views)
                .values({ projectId: favourites.id, type: "map" })
                .returning();
              if (favView) {
                await tx.insert(mapViews).values({ viewId: favView.id });
              }
            }

            // Create Stripe customer
            const customer = await stripe.customers.create({
              name: workspaceName, // Workspace name
              email: user.email, // Billing email associated with the workspace
            });

            await tx.insert(plans).values({
              name: PLANS.basic.name,
              workspaceSlug: workspace.slug,
              stripeCustomerId: customer.id,
              rowLimit: PLANS.basic.rowLimit,
              dailyAiTokenLimit: PLANS.basic.dailyAiTokenLimit,
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
