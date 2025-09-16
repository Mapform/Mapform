import {
  selectUserSchema,
  selectWorkspaceMembershipSchema,
  selectWorkspaceSchema,
  selectTeamspaceSchema,
} from "@mapform/db/schema";
import type { db } from "@mapform/db";
import { z } from "zod";

export const userAuthSchema = z.object({
  authType: z.literal("user"),
  user: selectUserSchema.merge(
    z.object({
      workspaceMemberships: z.array(
        selectWorkspaceMembershipSchema.merge(
          z.object({
            workspace: selectWorkspaceSchema
              .pick({ id: true, slug: true })
              .merge(
                z.object({
                  teamspaces: z.array(
                    selectTeamspaceSchema.pick({ id: true, slug: true }),
                  ),
                }),
              ),
          }),
        ),
      ),
    }),
  ),
  userAccess: z.object({
    workspace: z.object({
      checkAccessBySlug: z.function().args(z.string()).returns(z.boolean()),
      checkAccessById: z.function().args(z.string()).returns(z.boolean()),
    }),
    teamspace: z.object({
      ids: z.array(z.string()),
      checkAccessBySlug: z
        .function()
        .args(z.string(), z.string())
        .returns(z.boolean()),
      checkAccessById: z.function().args(z.string()).returns(z.boolean()),
    }),
  }),
  db: z.custom<typeof db>(),
});

export const apiAuthSchema = z.object({
  authType: z.literal("api"),
  apiKey: z.string(),
});

export const publicSchema = z.object({
  authType: z.literal("public"),
  db: z.custom<typeof db>(),
});

export const publicOrUserAuthSchema = z.union([publicSchema, userAuthSchema]);

export const userOrPublicOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicSchema,
  apiAuthSchema,
]);
