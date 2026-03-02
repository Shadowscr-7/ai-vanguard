import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, passwordResetEmail } from "@/lib/email";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import crypto from "crypto";

// POST /api/auth/forgot-password
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 3 password reset requests per IP per 5 minutes
    const rlKey = getRateLimitKey(req, "forgot-password");
    const rl = rateLimit(rlKey, { limit: 3, windowMs: 5 * 60000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera unos minutos." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "El email es requerido." },
        { status: 400 }
      );
    }

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({ where: { email } });

      // Generate token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000); // 1 hour

      await prisma.passwordResetToken.create({
        data: { email, token, expires },
      });

      // Build reset URL
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

      // Send email
      const emailContent = passwordResetEmail(resetUrl);
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json({
      message: "Si el email existe, recibirás un enlace de recuperación.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
