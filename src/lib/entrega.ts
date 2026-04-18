/** Remove acentos e padroniza para comparar bairros */
export function normalizarBairro(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Linhas no formato: `Nome do bairro;5` ou `Nome;5,50` (vírgula decimal pt-BR)
 * Uma regra por linha. Linhas vazias ignoradas.
 */
export function parseTaxasBairroTexto(texto: string | undefined | null): { bairro: string; taxa: number }[] {
  if (!texto?.trim()) return [];
  const linhas = texto.split(/\r?\n/);
  const out: { bairro: string; taxa: number }[] = [];
  for (const linha of linhas) {
    const t = linha.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.lastIndexOf(";");
    if (idx <= 0) continue;
    const nome = t.slice(0, idx).trim();
    const numRaw = t.slice(idx + 1).trim().replace(",", ".");
    const taxa = Number.parseFloat(numRaw);
    if (!nome || !Number.isFinite(taxa) || taxa < 0) continue;
    out.push({ bairro: nome, taxa });
  }
  return out;
}

export function taxaEntregaParaBairro(
  bairroCliente: string,
  taxaPadrao: number,
  regras: { bairro: string; taxa: number }[]
): number {
  const alvo = normalizarBairro(bairroCliente);
  if (!alvo) return Math.max(0, taxaPadrao);
  for (const r of regras) {
    const n = normalizarBairro(r.bairro);
    if (!n) continue;
    if (alvo === n || alvo.includes(n) || n.includes(alvo)) {
      return Math.max(0, r.taxa);
    }
  }
  return Math.max(0, taxaPadrao);
}

export function valorDescontoCupom(subtotal: number, percent: number | undefined | null): number {
  const p = Number(percent);
  if (!Number.isFinite(p) || p <= 0 || p > 100) return 0;
  return Math.round(subtotal * (p / 100) * 100) / 100;
}
