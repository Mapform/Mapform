import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.create({
    data: {
      // Hard coding from Clerk (for now)
      id: "org_2donNxW45zFE3Ys6qQonHFj0qUc",
      name: "Mapform",
      slug: "mapform",
    },
  });

  const user = await prisma.user.create({
    data: {
      // Hard coding from Clerk (for now)
      id: "user_2domNcdN4yYTRGtuSudlI1I5U45",
      firstName: "Nic",
      lastName: "Haley",
      email: "nicholaswilliamhaley@gmail.com",
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yZEg5dmg2Mlp4RDhISU5ZZTVWeUhidzcxcFEiLCJyaWQiOiJ1c2VyXzJkb21OY2RONHlZVFJHdHVTdWRsSTFJNVU0NSIsImluaXRpYWxzIjoiTkgifQ",
    },
  });

  const organizationMembership = await prisma.organizationMembership.create({
    data: {
      // Hard coding from Clerk (for now)
      id: "orgmem_2dop73NRK5Z6faWgRiEk0IkUFQb",
      role: "org:admin",
      user: {
        connect: {
          id: user.id,
        },
      },
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
