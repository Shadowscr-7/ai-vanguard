import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: fetch progress for a course
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const courseId = req.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId requerido." },
        { status: 400 }
      );
    }

    const progress = await prisma.courseProgress.findMany({
      where: { userId: session.user.id, courseId },
      select: { videoId: true, watchedAt: true },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { error: "Error al obtener progreso." },
      { status: 500 }
    );
  }
}

// POST: mark a video as watched
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { courseId, videoId } = await req.json();

    if (!courseId || !videoId) {
      return NextResponse.json(
        { error: "courseId y videoId requeridos." },
        { status: 400 }
      );
    }

    const entry = await prisma.courseProgress.upsert({
      where: {
        userId_courseId_videoId: {
          userId: session.user.id,
          courseId,
          videoId,
        },
      },
      update: { watchedAt: new Date() },
      create: {
        userId: session.user.id,
        courseId,
        videoId,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json(
      { error: "Error al guardar progreso." },
      { status: 500 }
    );
  }
}
