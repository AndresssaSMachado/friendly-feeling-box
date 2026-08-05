# 💸 App de Organização de Finanças Pessoais da Andressa com Vibe Coding

Aprenda a **criar soluções com IA** de forma criativa, guiando ferramentas como o **Copilot** e o **Lovable** com uma comunicação simples e natural. O foco é desenvolver o conceito de um **App de Organização de Finanças Pessoais**, mas, acima de tudo, aprender o **jeito Vibe de programar com IA**.

## ✨ O que é Vibe Coding

**Vibe Coding** é uma forma leve e criativa de desenvolver com IA, baseada em **conversas naturais e bem estruturadas**. Você não precisa escrever código linha por linha. Em vez disso, aprende a **guiar a IA** descrevendo suas ideias de forma clara, com **intenção e contexto**. Em outras palavras:

> Você mostra a vibe da sua ideia e a IA transforma em solução (ou em um caminho para ela).

## 🎯 Desafio

Problema: Muitas pessoas não conseguem manter um controle financeiro porque os aplicativos exigem muita entrada de dados manual, e a criação de orçamentos é vista como algo tedioso. 

Precisamos de uma solução que permita **controlar as finanças por meio de uma conversa simples**, com **agentes de IA** capazes de criar **planos de economia personalizados e automatizados**. Você deve utilizar as ideias de **Vibe Coding** e **MVP (Produto Mínimo Viável)** para desenvolver o **conceito de um aplicativo** que resolva o problema citado.

> [!IMPORTANT]
> Você **não precisa construir o código**! O foco está em **usar a IA como sua parceira criativa**, transformando boas ideias e prompts em conceitos funcionais que simulam um produto real.

## 🪄 Etapas do Desafio

### 1. Saber o que Pedir é a Chave! Otimize seus Prompts!

Antes de pedir para a IA "criar um app", é importante definir com clareza o que você quer construir e por quê. Para isso, você vai criar um **PRD (Product Requirements Document)** simplificado, uma especificação que serve como _briefing_ para a IA entender sua ideia.

Um bom PRD deve descrever o problema, quem será beneficiado, as principais funcionalidades e o que você espera que a IA entregue. Use o modelo abaixo como ponto de partida e adapte conforme o seu estilo:

```txt
# Contexto
Quero criar um aplicativo de Organização de Finanças Pessoais que funcione por meio de conversas com o usuário.  
A ideia é facilitar o controle financeiro de forma simples e natural, sem formulários manuais ou planilhas complexas.

# Problema
Muitas pessoas desistem de controlar seus gastos porque os apps atuais exigem muita entrada manual e pouca personalização.  
Quero resolver isso com uma experiência de conversa e recomendações automáticas de economia.

# Público-Alvo
Pessoas que querem começar a organizar suas finanças de forma prática e sem complicação, principalmente iniciantes.

# Funcionalidades-Chave
1. Registrar gastos via chat em linguagem natural.  
2. Classificar automaticamente as transações.  
3. Definir e acompanhar metas financeiras.  
4. Receber dicas de economia do “Agente Financeiro”.  
5. Visualizar relatórios simples e personalizados.

# Entregável da IA
Gerar um plano de MVP com as principais telas, recursos necessários e um esboço de validação inicial.  
Usar tom educativo e linguagem acessível, em português.
```

Depois de preencher o modelo, use o Copilot Web para revisar e melhorar o seu prompt antes de ir ao Lovable. A ideia é lapidar o texto até que ele fique claro, direto e reflita exatamente a sua intenção.

> [!TIP]
> Pense no PRD/Prompt como “o briefing que a IA precisa para entender sua vibe”. Portanto, quanto mais claro e intencional for o texto, mais próximas do ideal serão as respostas da IA.

### 2. Explorando o Lovable na Prática

Com seu PRD pronto e revisado, é hora de colocar a IA em ação. Abra o Lovable, cole seu prompt completo e peça o plano inicial do MVP do seu aplicativo. Como o plano gratuito limita você a 5 interações por dia, seja estratégico:
- Faça perguntas diretas e construtivas, como “crie o fluxo de telas com base nas funcionalidades listadas” ou “gere uma versão resumida do plano de MVP”;
- Priorize clareza nas instruções para aproveitar ao máximo cada resposta;

Durante essa etapa, você pode orientar a IA para três entregas principais:
1. Agente Financeiro: defina o comportamento e o tom de voz de um consultor financeiro pessoal, alinhado ao público e objetivo do app.
2. Fluxo de Telas: peça à IA para gerar o fluxo conceitual de telas com base nas funcionalidades descritas no PRD, simulando a interação por conversa.
3. Plano de MVP: solicite um resumo das 5 funcionalidades principais, dos recursos necessários e um plano de validação inicial (como medir se o app cumpre seu propósito).

> [!TIP]
> Se preferir, você pode fazer tudo com o **Copilot**. O importante é exercitar a habilidade de transformar intenções em instruções claras e testar os limites da IA como parceira criativa.

