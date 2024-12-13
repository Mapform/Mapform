import { createMiddleware } from "next-safe-action";
import { ServerError } from "./server-error";
import { AuthContext, userAuthSchema } from "./schema";
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

  return next({ ctx: { ...result.data, userAccess } });
});
