/**
 * Email utility using Resend API.
 * Falls back to console logging if RESEND_API_KEY is not set.
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "noreply@example.com";

  if (!apiKey) {
    console.log("=== EMAIL (no RESEND_API_KEY set) ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html}`);
    console.log("=====================================");
    return { success: true, mock: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }

  return { success: true, mock: false };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Recupera tu contraseña — IA Vanguard",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
        <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 16px;">
          Recupera tu contraseña
        </h1>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en 
          <strong>IA Vanguard</strong>.
        </p>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 24px 0;">
          Restablecer Contraseña
        </a>
        <p style="color: #888; font-size: 13px; line-height: 1.6;">
          Este enlace expira en <strong>1 hora</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
        <p style="color: #aaa; font-size: 12px;">
          © ${new Date().getFullYear()} IA Vanguard
        </p>
      </div>
    `,
  };
}
