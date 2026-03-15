import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase não configurado. Configure as variáveis de ambiente." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const full = searchParams.get("full") === "1";

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [configRes, categoriasRes, produtosRes, promocoesRes, acrescimosRes] = await Promise.all([
      supabase.from("config_loja").select("*").single(),
      supabase.from("categorias").select("*").order("ordem"),
      full
        ? supabase.from("produtos").select("*").order("ordem")
        : supabase.from("produtos").select("*").eq("disponivel", true).order("ordem"),
      full
        ? supabase.from("promocoes").select("*").order("ordem")
        : supabase.from("promocoes").select("*").eq("ativa", true).order("ordem"),
      full
        ? supabase.from("acrescimos").select("*").order("ordem")
        : supabase.from("acrescimos").select("*").eq("ativo", true).order("ordem"),
    ]);

    const config = configRes.data || {
      nome: "Gordinho Lanches",
      whatsapp: "5517991449785",
      endereco: "",
      horario: "",
    };

    const categoriasData = categoriasRes.data || [];
    const categoriasFiltered = full ? categoriasData : categoriasData.filter((c: { ativa?: boolean }) => c.ativa !== false);
    const categorias = categoriasFiltered.map((c: { id: string; nome: string; ordem: number; secao?: string }) => ({
      id: c.id,
      nome: c.nome,
      ordem: c.ordem,
      secao: c.secao || "lanches",
    }));

    const produtos = (produtosRes.data || []).map((p) => ({
      id: p.id,
      nome: p.nome,
      descricao: p.descricao || "",
      ingredientes: p.ingredientes || "",
      preco: parseFloat(p.preco),
      imagem: p.imagem_url,
      categoriaId: p.categoria_id,
      disponivel: p.disponivel,
      ordem: p.ordem,
      destaque: p.destaque,
    }));

    const promocoes = (promocoesRes.data || []).map((p) => ({
      id: p.id,
      titulo: p.titulo,
      descricao: p.descricao || "",
      precoPromocional: p.preco_promocional ? parseFloat(p.preco_promocional) : undefined,
      imagem: p.imagem_url,
      ativa: p.ativa,
      ordem: p.ordem,
      createdAt: p.created_at,
    }));

    const acrescimosData = acrescimosRes.data || [];
    const acrescimos = acrescimosData.map((a: { id: string; nome: string; preco: string; ativo?: boolean; ordem: number }) => ({
      id: a.id,
      nome: a.nome,
      preco: parseFloat(a.preco),
      ativo: a.ativo !== false,
      ordem: a.ordem,
    }));

    return NextResponse.json({
      config: {
        nome: config.nome,
        whatsapp: config.whatsapp,
        endereco: config.endereco,
        horario: config.horario,
        logoUrl: config.logo_url || null,
      },
      categorias,
      produtos,
      promocoes,
      acrescimos,
    });
  } catch (error) {
    console.error("Erro ao carregar cardápio:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cardápio" },
      { status: 500 }
    );
  }
}
