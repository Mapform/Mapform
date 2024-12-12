import {
  selectUserSchema,
  selectWorkspaceMembershipSchema,
  selectWorkspaceSchema,
  selectTeamspaceSchema,
} from "@mapform/db/schema";
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
});

export const apiAuthSchema = z.object({
  authType: z.literal("api"),
  apiKey: z.string(),
});

export const publicAuthSchema = z.object({ authType: z.literal("public") });

export const userOrPublicOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicAuthSchema,
  apiAuthSchema,
]);

export type AuthContext = z.infer<typeof userOrPublicOrApiAuthSchema>;
