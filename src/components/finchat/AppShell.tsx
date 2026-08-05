import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/finchat-logo.png";
import { Button } from "@/components/ui/button";
import { acoes, useFinChat } from "@/lib/finchat/store";

const NAV = [
  { to: "/", rotulo: "Início" },
  { to: "/conversa", rotulo: "Conversa" },
  { to: "/painel", rotulo: "Meu dinheiro" },
  { to: "/metas", rotulo: "Metas" },
] as const;

export function AppShell({
  children,
  titulo,
  semRolagem = false,
}: {
  children: ReactNode;
  titulo: string;
  semRolagem?: boolean;
}) {
  const { tema } = useFinChat();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#conteudo"
        className="sr-only rounded-md bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Pular para o conteúdo principal
      </a>

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 rounded-md" aria-label="FinChat, ir para o início">
            <img src={logo} alt="" aria-hidden="true" width={40} height={40} className="size-10" />
            <span className="font-display text-xl font-bold text-foreground">FinChat</span>
          </Link>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => acoes.alternarTema()}
              aria-label={
                tema === "claro" ? "Ativar modo escuro" : "Ativar modo claro"
              }
              title={tema === "claro" ? "Ativar modo escuro" : "Ativar modo claro"}
            >
              {tema === "claro" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </Button>
          </div>
        </div>

        <nav aria-label="Navegação principal" className="mx-auto w-full max-w-3xl px-2 pb-2">
          <ul className="flex flex-wrap gap-2">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex min-h-12 items-center rounded-lg px-4 text-base font-medium text-foreground hover:bg-secondary"
                  activeProps={{
                    className:
                      "flex min-h-12 items-center rounded-lg px-4 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary",
                    "aria-current": "page",
                  }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main
        id="conteudo"
        className={
          semRolagem
            ? "mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4 py-4"
            : "mx-auto w-full max-w-3xl flex-1 px-4 py-6"
        }
      >
        <h1 className="sr-only">{titulo}</h1>
        {children}
      </main>
    </div>
  );
}
