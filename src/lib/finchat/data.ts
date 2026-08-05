export type CategoriaId =
  | "alimentacao"
  | "transporte"
  | "moradia"
  | "lazer"
  | "saude"
  | "renda"
  | "outros";

export type Categoria = {
  id: CategoriaId;
  /** Nome amigável exibido na interface */
  nome: string;
  /** Descrição completa lida por leitores de tela */
  descricao: string;
  /** Emoji usado como ícone (com texto sempre ao lado) */
  icone: string;
  /** Padrão visual alternativo, para não depender apenas da cor */
  padrao: "listras" | "pontos" | "grade" | "diagonal" | "ondas" | "solido";
  cor: string;
};

export const CATEGORIAS: Record<CategoriaId, Categoria> = {
  alimentacao: {
    id: "alimentacao",
    nome: "Alimentação",
    descricao: "Compras de mercado, feira, restaurantes e lanches",
    icone: "🍎",
    padrao: "listras",
    cor: "var(--color-chart-1)",
  },
  transporte: {
    id: "transporte",
    nome: "Transporte",
    descricao: "Ônibus, metrô, aplicativos de corrida, combustível",
    icone: "🚌",
    padrao: "pontos",
    cor: "var(--color-chart-2)",
  },
  moradia: {
    id: "moradia",
    nome: "Moradia",
    descricao: "Aluguel, contas de luz, água, internet e gás",
    icone: "🏠",
    padrao: "grade",
    cor: "var(--color-chart-3)",
  },
  lazer: {
    id: "lazer",
    nome: "Lazer",
    descricao: "Passeios, cinema, assinaturas e diversão",
    icone: "🎬",
    padrao: "diagonal",
    cor: "var(--color-chart-4)",
  },
  saude: {
    id: "saude",
    nome: "Saúde",
    descricao: "Farmácia, consultas, exames e plano de saúde",
    icone: "💊",
    padrao: "ondas",
    cor: "var(--color-chart-5)",
  },
  renda: {
    id: "renda",
    nome: "Dinheiro que entrou",
    descricao: "Salário, pagamentos recebidos e outras entradas",
    icone: "💰",
    padrao: "solido",
    cor: "var(--color-positive)",
  },
  outros: {
    id: "outros",
    nome: "Outros",
    descricao: "Gastos que não se encaixam nas outras categorias",
    icone: "📦",
    padrao: "solido",
    cor: "var(--color-muted-foreground)",
  },
};

export const LISTA_CATEGORIAS = Object.values(CATEGORIAS);

export function categoria(id: string): Categoria {
  return CATEGORIAS[(id as CategoriaId) in CATEGORIAS ? (id as CategoriaId) : "outros"];
}

export function formatarDinheiro(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}
