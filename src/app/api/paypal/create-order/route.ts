import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPayPalOrder } from "@/lib/paypal";
import { getProductPrice, getProductName } from "@/data/content";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { productId, productType } = await req.json();

    if (!productId || !productType) {
      return NextResponse.json(
        { error: "Faltan datos del producto." },
        { status: 400 }
      );
    }

    const price = getProductPrice(productId);
    if (price <= 0) {
      return NextResponse.json(
        { error: "Producto no encontrado." },
        { status: 404 }
      );
    }

    const description = getProductName(productId);
    const order = await createPayPalOrder(price.toFixed(2), description);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Create PayPal order error:", error);
    return NextResponse.json(
      { error: "Error al crear la orden de PayPal." },
      { status: 500 }
    );
  }
}
