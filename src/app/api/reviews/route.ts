import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: fetch reviews for a video
export async function GET(req: NextRequest) {
  try {
    const videoId = req.nextUrl.searchParams.get("videoId");
    if (!videoId) {
      return NextResponse.json(
        { error: "videoId requerido." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { videoId },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Error al obtener reviews." },
      { status: 500 }
    );
  }
}

// POST: create/update a review
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { videoId, rating, text } = await req.json();

    if (!videoId || !rating) {
      return NextResponse.json(
        { error: "videoId y rating requeridos." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating debe ser entre 1 y 5." },
        { status: 400 }
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_videoId: {
          userId: session.user.id,
          videoId,
        },
      },
      update: { rating, text: text || "" },
      create: {
        userId: session.user.id,
        videoId,
        rating,
        text: text || "",
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Save review error:", error);
    return NextResponse.json(
      { error: "Error al guardar review." },
      { status: 500 }
    );
  }
}
