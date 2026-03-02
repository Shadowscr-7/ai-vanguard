import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@iavanguard.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@iavanguard.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email} (role: ${admin.role})`);

  // Create test user
  const userPassword = await bcrypt.hash("user123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "usuario@example.com" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "usuario@example.com",
      passwordHash: userPassword,
      role: "USER",
    },
  });
  console.log(`✅ Test user: ${user.email} (role: ${user.role})`);

  // Create sample purchase for test user
  const existingPurchase = await prisma.purchase.findUnique({
    where: { userId_productId: { userId: user.id, productId: "curso-basico" } },
  });

  if (!existingPurchase) {
    await prisma.purchase.create({
      data: {
        userId: user.id,
        productId: "curso-basico",
        productType: "course",
        amount: 199,
        currency: "USD",
        status: "completed",
      },
    });
    console.log(`✅ Sample purchase: curso-basico for ${user.email}`);
  }

  // Create sample bundle purchase
  const existingBundle = await prisma.purchase.findUnique({
    where: { userId_productId: { userId: user.id, productId: "nivel-1" } },
  });

  if (!existingBundle) {
    await prisma.purchase.create({
      data: {
        userId: user.id,
        productId: "nivel-1",
        productType: "bundle",
        amount: 49.99,
        currency: "USD",
        status: "completed",
      },
    });
    console.log(`✅ Sample purchase: nivel-1 bundle for ${user.email}`);
  }

  // Create sample progress
  const existingProgress = await prisma.courseProgress.findUnique({
    where: {
      userId_courseId_videoId: {
        userId: user.id,
        courseId: "curso-basico",
        videoId: "v1",
      },
    },
  });

  if (!existingProgress) {
    await prisma.courseProgress.createMany({
      data: [
        { userId: user.id, courseId: "curso-basico", videoId: "v1" },
        { userId: user.id, courseId: "curso-basico", videoId: "v2" },
        { userId: user.id, courseId: "curso-basico", videoId: "v3" },
      ],
      skipDuplicates: true,
    });
    console.log(`✅ Sample progress: 3 videos watched for ${user.email}`);
  }

  // Create sample review
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId: "v1",
      },
    },
  });

  if (!existingReview) {
    await prisma.review.create({
      data: {
        userId: user.id,
        videoId: "v1",
        rating: 5,
        text: "Excelente introducción, muy clara y bien estructurada.",
      },
    });
    console.log(`✅ Sample review created for video v1`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📋 Test credentials:");
  console.log("   Admin: admin@iavanguard.com / admin123456");
  console.log("   User:  usuario@example.com / user123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
