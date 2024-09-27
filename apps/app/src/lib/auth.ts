import NextAuth from "next-auth";
import { db } from "@mapform/db";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "@mapform/db/schema";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const BASE_PATH = "/api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // @ts-ignore -- This is fine
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Resend({
      from: "auth@mapform.co",
    }),
  ],
});
