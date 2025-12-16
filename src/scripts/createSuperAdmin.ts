
// scripts/createSuperAdmin.ts

// npx ts-node src/scripts/createSuperAdmin.ts
// create a admin

import bcrypt from "bcrypt";
import prisma from "../app/utils/prisma";

async function main() {
  const email = "tanvir1ahmed@example.com";
  const password = "Admin@123"; // strong password
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("SUPER_ADMIN already exists");
    return;
  }

const superAdmin = await prisma.user.create({
  data: {
    name: "Tanvir Ahmed",
    email,
    password: hashedPassword,
    role: "SUPER_ADMIN",
    address: "Head Office of Tanvir IT",        
    gender: "MALE",                
  },
});


  console.log("SUPER_ADMIN created:", superAdmin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
