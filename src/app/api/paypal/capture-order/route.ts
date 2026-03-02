import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { capturePayPalOrder } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { getProductPrice } from "@/data/content";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { orderId, productId, productType } = await req.json();

    if (!orderId || !productId || !productType) {
      return NextResponse.json(
        { error: "Datos incompletos." },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const captureData = await capturePayPalOrder(orderId);

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "El pago no fue completado." },
        { status: 400 }
      );
    }

    const amount = getProductPrice(productId);

    // Save the purchase
    const purchase = await prisma.purchase.create({
      data: {
        userId: session.user.id,
        productId,
        productType,
        amount,
        currency: "USD",
        paypalOrderId: orderId,
        status: "completed",
      },
    });

    return NextResponse.json({
      message: "¡Compra realizada exitosamente!",
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error("Capture PayPal order error:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago." },
      { status: 500 }
    );
  }
}
