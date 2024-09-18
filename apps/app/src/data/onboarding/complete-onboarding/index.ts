"use server";

import slugify from "slugify";
import { db, eq, users } from "@mapform/db";
import { redirect } from "next/navigation";
import { authAction } from "~/lib/safe-action";
import { completeOnboardingSchema } from "./schema";

export const completeOnboarding = authAction
  .schema(completeOnboardingSchema)
  .action(async ({ parsedInput: { userName }, ctx: { userId } }) => {
    const randomChars = Math.random().toString(36).substring(7);

    const orgName = `${userName}'s Mapform`;
    const orgSlug = `${slugify(orgName, {
      lower: true,
      strict: true,
    })}-${randomChars}`;

    const workspaceName = "Personal";
    const workspaceSlug = "personal";

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (user?.hasOnboarded) {
      throw new Error("User has already onboarded");
    }

    await db
      .update(users)
      .set({
        hasOnboarded: true,
      })
      .where(eq(users.id, userId));

    // await db.update(users).set({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     hasOnboarded: true,
    //     organizationMemberships: {
    //       create: {
    //         role: "OWNER",
    //         organization: {
    //           create: {
    //             slug: orgSlug,
    //             name: orgName,
    //             workspaces: {
    //               create: {
    //                 slug: workspaceSlug,
    //                 name: workspaceName,
    //                 members: {
    //                   create: {
    //                     role: "OWNER",
    //                     user: {
    //                       connect: {
    //                         id: userId,
    //                       },
    //                     },
    //                   },
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    redirect("/");
  });
