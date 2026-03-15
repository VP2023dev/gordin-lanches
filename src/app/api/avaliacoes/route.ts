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
    const nota = Math.min(5, Math.max(1, Number(body.nota) || 5));
    const comentario = typeof body.comentario === "string" ? body.comentario.trim().slice(0, 1000) : null;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from("avaliacoes").insert({
      nota,
      comentario: comentario || null,
    });
    if (error) {
      console.error("Erro ao salvar avaliação:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao enviar avaliação" }, { status: 500 });
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
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("avaliacoes")
      .select("id, created_at, nota, comentario")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const avaliacoes = (data || []).map((a) => ({
      id: a.id,
      createdAt: a.created_at,
      nota: a.nota,
      comentario: a.comentario,
    }));
    return NextResponse.json({ avaliacoes });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar avaliações" }, { status: 500 });
  }
}
