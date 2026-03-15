import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "gordin123";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase não configurado. Use SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    const { tipo, dados } = body;

    if (tipo === "config") {
      const { data: existing } = await supabase.from("config_loja").select("id").single();
      const row = {
        nome: dados.nome,
        whatsapp: dados.whatsapp,
        endereco: dados.endereco || null,
        horario: dados.horario || null,
        logo_url: dados.logoUrl ?? null,
        updated_at: new Date().toISOString(),
      };
      if (existing) {
        await supabase.from("config_loja").update(row).eq("id", existing.id);
      } else {
        await supabase.from("config_loja").insert(row);
      }
    } else if (tipo === "categorias") {
      const ids = dados.map((c: { id: string }) => c.id).filter(Boolean);
      const { data: existing } = await supabase.from("categorias").select("id");
      const toDelete = (existing || []).filter((e) => !ids.includes(e.id)).map((e) => e.id);
      for (const id of toDelete) {
        await supabase.from("categorias").delete().eq("id", id);
      }
      for (const c of dados) {
        const row = { nome: c.nome, ordem: c.ordem, ativa: true, secao: c.secao || "lanches" };
        if (c.id) {
          await supabase.from("categorias").upsert({ ...row, id: c.id }, { onConflict: "id" });
        } else {
          await supabase.from("categorias").insert(row);
        }
      }
    } else if (tipo === "produtos") {
      const ids = dados.map((p: { id: string }) => p.id).filter(Boolean);
      const { data: existing } = await supabase.from("produtos").select("id");
      const toDelete = (existing || []).filter((e) => !ids.includes(e.id)).map((e) => e.id);
      for (const id of toDelete) {
        await supabase.from("produtos").delete().eq("id", id);
      }
      for (const p of dados) {
        const row = {
          categoria_id: p.categoriaId,
          nome: p.nome,
          descricao: p.descricao || null,
          ingredientes: p.ingredientes ?? null,
          preco: p.preco,
          imagem_url: p.imagem || null,
          disponivel: p.disponivel ?? true,
          ordem: p.ordem,
          destaque: p.destaque ?? false,
        };
        if (p.id) {
          await supabase.from("produtos").upsert({ ...row, id: p.id }, { onConflict: "id" });
        } else {
          await supabase.from("produtos").insert(row);
        }
      }
    } else if (tipo === "acrescimos") {
      const ids = dados.map((a: { id: string }) => a.id).filter(Boolean);
      const { data: existing } = await supabase.from("acrescimos").select("id");
      const toDelete = (existing || []).filter((e) => !ids.includes(e.id)).map((e) => e.id);
      for (const id of toDelete) {
        await supabase.from("acrescimos").delete().eq("id", id);
      }
      for (const a of dados) {
        const row = {
          nome: a.nome,
          preco: a.preco,
          ativo: a.ativo ?? true,
          ordem: a.ordem,
        };
        if (a.id) {
          await supabase.from("acrescimos").upsert({ ...row, id: a.id }, { onConflict: "id" });
        } else {
          await supabase.from("acrescimos").insert(row);
        }
      }
    } else if (tipo === "promocoes") {
      const ids = dados.map((p: { id: string }) => p.id).filter(Boolean);
      const { data: existing } = await supabase.from("promocoes").select("id");
      const toDelete = (existing || []).filter((e) => !ids.includes(e.id)).map((e) => e.id);
      for (const id of toDelete) {
        await supabase.from("promocoes").delete().eq("id", id);
      }
      for (const p of dados) {
        const row = {
          titulo: p.titulo,
          descricao: p.descricao || null,
          preco_promocional: p.precoPromocional ?? null,
          imagem_url: p.imagem || null,
          ativa: p.ativa ?? true,
          ordem: p.ordem,
        };
        if (p.id) {
          await supabase.from("promocoes").upsert({ ...row, id: p.id }, { onConflict: "id" });
        } else {
          await supabase.from("promocoes").insert(row);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar:", error);
    return NextResponse.json({ error: "Erro ao salvar" }, { status: 500 });
  }
}
