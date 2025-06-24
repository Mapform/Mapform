import {
  selectUserSchema,
  selectWorkspaceMembershipSchema,
  selectWorkspaceSchema,
  selectTeamspaceSchema,
} from "@mapform/db/schema";
import { z } from "zod/v4";

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
});

export const apiAuthSchema = z.object({
  authType: z.literal("api"),
  apiKey: z.string(),
});

export const publicSchema = z.object({ authType: z.literal("public") });

export const publicOrUserAuthSchema = z.union([publicSchema, userAuthSchema]);

export const userOrPublicOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicSchema,
  apiAuthSchema,
]);
