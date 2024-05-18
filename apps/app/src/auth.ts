import NextAuth from "next-auth";
import { prisma } from "@mapform/db";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

export type X = ReturnType<typeof NextAuth>;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Resend],
});
