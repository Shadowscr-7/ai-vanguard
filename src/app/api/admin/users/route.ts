import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

// GET /api/admin/users - List all users
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || ""; // "banned" | "freepass" | ""

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
    ];
  }

  if (filter === "banned") where.banned = true;
  if (filter === "freepass") where.freePass = true;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        bannedAt: true,
        bannedReason: true,
        freePass: true,
        createdAt: true,
        image: true,
        _count: { select: { purchases: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / limit) });
}

// PATCH /api/admin/users - Update user (role, ban, freePass)
export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "userId y action requeridos" }, { status: 400 });
  }

  // Don't allow self-modification for dangerous actions
  if (userId === session.user.id && ["ban", "remove-admin"].includes(action)) {
    return NextResponse.json({ error: "No puedes realizar esta acción en tu propia cuenta" }, { status: 400 });
  }

  let data: Record<string, unknown> = {};

  switch (action) {
    case "toggle-role": {
      const { role } = body;
      if (!["USER", "ADMIN"].includes(role)) {
        return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
      }
      data = { role };
      break;
    }
    case "ban": {
      const { reason } = body;
      data = { banned: true, bannedAt: new Date(), bannedReason: reason || "Baneado por administrador" };
      break;
    }
    case "unban": {
      data = { banned: false, bannedAt: null, bannedReason: null };
      break;
    }
    case "grant-freepass": {
      data = { freePass: true };
      break;
    }
    case "revoke-freepass": {
      data = { freePass: false };
      break;
    }
    default:
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, banned: true, freePass: true },
  });

  return NextResponse.json({ user });
}

// DELETE /api/admin/users - Delete a user
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "userId requerido" }, { status: 400 });
  }

  // Don't allow self-deletion
  if (userId === session.user.id) {
    return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ message: "Usuario eliminado" });
}
