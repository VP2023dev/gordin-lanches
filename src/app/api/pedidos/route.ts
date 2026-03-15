import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gordin123";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { nomeCliente, itens, total, tipoEntrega, formaPagamento, endereco } = body;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = {
      nome_cliente: nomeCliente?.trim() || null,
      itens_json: JSON.stringify(itens ?? []),
      total: Number(total) || 0,
      tipo_entrega: tipoEntrega === "entrega" ? "entrega" : "retirada",
      forma_pagamento: formaPagamento || null,
      endereco_json: endereco ? JSON.stringify(endereco) : null,
    };

    let numero: number | null = null;
    const { data: maxRow } = await supabase.from("pedidos").select("numero").order("numero", { ascending: false }).limit(1).maybeSingle();
    const proximoNumero = (Number((maxRow as { numero?: number } | null)?.numero) || 0) + 1;

    const { data: inserted, error } = await supabase
      .from("pedidos")
      .insert({ ...payload, numero: proximoNumero })
      .select("numero")
      .single();

    if (error) {
      const colunaNumeroInexistente = /numero|column/i.test(error.message);
      if (colunaNumeroInexistente) {
        const { error: err2 } = await supabase.from("pedidos").insert(payload);
        if (err2) {
          console.error("Erro ao salvar pedido:", err2);
          return NextResponse.json({ error: err2.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
      }
      console.error("Erro ao salvar pedido:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    numero = (inserted as { numero: number } | null)?.numero ?? proximoNumero;
    return NextResponse.json({ ok: true, numero });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao registrar pedido" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 503 });
  }
  const { searchParams } = new URL(request.url);
  const hoje = searchParams.get("hoje") === "1";
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let query = supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    if (hoje) {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
      query = query.gte("created_at", start).lt("created_at", end);
    }
    const { data, error } = await query.limit(200);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const pedidos = (data || []).map((p: Record<string, unknown>) => ({
      id: p.id,
      numero: p.numero,
      createdAt: p.created_at,
      nomeCliente: p.nome_cliente,
      itens: p.itens_json,
      total: p.total,
      tipoEntrega: p.tipo_entrega,
      formaPagamento: p.forma_pagamento,
      endereco: p.endereco_json,
    }));
    return NextResponse.json({ pedidos });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar pedidos" }, { status: 500 });
  }
}
