import bcrypt from "bcrypt";
import prisma from "../app/utils/prisma";
import config from "../app/config";

async function main() {
  const email = config.super_admin_email;
  const password = config.super_admin_password;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Delete any existing legacy or current super admins to ensure a clean slate
  const deleteResult = await prisma.user.deleteMany({
    where: {
      OR: [
        { email: "tanvir1ahmed@example.com" },
        { email: email },
        { role: "SUPER_ADMIN" },
      ],
    },
  });

  if (deleteResult.count > 0) {
    console.log(`Deleted ${deleteResult.count} legacy SUPER_ADMIN(s) successfully.`);
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

  console.log("SUPER_ADMIN created successfully:", superAdmin);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
