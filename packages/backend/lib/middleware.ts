import { createMiddleware } from "next-safe-action";
import { ServerError } from "./server-error";
import {
  AuthContext,
  publicOrUserAuthSchema,
  publicSchema,
  userAuthSchema,
} from "./schema";
import { UserAccess } from "./authorization";

export const userAuthMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = userAuthSchema.safeParse(ctx);

  if (result.error) {
    throw new ServerError(
      "This function is only accessible to authenticated users.",
    );
  }

  const userAccess = new UserAccess(result.data?.user);

  return next({ ctx: { ...ctx, ...result.data, userAccess } });
});

export const publicMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = publicSchema.safeParse(ctx);

  if (result.error) {
    throw new ServerError(
      "This function is only accessible using the public sche,a.",
    );
  }

  return next({ ctx: { ...ctx, ...result.data } });
});

export const publicOrUserAuthMiddleware = createMiddleware<{
  ctx: AuthContext; // [1]
}>().define(async ({ next, ctx }) => {
  const result = publicOrUserAuthSchema.safeParse(ctx);

  if (result.error) {
    throw new ServerError(
      "This function is only accessible when using userAuth or publicAuth schemas.",
    );
  }

  return next({
    ctx: {
      ...ctx,
      ...result.data,
      ...(result.data.authType === "user"
        ? { userAccess: new UserAccess(result.data.user) }
        : {}),
    },
  });
});
