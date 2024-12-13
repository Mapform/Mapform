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

export const publicSchema = z.object({ authType: z.literal("public") });

export const publicOrUserAuthSchema = z.union([publicSchema, userAuthSchema]);

export const userOrPublicOrApiAuthSchema = z.discriminatedUnion("authType", [
  userAuthSchema,
  publicSchema,
  apiAuthSchema,
]);

export type AuthContext = z.infer<typeof userOrPublicOrApiAuthSchema>;

export type UserAuthContext = z.infer<typeof userAuthSchema>;
export type PublicAuthContext = z.infer<typeof publicSchema>;

export type PublicOrUserAuthContext = z.infer<typeof publicOrUserAuthSchema>;
