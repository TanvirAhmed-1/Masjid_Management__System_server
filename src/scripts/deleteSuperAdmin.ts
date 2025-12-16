// scripts/deleteSuperAdmin.ts

import prisma from "../app/utils/prisma";

async function main() {
  const email = "tanvir1ahmed@example.com"; // আগের SUPER_ADMIN এর email

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    console.log("SUPER_ADMIN not found");
    return;
  }

  await prisma.user.delete({ where: { email } });

  console.log("SUPER_ADMIN deleted successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
