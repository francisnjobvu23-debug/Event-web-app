import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("✅ Connected successfully. Found users:", users);
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Prisma error:", err);
    return prisma.$disconnect();
  });
