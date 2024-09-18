import NextAuth from "next-auth";
import { db, users, accounts, sessions, verificationTokens } from "@mapform/db";
import Resend from "next-auth/providers/resend";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const BASE_PATH = "/api/auth";

// Override createUser
// prismaAdapter.createUser;

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
