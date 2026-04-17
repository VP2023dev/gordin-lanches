import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Stripe não configurado" }, { status: 503 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id")?.trim();
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "session_id inválido" }, { status: 400 });
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      payment_status: session.payment_status,
      pedido_numero: session.metadata?.pedido_numero || null,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao consultar sessão";
    console.error("Stripe session-status:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
