import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function resolveBaseUrl(request: NextRequest): string | null {
  const env = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const u = new URL(referer);
      return `${u.protocol}//${u.host}`;
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Stripe não configurado (STRIPE_SECRET_KEY)" }, { status: 503 });
  }

  const base = resolveBaseUrl(request);
  if (!base) {
    return NextResponse.json(
      { error: "Defina NEXT_PUBLIC_BASE_URL (produção) ou acesse pelo mesmo domínio da loja." },
      { status: 400 }
    );
  }

  let body: {
    amountReais?: number;
    pedidoNumero?: number | null;
    nomeLoja?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const amountReais = Number(body.amountReais);
  if (!Number.isFinite(amountReais) || amountReais < 0.5) {
    return NextResponse.json(
      { error: "Valor inválido. O PIX via Stripe exige no mínimo R$ 0,50." },
      { status: 400 }
    );
  }
  if (amountReais > 50_000) {
    return NextResponse.json({ error: "Valor acima do limite permitido." }, { status: 400 });
  }

  const unitAmount = Math.round(amountReais * 100);
  if (unitAmount < 50) {
    return NextResponse.json({ error: "Valor muito baixo." }, { status: 400 });
  }

  const pedidoNumero =
    body.pedidoNumero != null && Number.isFinite(Number(body.pedidoNumero))
      ? Number(body.pedidoNumero)
      : null;
  const nomeLoja = typeof body.nomeLoja === "string" ? body.nomeLoja.trim().slice(0, 120) : "";

  const stripe = new Stripe(secret);

  try {
    const nomeItem =
      pedidoNumero != null
        ? `Pedido #${String(pedidoNumero).padStart(3, "0")}`
        : "Pedido — cardápio online";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["pix"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: unitAmount,
            product_data: {
              name: nomeItem,
              ...(nomeLoja ? { description: nomeLoja } : {}),
            },
          },
        },
      ],
      success_url: `${base}/finalizar-pedido/pix-obrigado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/finalizar-pedido?cancelado=pix`,
      metadata: {
        pedido_numero: pedidoNumero != null ? String(pedidoNumero) : "",
      },
      ...(pedidoNumero != null ? { client_reference_id: `pedido-${pedidoNumero}` } : {}),
      payment_method_options: {
        pix: {
          expires_after_seconds: 3600,
        },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Sessão Stripe sem URL de checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro Stripe";
    console.error("Stripe checkout-session:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
