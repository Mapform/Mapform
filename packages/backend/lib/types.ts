/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareFn, SafeActionClient } from "next-safe-action";
import type {
  publicOrUserAuthSchema,
  publicSchema,
  userAuthSchema,
  userOrPublicOrApiAuthSchema,
} from "./schema";
import { z } from "zod";

export type AuthClient = SafeActionClient<
  string,
  any,
  any,
  any,
  AuthContext,
  any,
  any,
  any,
  any,
  any,
  any
>;

export type Middleware = MiddlewareFn<any, any, object, AuthContext>;

export type UnwrapReturn<T extends (...args: any) => any> = NonNullable<
  Awaited<NonNullable<ReturnType<NonNullable<Awaited<ReturnType<T>>>>>>
>;

export type UserAuthContext = z.infer<typeof userAuthSchema>;
export type PublicAuthContext = z.infer<typeof publicSchema>;
export type PublicOrUserAuthContext = z.infer<typeof publicOrUserAuthSchema>;
export type AuthContext = z.infer<typeof userOrPublicOrApiAuthSchema>;
