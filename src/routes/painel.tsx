import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Trash2 } from "lucide-react";
import { AppShell } from "@/components/finchat/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoria, formatarData, formatarDinheiro } from "@/lib/finchat/data";
import { acoes, resumoDoMes, useFinChat } from "@/lib/finchat/store";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Meu dinheiro | FinChat" },
      {
        name: "description",
        content:
          "Veja quanto entrou, quanto saiu e para onde foi seu dinheiro, em linguagem simples e alto contraste.",
      },
      { property: "og:title", content: "Meu dinheiro | FinChat" },
      {
        property: "og:description",
        content: "Resumo do mês, gastos por categoria e histórico das suas anotações.",
      },
    ],
  }),
  component: Painel,
});

function Painel() {
  const { transacoes, perfil } = useFinChat();
  const { entradas, saidas, saldo } = resumoDoMes(transacoes);

  const porCategoria = Object.values(
    transacoes
      .filter((t) => t.tipo === "saida")
      .reduce<Record<string, { id: string; total: number }>>((acc, t) => {
        acc[t.categoria] = { id: t.categoria, total: (acc[t.categoria]?.total ?? 0) + t.valor };
        return acc;
      }, {}),
  ).sort((a, b) => b.total - a.total);

  const maior = porCategoria[0];

  return (
    <AppShell titulo="Meu dinheiro">
      <div className="space-y-6">
        <section aria-labelledby="resumo-titulo" className="space-y-3">
          <h2 id="resumo-titulo" className="text-2xl font-bold">
            {perfil.nome ? `Olá, ${perfil.nome}!` : "Resumo do seu mês"}
          </h2>

          <Card className={saldo >= 0 ? "border-2 border-positive" : "border-2 border-negative"}>
            <CardContent className="p-6">
              <p className="text-base text-muted-foreground">
                {saldo >= 0 ? "Sobrou até agora" : "Você gastou mais do que entrou"}
              </p>
              <p className="mt-1 text-4xl font-bold">
                <span aria-hidden="true">{saldo >= 0 ? "🙂 " : "⚠️ "}</span>
                {formatarDinheiro(Math.abs(saldo))}
              </p>
              <p className="mt-2 text-base">
                {saldo >= 0
                  ? "Isso é o que ainda está disponível para você usar ou guardar."
                  : "Vale olhar os gastos maiores e ver o que dá para diminuir."}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-2 border-positive">
              <CardContent className="p-5">
                <p className="text-base text-muted-foreground">
                  <span aria-hidden="true">⬆️ </span>Dinheiro que entrou
                </p>
                <p className="text-2xl font-bold text-positive">{formatarDinheiro(entradas)}</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-negative">
              <CardContent className="p-5">
                <p className="text-base text-muted-foreground">
                  <span aria-hidden="true">⬇️ </span>Dinheiro que saiu
                </p>
                <p className="text-2xl font-bold text-negative">{formatarDinheiro(saidas)}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-labelledby="categorias-titulo" className="space-y-3">
          <h2 id="categorias-titulo" className="text-2xl font-bold">
            Para onde foi seu dinheiro
          </h2>
          {maior && (
            <p className="text-base">
              Seu maior gasto foi com <strong>{categoria(maior.id).nome}</strong>:{" "}
              {formatarDinheiro(maior.total)}.
            </p>
          )}

          <ul className="space-y-3">
            {porCategoria.map((linha) => {
              const info = categoria(linha.id);
              const porcento = saidas > 0 ? Math.round((linha.total / saidas) * 100) : 0;
              return (
                <li key={linha.id}>
                  <div className="rounded-xl border-2 border-border bg-card p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-lg font-semibold">
                        <span aria-hidden="true">{info.icone} </span>
                        {info.nome}
                      </span>
                      <span className="text-lg font-bold">
                        {formatarDinheiro(linha.total)}{" "}
                        <span className="text-base font-normal text-muted-foreground">
                          ({porcento}%)
                        </span>
                      </span>
                    </div>
                    <div
                      role="meter"
                      aria-valuenow={porcento}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${info.nome}: ${porcento} por cento dos seus gastos, ${formatarDinheiro(linha.total)}`}
                      className="mt-3 h-5 w-full overflow-hidden rounded-full border border-border bg-muted"
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(porcento, 3)}%`,
                          backgroundColor: info.cor,
                          backgroundImage:
                            info.padrao === "listras"
                              ? "repeating-linear-gradient(90deg, rgba(255,255,255,.65) 0 4px, transparent 4px 10px)"
                              : info.padrao === "pontos"
                                ? "radial-gradient(rgba(255,255,255,.75) 1.6px, transparent 1.8px)"
                                : info.padrao === "grade"
                                  ? "repeating-linear-gradient(0deg, rgba(255,255,255,.6) 0 2px, transparent 2px 8px), repeating-linear-gradient(90deg, rgba(255,255,255,.6) 0 2px, transparent 2px 8px)"
                                  : info.padrao === "diagonal"
                                    ? "repeating-linear-gradient(45deg, rgba(255,255,255,.65) 0 4px, transparent 4px 10px)"
                                    : info.padrao === "ondas"
                                      ? "repeating-linear-gradient(-45deg, rgba(255,255,255,.65) 0 3px, transparent 3px 9px)"
                                      : "none",
                          backgroundSize: info.padrao === "pontos" ? "8px 8px" : undefined,
                        }}
                      />
                    </div>
                    <p className="sr-only">{info.descricao}</p>
                  </div>
                </li>
              );
            })}
            {porCategoria.length === 0 && (
              <li className="rounded-xl border-2 border-dashed border-border p-6 text-base">
                Você ainda não anotou nenhum gasto. Converse comigo para começar.
              </li>
            )}
          </ul>
        </section>

        <section aria-labelledby="historico-titulo" className="space-y-3">
          <h2 id="historico-titulo" className="text-2xl font-bold">
            Suas últimas anotações
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-normal text-muted-foreground">
                Da mais recente para a mais antiga
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {transacoes.map((t) => {
                  const info = categoria(t.categoria);
                  return (
                    <li key={t.id} className="flex items-center gap-3 px-4 py-3">
                      <span aria-hidden="true" className="text-2xl">
                        {info.icone}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-semibold">{t.descricao}</span>
                        <span className="block text-sm text-muted-foreground">
                          {info.nome} · {formatarData(t.data)}
                        </span>
                      </span>
                      <span
                        className={`text-base font-bold ${t.tipo === "entrada" ? "text-positive" : "text-negative"}`}
                      >
                        {t.tipo === "entrada" ? "+" : "−"} {formatarDinheiro(t.valor)}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => acoes.removerTransacao(t.id)}
                        aria-label={`Apagar a anotação ${t.descricao}, ${formatarDinheiro(t.valor)}`}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </section>

        <Button asChild size="lg" className="min-h-14 w-full text-lg">
          <Link to="/conversa">
            <MessageCircle aria-hidden="true" />
            Anotar algo novo conversando
          </Link>
        </Button>
      </div>
    </AppShell>
  );
}
