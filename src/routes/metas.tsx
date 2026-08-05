import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/finchat/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatarDinheiro } from "@/lib/finchat/data";
import { acoes, useFinChat } from "@/lib/finchat/store";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Minhas metas | FinChat" },
      {
        name: "description",
        content:
          "Crie metas simples, guarde um pouco de cada vez e acompanhe o quanto falta para conquistar cada objetivo.",
      },
      { property: "og:title", content: "Minhas metas | FinChat" },
      {
        property: "og:description",
        content: "Metas de poupança com passos pequenos e acompanhamento visual acessível.",
      },
    ],
  }),
  component: Metas,
});

function Metas() {
  const { metas } = useFinChat();
  const [nome, setNome] = useState("");
  const [alvo, setAlvo] = useState("");

  function criar(evento: React.FormEvent) {
    evento.preventDefault();
    const valor = Number(alvo.replace(",", "."));
    if (!nome.trim() || !valor || valor <= 0) {
      toast.info("Faltou preencher", {
        description: "Escreva o nome da meta e quanto você quer juntar.",
      });
      return;
    }
    acoes.adicionarMeta(nome.trim(), valor);
    setNome("");
    setAlvo("");
    toast.success("Meta criada!", { description: `${nome.trim()} — ${formatarDinheiro(valor)}.` });
  }

  return (
    <AppShell titulo="Minhas metas">
      <div className="space-y-6">
        <section aria-labelledby="nova-meta" className="space-y-3">
          <h2 id="nova-meta" className="text-2xl font-bold">
            Criar uma meta
          </h2>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={criar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-nome" className="text-base">
                    Para o que você quer juntar dinheiro?
                  </Label>
                  <Input
                    id="meta-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex.: comprar uma geladeira"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-alvo" className="text-base">
                    Quanto você precisa juntar? (em reais)
                  </Label>
                  <Input
                    id="meta-alvo"
                    value={alvo}
                    onChange={(e) => setAlvo(e.target.value)}
                    inputMode="decimal"
                    placeholder="Ex.: 1500"
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="min-h-14 w-full text-lg">
                  <Plus aria-hidden="true" />
                  Criar meta
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="lista-metas" className="space-y-3">
          <h2 id="lista-metas" className="text-2xl font-bold">
            Suas metas
          </h2>

          {metas.length === 0 && (
            <p className="rounded-xl border-2 border-dashed border-border p-6 text-base">
              Você ainda não tem metas. Crie a primeira acima — pode ser algo pequeno.
            </p>
          )}

          <ul className="space-y-4">
            {metas.map((meta) => {
              const porcento = Math.min(100, Math.round((meta.guardado / meta.alvo) * 100));
              const falta = Math.max(0, meta.alvo - meta.guardado);
              const concluida = falta === 0;
              return (
                <li key={meta.id}>
                  <Card className={concluida ? "border-2 border-positive" : ""}>
                    <CardContent className="space-y-4 p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-xl font-bold">
                          <span aria-hidden="true">{concluida ? "🏆 " : "🎯 "}</span>
                          {meta.nome}
                        </h3>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => acoes.removerMeta(meta.id)}
                          aria-label={`Apagar a meta ${meta.nome}`}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>

                      <p className="text-base">
                        Você já guardou <strong>{formatarDinheiro(meta.guardado)}</strong> de{" "}
                        <strong>{formatarDinheiro(meta.alvo)}</strong>.{" "}
                        {concluida
                          ? "Meta conquistada, parabéns!"
                          : `Faltam ${formatarDinheiro(falta)}.`}
                      </p>

                      <div
                        role="meter"
                        aria-valuenow={porcento}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${meta.nome}: ${porcento} por cento concluído`}
                        className="h-6 w-full overflow-hidden rounded-full border-2 border-border bg-muted"
                      >
                        <div
                          className="h-full rounded-full bg-positive"
                          style={{
                            width: `${Math.max(porcento, 2)}%`,
                            backgroundImage:
                              "repeating-linear-gradient(45deg, rgba(255,255,255,.55) 0 5px, transparent 5px 12px)",
                          }}
                        />
                      </div>
                      <p className="text-base font-semibold">{porcento}% concluído</p>

                      {!concluida && (
                        <div className="flex flex-wrap gap-3">
                          {[10, 50, 100].map((valor) => (
                            <Button
                              key={valor}
                              variant="outline"
                              size="lg"
                              className="min-h-12 flex-1"
                              onClick={() => {
                                acoes.guardarNaMeta(meta.id, valor);
                                toast.success(`Guardei ${formatarDinheiro(valor)} nesta meta.`);
                              }}
                              aria-label={`Guardar ${formatarDinheiro(valor)} na meta ${meta.nome}`}
                            >
                              + {formatarDinheiro(valor)}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
