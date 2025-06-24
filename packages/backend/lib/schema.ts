import {
  selectUserSchema,
  selectWorkspaceMembershipSchema,
  selectWorkspaceSchema,
  selectTeamspaceSchema,
} from "@mapform/db/schema";
import { z } from "zod/v4";

export const userAuthSchema = z.object({
  authType: z.literal("user"),
  user: selectUserSchema.extend({
    workspaceMemberships: selectWorkspaceMembershipSchema
      .extend({
        workspace: selectWorkspaceSchema.pick({ id: true, slug: true }).extend({
          teamspaces: selectTeamspaceSchema
            .pick({ id: true, slug: true })
            .array(),
        }),
      })
      .array(),
  }),
  userAccess: z.object({
    workspace: z.object({
      checkAccessBySlug: z.function({
        input: [z.string()],
        output: z.boolean(),
      }),
      checkAccessById: z.function({
        input: [z.string()],
        output: z.boolean(),
      }),
    }),
    teamspace: z.object({
      ids: z.array(z.string()),
      checkAccessBySlug: z.function({
        input: [z.string(), z.string()],
        output: z.boolean(),
      }),
      checkAccessById: z.function({
        input: [z.string()],
        output: z.boolean(),
      }),
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
