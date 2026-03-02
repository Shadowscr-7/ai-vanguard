import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: session.user.id, status: "completed" },
      orderBy: { createdAt: "desc" },
    });

    // Get progress for all courses
    const progress = await prisma.courseProgress.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ purchases, progress });
  } catch (error) {
    console.error("Get purchases error:", error);
    return NextResponse.json(
      { error: "Error al obtener compras." },
      { status: 500 }
    );
  }
}
