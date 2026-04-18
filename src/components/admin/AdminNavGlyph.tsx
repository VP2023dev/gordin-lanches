/** Ícones discretos para navegação do painel (SVG inline, sem dependência extra). */
export function AdminNavGlyph({ id, className = "h-[18px] w-[18px]" }: { id: string; className?: string }) {
  const stroke = { fill: "none" as const, stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "config":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "categorias":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      );
    case "produtos":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case "acrescimos":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "promocoes":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      );
    case "pedidos":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case "producao":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5H4V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v5h-6V5zM4 14h6v6H5a1 1 0 01-1-1v-5zm10 0h6v5a1 1 0 01-1 1h-5v-6z" />
        </svg>
      );
    case "combos":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "avaliacoes":
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden {...stroke}>
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    default:
      return <span className={className} aria-hidden />;
  }
}
