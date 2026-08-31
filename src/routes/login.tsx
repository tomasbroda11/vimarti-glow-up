import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { company } from "@/lib/mock-data";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Vimarti Business Manager" },
      {
        name: "description",
        content: "Acceso al sistema de gestión comercial de Vimarti LLC: ventas, cobros y entregas.",
      },
      { property: "og:title", content: "Iniciar sesión — Vimarti Business Manager" },
      {
        property: "og:description",
        content: "Acceso al sistema de gestión comercial de Vimarti LLC.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
            V
          </span>
          <span>
            <span className="block font-display text-sm font-semibold">{company.name}</span>
            <span className="block text-xs text-sidebar-muted">{company.suite}</span>
          </span>
        </div>

        <div className="max-w-md">
          <p className="eyebrow text-sidebar-primary">Gestión comercial</p>
          <h1 className="mt-4 text-4xl leading-tight font-bold text-sidebar-foreground">
            Ventas, cobros y entregas en una sola vista operativa.
          </h1>
          <p className="mt-4 text-sm text-sidebar-muted">
            Catálogo, clientes, cuotas y ranking de vendedores, sincronizados en tiempo real.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-6 border-t border-sidebar-border pt-8">
          <div>
            <dt className="text-xs text-sidebar-muted">Ventas</dt>
            <dd className="tabular mt-1 font-display text-xl font-bold">3</dd>
          </div>
          <div>
            <dt className="text-xs text-sidebar-muted">Cobrado</dt>
            <dd className="tabular mt-1 font-display text-xl font-bold">US$ 3.600</dd>
          </div>
          <div>
            <dt className="text-xs text-sidebar-muted">Entregas</dt>
            <dd className="tabular mt-1 font-display text-xl font-bold">2</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid size-9 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
              V
            </span>
            <span>
              <span className="block font-display text-sm font-semibold">{company.name}</span>
              <span className="block text-xs text-muted-foreground">{company.suite}</span>
            </span>
          </div>

          <p className="eyebrow mt-10 text-primary lg:mt-0">Bienvenido</p>
          <h2 className="mt-2 text-2xl font-bold">Iniciá sesión</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Usá tu cuenta corporativa para continuar.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!email || !password) {
                setError("Completá email y contraseña para continuar.");
                return;
              }
              setError(null);
              void navigate({ to: "/" });
            }}
          >
            <div>
              <label htmlFor="login-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@vimarti.net"
                className="mt-1.5 w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm outline-hidden transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-primary"
                >
                  ¿La olvidaste?
                </button>
              </div>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••••"
                className="mt-1.5 w-full rounded-md border border-input bg-surface px-3 py-2.5 text-sm outline-hidden transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              Ingresar
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Al continuar aceptás las políticas internas de uso del sistema de gestión.
          </p>
        </div>
      </div>
    </div>
  );
}
