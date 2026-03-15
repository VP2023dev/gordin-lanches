/**
 * Verifica se o estabelecimento está aberto agora (horário de Brasília).
 * horaAbertura e horaFechamento no formato "HH:MM" (ex: "11:00", "23:00").
 * Se algum for null/undefined, considera aberto.
 */
export function isAberto(
  horaAbertura: string | null | undefined,
  horaFechamento: string | null | undefined
): boolean {
  if (!horaAbertura?.trim() || !horaFechamento?.trim()) return true;

  const parse = (h: string): number => {
    const [hh, mm] = h.trim().split(":").map(Number);
    return (hh ?? 0) * 60 + (mm ?? 0);
  };

  try {
    const abertura = parse(horaAbertura);
    const fechamento = parse(horaFechamento);
    const now = new Date();
    const brasilia = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
    const minutos = brasilia.getHours() * 60 + brasilia.getMinutes();

    if (abertura <= fechamento) {
      return minutos >= abertura && minutos < fechamento;
    }
    return minutos >= abertura || minutos < fechamento;
  } catch {
    return true;
  }
}
