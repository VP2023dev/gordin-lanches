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
