import type { ConfigLoja } from "@/types";

export function mapConfigFromSupabaseRow(c: Record<string, unknown> | null | undefined): ConfigLoja {
  const d = c || {};
  const num = (v: unknown, def: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
  };
  const int = (v: unknown) => {
    const n = Number.parseInt(String(v), 10);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  return {
    nome: String(d.nome ?? "Gordinho Lanches"),
    whatsapp: String(d.whatsapp ?? "5517991449785"),
    endereco: d.endereco != null ? String(d.endereco) : undefined,
    horario: d.horario != null ? String(d.horario) : undefined,
    logoUrl: (d.logo_url as string | null | undefined) ?? null,
    horaAbertura: (d.hora_abertura as string | null | undefined) ?? null,
    horaFechamento: (d.hora_fechamento as string | null | undefined) ?? null,
    tempoEstimadoTexto: (d.tempo_estimado_texto as string | undefined) ?? undefined,
    taxaEntregaPadrao: num(d.taxa_entrega_padrao, 5),
    taxasBairroText: (d.taxas_bairro_text as string | undefined) ?? undefined,
    cupomCodigo: (d.cupom_codigo as string | undefined) ?? undefined,
    cupomDescontoPercent: int(d.cupom_desconto_percent),
    cnpj: (d.cnpj as string | undefined) ?? undefined,
    mapsEmbedUrl: (d.maps_embed_url as string | undefined) ?? undefined,
  };
}
