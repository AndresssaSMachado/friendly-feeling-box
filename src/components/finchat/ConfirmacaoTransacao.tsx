import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LISTA_CATEGORIAS, categoria, formatarDinheiro } from "@/lib/finchat/data";
import type { CategoriaId } from "@/lib/finchat/data";
import { acoes } from "@/lib/finchat/store";

export type EntradaTransacao = {
  tipo: "entrada" | "saida";
  valor: number;
  categoria: CategoriaId;
  descricao: string;
};

export type ParteFerramenta = {
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
};

export function ConfirmacaoTransacao({
  parte,
  aoResponder,
}: {
  parte: ParteFerramenta;
  aoResponder: (saida: string) => void;
}) {
  const dados = (parte.input ?? {}) as Partial<EntradaTransacao>;
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(String(dados.valor ?? ""));
  const [cat, setCat] = useState<CategoriaId>((dados.categoria as CategoriaId) ?? "outros");
  const [descricao, setDescricao] = useState(dados.descricao ?? "");
  const tipo = dados.tipo === "entrada" ? "entrada" : "saida";
  const resolvido = typeof parte.output === "string";

  if (parte.state === "input-streaming") {
    return (
      <p className="text-base text-muted-foreground" role="status">
        Anotando o que você contou…
      </p>
    );
  }

  const info = categoria(cat);
  const numero = Number(String(valor).replace(",", ".")) || 0;
  const rotuloTipo = tipo === "entrada" ? "Dinheiro que entrou" : "Dinheiro que saiu";

  if (resolvido) {
    const texto = parte.output as string;
    const cancelado = texto.startsWith("cancelado");
    return (
      <div
        className={`mt-2 rounded-xl border-2 px-4 py-3 text-base ${
          cancelado
            ? "border-border bg-muted text-foreground"
            : "border-positive bg-positive-surface text-foreground"
        }`}
        role="status"
      >
        {cancelado ? "✕ Registro desfeito. Nada foi salvo." : `✓ ${texto}`}
      </div>
    );
  }

  function confirmar() {
    if (numero <= 0) {
      toast.info("Falta o valor", { description: "Escreva quanto foi, por exemplo 35." });
      return;
    }
    acoes.adicionarTransacao({
      tipo,
      valor: numero,
      categoria: cat,
      descricao: descricao || info.nome,
    });
    aoResponder(
      `${rotuloTipo}: ${formatarDinheiro(numero)} em ${info.nome} (${descricao || info.nome}). Registro salvo.`,
    );
    toast.success("Pronto, anotei!", {
      description: `${formatarDinheiro(numero)} em ${info.nome}.`,
    });
  }

  return (
    <div
      className={`mt-2 rounded-xl border-2 bg-card p-4 ${
        tipo === "entrada" ? "border-positive" : "border-negative"
      }`}
    >
      <p className="flex items-center gap-2 text-base font-semibold">
        <span aria-hidden="true">{tipo === "entrada" ? "⬆️" : "⬇️"}</span>
        <span className={tipo === "entrada" ? "text-positive" : "text-negative"}>{rotuloTipo}</span>
      </p>

      {editando ? (
        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor={`valor-${parte.toolCallId}`} className="text-base">
              Valor em reais
            </Label>
            <Input
              id={`valor-${parte.toolCallId}`}
              value={valor}
              inputMode="decimal"
              onChange={(e) => setValor(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`desc-${parte.toolCallId}`} className="text-base">
              Descrição
            </Label>
            <Input
              id={`desc-${parte.toolCallId}`}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`cat-${parte.toolCallId}`} className="text-base">
              Categoria
            </Label>
            <Select value={cat} onValueChange={(v) => setCat(v as CategoriaId)}>
              <SelectTrigger id={`cat-${parte.toolCallId}`} className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LISTA_CATEGORIAS.map((c) => (
                  <SelectItem key={c.id} value={c.id} className="text-base">
                    {c.icone} {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <dl className="mt-3 space-y-1 text-base">
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground">Valor:</dt>
            <dd className="text-2xl font-bold">{formatarDinheiro(numero)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground">Categoria:</dt>
            <dd>
              <span aria-hidden="true">{info.icone}</span> {info.nome}
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-muted-foreground">Descrição:</dt>
            <dd>{descricao || info.nome}</dd>
          </div>
        </dl>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="min-h-12 flex-1" onClick={confirmar}>
          <Check aria-hidden="true" />
          Confirmar
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 flex-1"
          onClick={() => setEditando((e) => !e)}
        >
          <Pencil aria-hidden="true" />
          {editando ? "Pronto, revisar" : "Editar"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 flex-1"
          onClick={() => aoResponder("cancelado pela pessoa; nada foi salvo")}
        >
          <X aria-hidden="true" />
          Desfazer
        </Button>
      </div>
    </div>
  );
}
