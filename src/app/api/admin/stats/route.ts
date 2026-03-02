import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/stats - Dashboard statistics
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const [
    totalUsers,
    totalPurchases,
    totalRevenue,
    recentUsers,
    recentPurchases,
    purchasesByProduct,
    totalBanned,
    totalFreePass,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.purchase.count(),
    prisma.purchase.aggregate({ _sum: { amount: true } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, role: true, banned: true, freePass: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.purchase.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.purchase.groupBy({
      by: ["productId"],
      _count: true,
      _sum: { amount: true },
    }),
    prisma.user.count({ where: { banned: true } }),
    prisma.user.count({ where: { freePass: true } }),
  ]);

  return NextResponse.json({
    totalUsers,
    totalPurchases,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentUsers,
    recentPurchases,
    purchasesByProduct,
    totalAdmins: await prisma.user.count({ where: { role: "ADMIN" } }),
    totalBanned,
    totalFreePass,
  });
}
