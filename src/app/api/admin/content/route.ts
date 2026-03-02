import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { books, bundles, courses } from "@/data/content";

const STATIC_DEFAULTS: Record<string, unknown[]> = { books, bundles, courses };

async function getOrInit(key: string) {
  let row = await prisma.siteContent.findUnique({ where: { key } });
  if (!row) {
    row = await prisma.siteContent.create({
      data: { key, data: (STATIC_DEFAULTS[key] ?? []) as never },
    });
  }
  return row;
}

// GET /api/admin/content?key=books|bundles|courses  (omit key → all)
export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const key = req.nextUrl.searchParams.get("key");

  if (key) {
    const row = await getOrInit(key);
    return NextResponse.json({ key, data: row.data, updatedAt: row.updatedAt });
  }

  // Return all content
  const [b, bu, c] = await Promise.all([
    getOrInit("books"),
    getOrInit("bundles"),
    getOrInit("courses"),
  ]);

  return NextResponse.json({
    books: b.data,
    bundles: bu.data,
    courses: c.data,
    updatedAt: { books: b.updatedAt, bundles: bu.updatedAt, courses: c.updatedAt },
  });
}

// PUT /api/admin/content — { key: "books", data: [...] }
export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { key, data } = await req.json();

  if (!key || !["books", "bundles", "courses"].includes(key)) {
    return NextResponse.json({ error: "Key inválido" }, { status: 400 });
  }

  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "data debe ser un array" }, { status: 400 });
  }

  const row = await prisma.siteContent.upsert({
    where: { key },
    update: { data: data as never },
    create: { key, data: data as never },
  });

  return NextResponse.json({ key, data: row.data, updatedAt: row.updatedAt });
}
