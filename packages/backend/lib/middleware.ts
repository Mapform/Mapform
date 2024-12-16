import { createMiddleware } from "next-safe-action";
import { publicSchema, userAuthSchema, publicOrUserAuthSchema } from "./schema";
import { UserAccess } from "./authorization";
import type { AuthContext, PublicAuthContext, UserAuthContext } from "./types";

export const userAuthMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = userAuthSchema.safeParse(ctx);

  if (result.error) {
    throw new Error("This function is only accessible using the user schema.");
  }

  const userAccess = new UserAccess(result.data?.user);

  return next({ ctx: { ...ctx, ...result.data, userAccess } });
});

export const publicMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = publicSchema.safeParse(ctx);

  if (result.error) {
    throw new Error(
      "This function is only accessible using the public schema.",
    );
  }

  return next({ ctx: { ...ctx, ...result.data } });
});

export const publicOrUserAuthMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = publicOrUserAuthSchema.safeParse(ctx);

  if (result.error) {
    throw new Error(
      "This function is only accessible when using userAuth or publicAuth schemas.",
    );
  }

  let modifiedContext:
    | PublicAuthContext
    | (UserAuthContext & { userAccess: UserAccess });

  if (result.data.authType === "public") {
    modifiedContext = result.data;
  } else {
    modifiedContext = {
      ...result.data,
      userAccess: new UserAccess(result.data.user),
    };
  }

  return next({
    ctx: {
      ...ctx,
      ...modifiedContext,
    },
  });
});
