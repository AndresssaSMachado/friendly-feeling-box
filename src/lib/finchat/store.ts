import { useSyncExternalStore } from "react";
import type { CategoriaId } from "./data";

export type Transacao = {
  id: string;
  tipo: "entrada" | "saida";
  valor: number;
  categoria: CategoriaId;
  descricao: string;
  data: string;
};

export type Meta = {
  id: string;
  nome: string;
  alvo: number;
  guardado: number;
};

export type Perfil = {
  nome: string;
  renda: string;
  objetivo: string;
  preferencia: "texto" | "graficos" | "audio";
  concluido: boolean;
};

export type EstadoFinChat = {
  perfil: Perfil;
  transacoes: Transacao[];
  metas: Meta[];
  tema: "claro" | "escuro";
};

const CHAVE = "finchat:estado:v1";

function hoje(diasAtras: number) {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toISOString();
}

export const ESTADO_INICIAL: EstadoFinChat = {
  perfil: { nome: "", renda: "", objetivo: "", preferencia: "texto", concluido: false },
  transacoes: [
    {
      id: "t1",
      tipo: "entrada",
      valor: 3200,
      categoria: "renda",
      descricao: "Salário do mês",
      data: hoje(20),
    },
    {
      id: "t2",
      tipo: "saida",
      valor: 890,
      categoria: "moradia",
      descricao: "Aluguel do apartamento",
      data: hoje(15),
    },
    {
      id: "t3",
      tipo: "saida",
      valor: 435.5,
      categoria: "alimentacao",
      descricao: "Compras do mercado",
      data: hoje(9),
    },
    {
      id: "t4",
      tipo: "saida",
      valor: 180,
      categoria: "transporte",
      descricao: "Recarga do cartão de ônibus",
      data: hoje(6),
    },
    {
      id: "t5",
      tipo: "saida",
      valor: 120,
      categoria: "saude",
      descricao: "Remédios na farmácia",
      data: hoje(3),
    },
    {
      id: "t6",
      tipo: "saida",
      valor: 75,
      categoria: "lazer",
      descricao: "Cinema com a família",
      data: hoje(1),
    },
  ],
  metas: [
    { id: "m1", nome: "Reserva de emergência", alvo: 4000, guardado: 1000 },
  ],
  tema: "claro",
};

let estado: EstadoFinChat = ESTADO_INICIAL;
let carregado = false;
const ouvintes = new Set<() => void>();

function notificar() {
  for (const o of ouvintes) o();
}

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    /* armazenamento indisponível — segue apenas em memória */
  }
}

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const bruto = window.localStorage.getItem(CHAVE);
    if (bruto) {
      const salvo = JSON.parse(bruto) as Partial<EstadoFinChat>;
      estado = { ...ESTADO_INICIAL, ...salvo };
    }
  } catch {
    estado = ESTADO_INICIAL;
  }
  aplicarTema(estado.tema);
}

export function aplicarTema(tema: "claro" | "escuro") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", tema === "escuro");
}

function assinar(ouvinte: () => void) {
  carregar();
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

function ler() {
  carregar();
  return estado;
}

export function useFinChat(): EstadoFinChat {
  return useSyncExternalStore(assinar, ler, () => ESTADO_INICIAL);
}

function atualizar(mudanca: Partial<EstadoFinChat>) {
  estado = { ...estado, ...mudanca };
  persistir();
  notificar();
}

export const acoes = {
  salvarPerfil(perfil: Partial<Perfil>) {
    atualizar({ perfil: { ...estado.perfil, ...perfil } });
  },
  adicionarTransacao(t: Omit<Transacao, "id" | "data"> & { data?: string }) {
    const nova: Transacao = {
      ...t,
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      data: t.data ?? new Date().toISOString(),
    };
    atualizar({ transacoes: [nova, ...estado.transacoes] });
    return nova;
  },
  removerTransacao(id: string) {
    atualizar({ transacoes: estado.transacoes.filter((t) => t.id !== id) });
  },
  adicionarMeta(nome: string, alvo: number) {
    const meta: Meta = { id: `m-${Date.now()}`, nome, alvo, guardado: 0 };
    atualizar({ metas: [...estado.metas, meta] });
  },
  guardarNaMeta(id: string, valor: number) {
    atualizar({
      metas: estado.metas.map((m) =>
        m.id === id ? { ...m, guardado: Math.max(0, Math.min(m.alvo, m.guardado + valor)) } : m,
      ),
    });
  },
  removerMeta(id: string) {
    atualizar({ metas: estado.metas.filter((m) => m.id !== id) });
  },
  alternarTema() {
    const tema = estado.tema === "claro" ? "escuro" : "claro";
    aplicarTema(tema);
    atualizar({ tema });
  },
  reiniciar() {
    estado = ESTADO_INICIAL;
    aplicarTema(estado.tema);
    persistir();
    notificar();
  },
};

export function resumoDoMes(transacoes: Transacao[]) {
  const entradas = transacoes.filter((t) => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const saidas = transacoes.filter((t) => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
  return { entradas, saidas, saldo: entradas - saidas };
}
