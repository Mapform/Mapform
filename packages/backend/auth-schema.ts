import { z } from "zod";
import {
  selectUserSchema,
  selectWorkspaceMembershipSchema,
  selectWorkspaceSchema,
  selectTeamspaceSchema,
} from "@mapform/db/schema";

export const userAuthSchema = z.object({
  authType: z.literal("user"),
  authUser: selectUserSchema.merge(
    z.object({
      workspaceMemberships: z.array(
        selectWorkspaceMembershipSchema.merge(
          z.object({
            workspace: selectWorkspaceSchema.pick({ id: true, slug: true }),
            teamspaces: z.array(
              selectTeamspaceSchema.pick({ id: true, slug: true }),
            ),
          }),
        ),
      ),
    }),
  ),
});

export const apiAuthSchema = z.object({
  authType: z.literal("api"),
  authData: z.object({ apiKey: z.string() }),
});

export const publicAuthSchema = z.object({ authType: z.literal("public") });

export const userOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  apiAuthSchema,
]);

export const userOrPublicAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicAuthSchema,
]);

export const userOrPublicOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicAuthSchema,
  apiAuthSchema,
]);
