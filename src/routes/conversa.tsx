import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/finchat-logo.png";
import { ConfirmacaoTransacao } from "@/components/finchat/ConfirmacaoTransacao";
import { AppShell } from "@/components/finchat/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/conversa")({
  head: () => ({
    meta: [
      { title: "Conversa | FinChat" },
      {
        name: "description",
        content:
          "Converse com o assistente do FinChat por texto ou voz e registre seus gastos e recebimentos em segundos.",
      },
      { property: "og:title", content: "Conversa | FinChat" },
      {
        property: "og:description",
        content: "Conte o que gastou, por texto ou voz, e confirme o registro com um toque.",
      },
    ],
  }),
  component: Conversa,
});

const CHAVE_MENSAGENS = "finchat:mensagens:v1";

const SUGESTOES = [
  "Gastei 35 reais no mercado",
  "Recebi 200 reais de um trabalho extra",
  "Como posso economizar este mês?",
];

function carregarMensagens(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const bruto = window.localStorage.getItem(CHAVE_MENSAGENS);
    return bruto ? (JSON.parse(bruto) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

type ReconhecimentoFala = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((evento: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function Conversa() {
  const [iniciais] = useState<UIMessage[]>(() => carregarMensagens());
  const [texto, setTexto] = useState("");
  const [gravando, setGravando] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const reconhecimentoRef = useRef<ReconhecimentoFala | null>(null);

  const { messages, sendMessage, status, setMessages, addToolResult } = useChat({
    id: "finchat-conversa",
    messages: iniciais,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (erro) =>
      toast.error("Não consegui responder agora", {
        description: erro.message.includes("429")
          ? "Muitas mensagens em pouco tempo. Tente de novo em instantes."
          : "Verifique sua conexão e tente novamente.",
      }),
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CHAVE_MENSAGENS, JSON.stringify(messages));
    } catch {
      /* armazenamento cheio ou indisponível */
    }
  }, [messages]);

  const focar = useCallback(() => textareaRef.current?.focus(), []);
  useEffect(() => {
    focar();
  }, [focar, status]);

  const carregando = status === "submitted" || status === "streaming";

  function enviar(valor: string) {
    const conteudo = valor.trim();
    if (!conteudo || carregando) return;
    setTexto("");
    void sendMessage({ text: conteudo });
    focar();
  }

  function alternarGravacao() {
    const janela = window as unknown as {
      SpeechRecognition?: new () => ReconhecimentoFala;
      webkitSpeechRecognition?: new () => ReconhecimentoFala;
    };
    const Reconhecimento = janela.SpeechRecognition ?? janela.webkitSpeechRecognition;
    if (!Reconhecimento) {
      toast.info("Este navegador não aceita ditado por voz", {
        description: "Você pode escrever sua mensagem normalmente.",
      });
      return;
    }

    if (gravando) {
      reconhecimentoRef.current?.stop();
      setGravando(false);
      return;
    }

    const reconhecimento = new Reconhecimento();
    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;
    reconhecimento.onresult = (evento) => {
      const falado = evento.results[0]?.[0]?.transcript ?? "";
      setTexto((atual) => (atual ? `${atual} ${falado}` : falado));
    };
    reconhecimento.onerror = () => {
      setGravando(false);
      toast.info("Não consegui ouvir dessa vez", {
        description: "Tente falar de novo ou escreva sua mensagem.",
      });
    };
    reconhecimento.onend = () => {
      setGravando(false);
      focar();
    };
    reconhecimentoRef.current = reconhecimento;
    reconhecimento.start();
    setGravando(true);
  }

  function limpar() {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(CHAVE_MENSAGENS);
    focar();
  }

  return (
    <AppShell titulo="Conversa com o assistente financeiro" semRolagem>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base text-muted-foreground">
            Conte o que você gastou ou recebeu. Pode escrever ou falar.
          </p>
          <Button variant="outline" size="sm" onClick={limpar} aria-label="Apagar esta conversa e começar de novo">
            <RotateCcw aria-hidden="true" />
            Limpar
          </Button>
        </div>

        <Conversation className="min-h-0 flex-1 rounded-xl border border-border bg-card">
          <ConversationContent className="space-y-4">
            {messages.length === 0 && (
              <div className="mx-auto max-w-md space-y-4 py-8 text-center">
                <img src={logo} alt="" aria-hidden="true" width={72} height={72} className="mx-auto size-18" />
                <h2 className="text-2xl font-bold">Vamos começar?</h2>
                <p className="text-base text-muted-foreground">
                  Exemplo: “Gastei 35 reais no mercado”. Eu anoto e você só confirma.
                </p>
                <ul className="space-y-2">
                  {SUGESTOES.map((s) => (
                    <li key={s}>
                      <Button
                        variant="outline"
                        className="min-h-12 w-full whitespace-normal py-2 text-left"
                        onClick={() => enviar(s)}
                      >
                        {s}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((mensagem) => (
              <Message from={mensagem.role} key={mensagem.id}>
                <MessageContent
                  className={
                    mensagem.role === "user"
                      ? "bg-primary text-primary-foreground text-base"
                      : "bg-transparent p-0 text-base text-foreground"
                  }
                >
                  {mensagem.parts.map((parte, indice) => {
                    if (parte.type === "text") {
                      return mensagem.role === "assistant" ? (
                        <MessageResponse key={indice}>{parte.text}</MessageResponse>
                      ) : (
                        <p key={indice}>{parte.text}</p>
                      );
                    }
                    if (parte.type === "tool-registrar_transacao") {
                      return (
                        <ConfirmacaoTransacao
                          key={parte.toolCallId}
                          parte={parte}
                          aoResponder={(saida) =>
                            void addToolResult({
                              tool: "registrar_transacao",
                              toolCallId: parte.toolCallId,
                              output: saida,
                            })
                          }
                        />
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))}

            {status === "submitted" && (
              <p role="status" aria-live="polite" className="px-2 text-base">
                <Shimmer>Pensando…</Shimmer>
              </p>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={(_, evento) => {
            evento.preventDefault();
            enviar(texto);
          }}
        >
          <PromptInputTextarea
            ref={textareaRef}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva aqui, por exemplo: gastei 35 reais no mercado"
            aria-label="Escreva sua mensagem para o assistente financeiro"
            className="min-h-20 text-base"
            autoFocus
          />
          <PromptInputFooter className="justify-between">
            <PromptInputTools>
              <Button
                type="button"
                variant={gravando ? "destructive" : "outline"}
                size="icon"
                onClick={alternarGravacao}
                aria-label={gravando ? "Parar a gravação de voz" : "Falar em vez de escrever"}
                aria-pressed={gravando}
                title={gravando ? "Parar a gravação" : "Falar em vez de escrever"}
              >
                {gravando ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
              </Button>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {gravando ? "Ouvindo você…" : "Toque no microfone para falar"}
              </span>
            </PromptInputTools>
            <PromptInputSubmit
              status={status}
              disabled={!texto.trim() && !carregando}
              aria-label="Enviar mensagem"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </AppShell>
  );
}
