import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/reviews - List all reviews with user info
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { text: { contains: search, mode: "insensitive" as const } },
      { user: { name: { contains: search, mode: "insensitive" as const } } },
      { user: { email: { contains: search, mode: "insensitive" as const } } },
      { videoId: { contains: search, mode: "insensitive" as const } },
    ];
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true, banned: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return NextResponse.json({
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// DELETE /api/admin/reviews - Delete a review
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { reviewId } = await req.json();

  if (!reviewId) {
    return NextResponse.json({ error: "reviewId requerido" }, { status: 400 });
  }

  await prisma.review.delete({ where: { id: reviewId } });

  return NextResponse.json({ message: "Review eliminada" });
}
