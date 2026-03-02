import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, passwordHash: true },
  });

  for (const u of users) {
    const hasHash = !!u.passwordHash;
    let testResult = "no hash";
    if (u.passwordHash) {
      testResult = (await bcrypt.compare("admin123456", u.passwordHash))
        ? "MATCH admin123456"
        : "NO MATCH admin123456";
    }
    console.log(`${u.email} | role: ${u.role} | hasHash: ${hasHash} | ${testResult}`);
  }

  await prisma.$disconnect();
}

main();
