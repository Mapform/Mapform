// import type { z } from "zod";
// import { PrismaClient } from "@prisma/client";
// import { UserCreateInputSchema } from "./zod";
// import { OrganizationCreateInputSchema } from "./zod";
// import { OrganizationMembershipCreateInputSchema } from "./zod";

// const prisma = new PrismaClient();

// async function createUsersFromClerk() {

//   await prisma.$transaction([
//     ...users.data.map((user) => {
//       const input: Partial<z.infer<typeof UserCreateInputSchema>> = {
//         id: user.id,
//         email: user.emailAddresses.find(
//           (email) => email.id === user.primaryEmailAddressId
//         )?.emailAddress,
//         firstName: user.firstName || undefined,
//         lastName: user.lastName || undefined,
//       };

//       const validatedUser = UserCreateInputSchema.safeParse(input);

//       if (!validatedUser.success) {
//         console.error(validatedUser.error.errors);
//         process.exit(1);
//       }

//       return prisma.user.upsert({
//         where: {
//           id: user.id,
//         },
//         update: {
//           ...validatedUser.data,
//         },
//         create: {
//           ...validatedUser.data,
//         },
//       });
//     }),
//   ]);
// }

// async function createOrganizationsFromClerk() {
//   const organizations = await clerkClient.organizations.getOrganizationList();

//   return prisma.$transaction([
//     ...organizations.data.map((organization) => {
//       const validatedBrokerage = OrganizationCreateInputSchema.safeParse({
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//         imageUrl: organization.imageUrl,
//       });

//       if (!validatedBrokerage.success) {
//         console.error(validatedBrokerage.error.errors);
//         process.exit(1);
//       }

//       return prisma.organization.upsert({
//         where: {
//           id: organization.id,
//         },
//         update: {
//           ...validatedBrokerage.data,
//         },
//         create: {
//           ...validatedBrokerage.data,
//         },
//       });
//     }),
//   ]);
// }

// async function createOrganizationMembershipsFromClerk(
//   clerkOrganizationId: string
// ) {
//   const memberships =
//     await clerkClient.organizations.getOrganizationMembershipList({
//       organizationId: clerkOrganizationId,
//     });

//   return prisma.$transaction([
//     ...memberships.data.map((membership) => {
//       if (!membership.publicUserData) {
//         console.error(
//           `Organization membership ${membership.id} does not have public user data`
//         );
//         process.exit(1);
//       }

//       const input: z.infer<typeof OrganizationMembershipCreateInputSchema> = {
//         id: membership.id,
//         role: membership.role,
//         user: {
//           connect: {
//             id: membership.publicUserData.userId,
//           },
//         },
//         organization: {
//           connect: {
//             id: membership.organization.id,
//           },
//         },
//       };

//       const validatedMembership =
//         OrganizationMembershipCreateInputSchema.safeParse(input);

//       if (!validatedMembership.success) {
//         console.error(validatedMembership.error.errors);
//         process.exit(1);
//       }

//       return prisma.organizationMembership.upsert({
//         where: {
//           id: membership.id,
//         },
//         update: {
//           ...validatedMembership.data,
//         },
//         create: {
//           ...validatedMembership.data,
//         },
//       });
//     }),
//   ]);
// }

// async function main() {
//   /**
//    * Create users
//    */
//   await createUsersFromClerk();

//   /**
//    * Create organizations
//    */
//   const organizations = await createOrganizationsFromClerk();

//   /**
//    * Create memberships
//    */
//   await Promise.all(
//     organizations.map((org) => createOrganizationMembershipsFromClerk(org.id))
//   );
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
