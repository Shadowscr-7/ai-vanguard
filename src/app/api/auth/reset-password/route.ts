import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 reset attempts per IP per 15 minutes
    const rlKey = getRateLimitKey(req, "reset-password");
    const rl = rateLimit(rlKey, { limit: 5, windowMs: 15 * 60000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera unos minutos." },
        { status: 429 }
      );
    }

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y contraseña son requeridos." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "El enlace de recuperación no es válido." },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } });
      return NextResponse.json(
        { error: "El enlace de recuperación ha expirado." },
        { status: 400 }
      );
    }

    // Hash new password and update user
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash },
    });

    // Delete all tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });

    return NextResponse.json({
      message: "Contraseña actualizada exitosamente.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
