/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MiddlewareFn, SafeActionClient } from "next-safe-action";
import type { AuthContext } from "./schema";

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
