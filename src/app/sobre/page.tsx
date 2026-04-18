import Link from "next/link";
import { getCardapio } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const { config } = await getCardapio();
  const waDigits = config.whatsapp.replace(/\D/g, "");
  const waUrl = `https://wa.me/${waDigits}`;
  const mapSrc = config.mapsEmbedUrl?.trim();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 pb-16">
      <Link
        href="/"
        className="mb-6 inline-block text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline"
      >
        ← Voltar ao cardápio
      </Link>

      <h1 className="text-2xl font-extrabold text-[var(--foreground)]">Sobre / Contato</h1>
      <p className="mt-2 text-[var(--muted)]">{config.nome}</p>

      <section className="card-lift mt-8 space-y-4 rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow)]">
        {config.cnpj?.trim() && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">CNPJ</h2>
            <p className="mt-1 font-mono text-[var(--foreground)]">{config.cnpj.trim()}</p>
          </div>
        )}
        {config.horario?.trim() && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">Horário</h2>
            <p className="mt-1 whitespace-pre-line text-[var(--foreground)]">{config.horario.trim()}</p>
          </div>
        )}
        {config.endereco?.trim() && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">Endereço</h2>
            <p className="mt-1 text-[var(--foreground)]">{config.endereco.trim()}</p>
          </div>
        )}
        {config.tempoEstimadoTexto?.trim() && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">Tempo estimado</h2>
            <p className="mt-1 text-[var(--foreground)]">{config.tempoEstimadoTexto.trim()}</p>
          </div>
        )}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)]">WhatsApp</h2>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition hover:brightness-105"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {mapSrc && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-[var(--foreground)]">Mapa</h2>
          <div className="overflow-hidden rounded-2xl border-2 border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--shadow)]">
            <iframe
              title="Localização no mapa"
              src={mapSrc}
              className="h-[min(55vh,420px)] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {!config.cnpj?.trim() && !config.horario?.trim() && !config.endereco?.trim() && !mapSrc && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Os dados de contato completos podem ser configurados no painel administrativo (CNPJ, horário, endereço e mapa).
        </p>
      )}
    </div>
  );
}
