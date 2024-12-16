import { createMiddleware } from "next-safe-action";
import { publicSchema, userAuthSchema } from "./schema";
import type { PublicAuthContext, UserAuthContext } from "./types";

export const userAuthMiddleware = createMiddleware<{
  ctx: UserAuthContext;
}>().define(async ({ next, ctx }) => {
  const result = userAuthSchema.safeParse(ctx);

  if (result.error) {
    throw new Error("This function is only accessible using the user schema.");
  }

  return next({ ctx: { ...ctx, ...result.data } });
});

export const publicMiddleware = createMiddleware<{
  ctx: PublicAuthContext;
}>().define(async ({ next, ctx }) => {
  const result = publicSchema.safeParse(ctx);

  if (result.error) {
    throw new Error(
      "This function is only accessible using the public schema.",
    );
  }

  return next({ ctx: { ...ctx, ...result.data } });
});
