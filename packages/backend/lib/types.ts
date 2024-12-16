/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SafeActionClient } from "next-safe-action";
import type {
  publicOrUserAuthSchema,
  publicSchema,
  userAuthSchema,
  userOrPublicOrApiAuthSchema,
} from "./schema";
import { z } from "zod";

export type UnwrapReturn<T extends (...args: any) => any> = NonNullable<
  Awaited<NonNullable<ReturnType<NonNullable<Awaited<ReturnType<T>>>>>>
>;

export type UserAuthContext = z.infer<typeof userAuthSchema>;
export type PublicAuthContext = z.infer<typeof publicSchema>;
export type PublicOrUserAuthContext = z.infer<typeof publicOrUserAuthSchema>;
export type AuthContext = z.infer<typeof userOrPublicOrApiAuthSchema>;

export type Client<T extends object> = SafeActionClient<
  string,
  any,
  any,
  any,
  T,
  any,
  any,
  any,
  any,
  any,
  any
>;
export type PublicClient = Client<PublicAuthContext>;
export type UserAuthClient = Client<UserAuthContext>;
export type PublicOrUserAuthClient = Client<PublicOrUserAuthContext>;
export type AuthClient = Client<AuthContext>;
