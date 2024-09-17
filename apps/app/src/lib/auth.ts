import NextAuth from "next-auth";
import { prisma } from "@mapform/db";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const BASE_PATH = "/api/auth";

const prismaAdapter = PrismaAdapter(prisma);
// Override createUser
// prismaAdapter.createUser;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: prismaAdapter,
  providers: [
    Resend({
      from: "auth@mapform.co",
    }),
  ],
});