### 3. Entregando o Desafio na DIO

Finalize seu projeto criando um **repositório no GitHub** (pode ser um **fork** deste).  
No README do seu repositório, inclua:

Abaixo segue meu prompt final para Lovable, refinado com auxílio do Gemini:
PRD Revisado com Foco em Design Universal (Pronto para o Lovable)

Abaixo está o seu PRD atualizado, incorporando diretrizes explícitas de Design Universal e acessibilidade para orientar a IA no Lovable.
1. Visão Geral do Produto

    Nome do Projeto: FinChat (Finanças Conversacionais)

    Objetivo: Aplicativo web/mobile de organização financeira pessoal que funciona via chat em linguagem natural, focado em simplicidade, inclusão e acessibilidade universal.

    Público-Alvo: Pessoas que desejam organizar suas finanças sem complicação, incluindo iniciantes, idosos, pessoas com baixo letramento digital/financeiro ou com deficiências visuais/motoras.

2. Princípios de Design Universal & UI/UX (Instruções para o Lovable)

    Acessibilidade de Cores e Contraste:

        Usar contraste de alto nível (mínimo de 4.5:1 para texto normal) alinhado com as diretrizes WCAG AAA.

        Não depender apenas da cor para transmitir informações (ex.: usar texto/ícone junto com a cor verde para entradas e vermelha para saídas).

        Suporte a Modo Claro e Modo Escuro (Dark Mode).

    Tipografia e Leitura:

        Fontes sem serifa, legíveis e com suporte a dimensionamento dinâmico do sistema.

        Tamanho mínimo de fonte de 16px para textos de corpo.

    Interatividade e Alvos de Toque:

        Áreas de toque (touch targets) com no mínimo 48x48 pixels de tamanho para facilitar a navegação por pessoas com tremores ou baixa precisão motora.

        Espaçamento generoso entre botões para evitar toques acidentais.

    Comunicação Multimodal e Flexibilidade:

        Permitir entrada de dados via Texto e Voz (botão de microfone visível e acessível).

        Respostas da IA com linguagem simples (nível de leitura acessível, evitando termos técnicos como "DRE", "Cash Flow" ou "Amortização").

    Compatibilidade com Leitores de Tela:

        Todos os elementos de UI devem ter rótulos descritivos (aria-labels ou textos alternativos) para compatibilidade com NVDA, TalkBack e VoiceOver.

3. Especificação de Telas e Funcionalidades
Tela 1: Onboarding Conversacional e Acessível

    Fluxo:

        Apresentação clara do Agente Financeiro com opção de ouvir a mensagem por áudio.

        Coleta opcional de nome, renda aproximada e objetivo principal.

        Pergunta sobre preferência de comunicação (Ex.: "Prefere textos curtos, gráficos visuais ou mensagens em áudio?").

Tela 2: Chat Financeiro (Core Feature)

    Interface:

        Histórico de mensagens com bolhas de chat de alto contraste.

        Campo de input com botão de envio claro e botão de gravação de áudio destacado.

    Comportamento e Tolerância ao Erro (Princípio 5):

        O usuário envia mensagens soltas (Texto ou Áudio: "Gastei 35 reais no mercado").

        O sistema extrai: Valor, Categoria e Tipo.

        O app exibe o card de confirmação contendo:

            Ícone + Texto + Valor em destaque.

            Botões grandes e bem separados: [ Confirmar ] e [ Editar / Desfazer ].

        Se a IA não entender o gasto, ela faz uma pergunta de elucidação simples, sem emitir mensagens de erro intimidantes.

Tela 3: Dashboard Financeiro Acessível

    Componentes Visualizados:

        Card de Resumo: Saldo Atual do Mês com indicação textual clara ("Sua conta está positiva em R$ X").

        Gráfico de Rosca (Com Texturas/Rótulos): Cada fatia do gráfico deve ter legendas em texto visíveis e padrões visuais alternativos, não dependendo apenas da cor.

        Lista de Transações: Histórico das movimentações com ícone representativo e descrição em texto completo.

        Dica Acessível: Card com dica de economia em tom encorajador e simplificado.

Tela 4: Gestão de Metas

    Componentes Visualizados:

        Barras de progresso com porcentagem em texto numérico visível (Ex: "Reserva de Emergência: 25% concluído").

        Botão de adição com rótulo descritivo "Criar nova meta financeira".

4. Requisitos de Dados e Mock inicial (para prototipação)

    Transações de Exemplo: 5 transações com variadas categorias (Alimentação, Transporte, Moradia, Lazer e Saúde).

    Meta Inicial: 1 meta padrão configurada ("Reserva de Emergência").

    Atributos de Acessibilidade Pré-configurados: Nomes amigáveis e descritivos para todas as categorias no banco de dados fictício.



Boa tarde, Lov! Tudo bem?

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://friendly-feeling-box.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/540f08ca-9e79-442b-b1ee-5892914c68ce).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
