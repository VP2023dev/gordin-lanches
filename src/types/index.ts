export interface Categoria {
  id: string;
  nome: string;
  ordem: number;
  /** 'lanches' | 'japonesa' - agrupa no cardápio */
  secao?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  ingredientes?: string;
  preco: number;
  imagem?: string | null;
  categoriaId: string;
  disponivel: boolean;
  ordem: number;
  destaque?: boolean;
}

export interface Promocao {
  id: string;
  titulo: string;
  descricao: string;
  precoPromocional?: number;
  imagem?: string;
  ativa: boolean;
  ordem: number;
  createdAt: string;
}

export interface ConfigLoja {
  nome: string;
  whatsapp: string;
  endereco?: string;
  horario?: string;
  logoUrl?: string | null;
  /** "11:00" - para exibir "Aberto agora" */
  horaAbertura?: string | null;
  /** "23:00" - para exibir "Aberto agora" */
  horaFechamento?: string | null;
  /** Ex.: "~25 min" — exibido no cardápio e no pedido */
  tempoEstimadoTexto?: string;
  /** Taxa quando o bairro não está na lista (R$) */
  taxaEntregaPadrao?: number;
  /**
   * Uma linha por bairro: `Centro;5` ou `Jardim Europa;7,50`
   * (ponto e vírgula entre nome e valor)
   */
  taxasBairroText?: string;
  /** Código promocional (cliente digita na finalização) */
  cupomCodigo?: string;
  /** Desconto % sobre o subtotal dos itens (não incide na entrega) */
  cupomDescontoPercent?: number;
  cnpj?: string;
  /** URL completa do atributo `src` do iframe do Google Maps */
  mapsEmbedUrl?: string;
}

/** Item de um combo (produto + quantidade) */
export interface ComboItem {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
}

export interface Combo {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  imagem?: string | null;
  ativo: boolean;
  ordem: number;
  itens: ComboItem[];
}

export interface Acrescimo {
  id: string;
  nome: string;
  preco: number;
  ativo: boolean;
  ordem: number;
}

export interface AcrescimoSelecionado {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}
