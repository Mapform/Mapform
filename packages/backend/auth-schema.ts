import { z } from "zod";

export const userAuthSchema = z.object({
  authType: z.literal("user"),
  authUser: z.string(),
  authSession: z.string(),
});

export const apiAuthSchema = z.object({
  authType: z.literal("api"),
  authData: z.instanceof(Error),
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
