import { prisma } from "./index.js";

// const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: "123",
      email: "test@gamilc.om",
      firstName: "Test",
      lastName: "User",
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
