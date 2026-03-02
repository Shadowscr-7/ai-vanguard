import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per minute
    const rlKey = getRateLimitKey(req, "register");
    const rl = rateLimit(rlKey, { limit: 5, windowMs: 60000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento." },
        { status: 429 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con este email." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    return NextResponse.json(
      { message: "Cuenta creada exitosamente.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
