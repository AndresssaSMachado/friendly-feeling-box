import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Volume2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/finchat/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acoes, useFinChat } from "@/lib/finchat/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinChat — organize seu dinheiro conversando" },
      {
        name: "description",
        content:
          "FinChat é um assistente de finanças pessoais por conversa: anote gastos por texto ou voz, veja seu saldo e acompanhe metas, com acessibilidade em primeiro lugar.",
      },
      { property: "og:title", content: "FinChat — organize seu dinheiro conversando" },
      {
        property: "og:description",
        content:
          "Anote gastos falando ou escrevendo, veja para onde vai seu dinheiro e acompanhe suas metas.",
      },
    ],
  }),
  component: Onboarding,
});

const APRESENTACAO =
  "Oi! Eu sou o FinChat. Eu ajudo você a organizar seu dinheiro conversando comigo, por escrito ou por voz. Você me conta o que gastou e eu anoto tudo para você.";

const PREFERENCIAS = [
  { id: "texto", rotulo: "Textos curtos", detalhe: "Respostas simples e diretas" },
  { id: "graficos", rotulo: "Gráficos visuais", detalhe: "Prefiro ver desenhos e números" },
  { id: "audio", rotulo: "Mensagens em áudio", detalhe: "Prefiro ouvir as respostas" },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const { perfil } = useFinChat();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState(perfil.nome);
  const [renda, setRenda] = useState(perfil.renda);
  const [objetivo, setObjetivo] = useState(perfil.objetivo);
  const [preferencia, setPreferencia] = useState<(typeof PREFERENCIAS)[number]["id"]>(
    perfil.preferencia,
  );
  const [falando, setFalando] = useState(false);

  function ouvirApresentacao() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(APRESENTACAO);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.onend = () => setFalando(false);
    setFalando(true);
    window.speechSynthesis.speak(fala);
  }

  function concluir() {
    acoes.salvarPerfil({ nome, renda, objetivo, preferencia, concluido: true });
    void navigate({ to: "/conversa" });
  }

  return (
    <AppShell titulo="Boas-vindas ao FinChat">
      <div className="space-y-6">
        <ol className="flex items-center gap-2" aria-label="Etapas das boas-vindas">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              aria-current={passo === i ? "step" : undefined}
              className={`flex-1 rounded-full border-2 px-2 py-1 text-center text-sm font-semibold ${
                passo >= i
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              Passo {i + 1} de 3
            </li>
          ))}
        </ol>

        {passo === 0 && (
          <Card>
            <CardContent className="space-y-5 p-6">
              <h2 className="text-3xl font-bold">Oi! Eu sou o FinChat 👋</h2>
              <p className="text-lg">{APRESENTACAO}</p>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={ouvirApresentacao}
                aria-label="Ouvir esta apresentação em áudio"
              >
                <Volume2 aria-hidden="true" />
                {falando ? "Tocando o áudio…" : "Ouvir esta mensagem"}
              </Button>
              <Button size="lg" className="w-full" onClick={() => setPasso(1)}>
                Começar
                <ArrowRight aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        )}

        {passo === 1 && (
          <Card>
            <CardContent className="space-y-6 p-6">
              <h2 className="text-2xl font-bold">Pode me contar um pouco sobre você?</h2>
              <p className="text-base text-muted-foreground">
                Tudo aqui é opcional. Se preferir, é só pular.
              </p>

              <div className="space-y-2">
                <Label htmlFor="nome" className="text-base">
                  Como você quer ser chamado?
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex.: Maria"
                  className="h-12 text-base"
                  autoComplete="given-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="renda" className="text-base">
                  Quanto costuma entrar por mês? (mais ou menos)
                </Label>
                <Input
                  id="renda"
                  value={renda}
                  onChange={(e) => setRenda(e.target.value)}
                  placeholder="Ex.: 3.200 reais"
                  inputMode="decimal"
                  className="h-12 text-base"
                  aria-describedby="renda-ajuda"
                />
                <p id="renda-ajuda" className="text-sm text-muted-foreground">
                  Um valor aproximado já ajuda bastante.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo" className="text-base">
                  Qual seu principal objetivo agora?
                </Label>
                <Input
                  id="objetivo"
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  placeholder="Ex.: guardar dinheiro para emergências"
                  className="h-12 text-base"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="flex-1" onClick={() => setPasso(2)}>
                  Continuar
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => setPasso(2)}
                  aria-label="Pular estas perguntas e continuar"
                >
                  Pular por agora
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {passo === 2 && (
          <Card>
            <CardContent className="space-y-6 p-6">
              <h2 className="text-2xl font-bold">Como você prefere que eu responda?</h2>
              <fieldset className="space-y-3">
                <legend className="sr-only">Preferência de comunicação</legend>
                {PREFERENCIAS.map((op) => {
                  const escolhido = preferencia === op.id;
                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setPreferencia(op.id)}
                      aria-pressed={escolhido}
                      className={`flex min-h-16 w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left ${
                        escolhido
                          ? "border-primary bg-secondary"
                          : "border-border bg-card hover:bg-secondary/60"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          escolhido ? "border-primary bg-primary text-primary-foreground" : "border-input"
                        }`}
                      >
                        {escolhido ? <Check className="size-5" /> : null}
                      </span>
                      <span>
                        <span className="block text-lg font-semibold">{op.rotulo}</span>
                        <span className="block text-base text-muted-foreground">{op.detalhe}</span>
                      </span>
                    </button>
                  );
                })}
              </fieldset>

              <Button size="lg" className="w-full" onClick={concluir}>
                Ir para a conversa
                <ArrowRight aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
