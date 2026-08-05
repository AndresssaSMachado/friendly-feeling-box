import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const INSTRUCOES = `Você é o assistente financeiro do FinChat. Fala português do Brasil de forma simples, curta e acolhedora.

Regras de linguagem:
- Use palavras do dia a dia. Nunca use termos técnicos como "DRE", "fluxo de caixa", "amortização", "passivo" ou "patrimônio líquido".
- Frases curtas. No máximo 3 frases por resposta, sem tabelas.
- Nunca escreva mensagens de erro assustadoras. Se não entender, pergunte com gentileza: "Só para eu anotar certinho: quanto você gastou?".

Sobre registrar dinheiro:
- Quando a pessoa contar um gasto ou um recebimento (ex.: "gastei 35 reais no mercado"), chame a ferramenta registrar_transacao com o valor, o tipo e a categoria.
- Categorias válidas: alimentacao, transporte, moradia, lazer, saude, renda, outros.
- Se faltar o valor ou não der para saber do que se trata, NÃO chame a ferramenta: faça uma pergunta simples primeiro.
- Depois de chamar a ferramenta, não repita os dados: a pessoa vê um cartão para confirmar na tela.

Se a pessoa pedir dicas, dê uma sugestão prática e encorajadora, sem julgar.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Mensagens são obrigatórias", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Falta LOVABLE_API_KEY", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const gateway = createLovableAiGatewayProvider(key, initialRunId);

        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: INSTRUCOES,
          messages: await convertToModelMessages(messages as UIMessage[]),
          tools: {
            registrar_transacao: tool({
              description:
                "Prepara o registro de um gasto ou de um dinheiro que entrou, para a pessoa confirmar na tela.",
              inputSchema: z.object({
                tipo: z.enum(["entrada", "saida"]),
                valor: z.number().describe("Valor em reais, apenas o número"),
                categoria: z.enum([
                  "alimentacao",
                  "transporte",
                  "moradia",
                  "lazer",
                  "saude",
                  "renda",
                  "outros",
                ]),
                descricao: z.string().describe("Descrição curta em português, ex.: Compra no mercado"),
              }),
            }),
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          headers: getLovableAiGatewayResponseHeaders(undefined, {
            ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
          }),
        });

        return withLovableAiGatewayRunIdHeader(response, gateway);
      },
    },
  },
});
