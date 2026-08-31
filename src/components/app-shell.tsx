import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bike,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Receipt,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

import { company, currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Initials } from "@/components/primitives";

const nav = [
  { to: "/", label: "Resumen", icon: LayoutDashboard },
  { to: "/productos", label: "Productos", icon: Bike },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/ventas", label: "Ventas", icon: Receipt },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
] as const;

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
          V
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-semibold">{company.name}</span>
          <span className="block truncate text-xs text-sidebar-muted">{company.suite}</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
            }}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <Link
          to="/configuracion"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
        >
          <Settings className="size-4 shrink-0" aria-hidden />
          Configuración
        </Link>
        <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2">
          <Initials name={currentUser.name} tone="brand" className="size-8" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{currentUser.name}</span>
            <span className="block truncate text-xs text-sidebar-muted">{currentUser.role}</span>
          </span>
          <ChevronDown className="size-4 shrink-0 text-sidebar-muted" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  breadcrumb,
  children,
}: {
  breadcrumb: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background" style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] border-r border-sidebar-border md:block">
        <SidebarNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Cerrar navegación"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="md:ml-[var(--sidebar-width)]">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir navegación"
            className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors duration-150 hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <nav aria-label="Ruta" className="min-w-0 text-sm text-muted-foreground">
            <ol className="flex min-w-0 items-center gap-2">
              <li className="hidden sm:block">
                <Link to="/" className="transition-colors duration-150 hover:text-foreground">
                  {company.name}
                </Link>
              </li>
              <li className="hidden text-border-strong sm:block" aria-hidden>
                /
              </li>
              <li className="truncate font-medium text-foreground" aria-current="page">
                {breadcrumb}
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-2 justify-self-end">
            <label className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground focus-within:border-primary lg:flex">
              <Search className="size-4 shrink-0" aria-hidden />
              <span className="sr-only">Buscar</span>
              <input
                type="search"
                placeholder="Buscar ventas, clientes…"
                className="w-52 bg-transparent outline-hidden placeholder:text-muted-foreground"
              />
            </label>
            <Link
              to="/configuracion"
              aria-label="Configuración"
              className={cn(
                "grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors duration-150 hover:text-foreground",
                pathname === "/configuracion" && "text-foreground",
              )}
            >
              <Settings className="size-4" aria-hidden />
            </Link>
            <Initials name={currentUser.name} tone="brand" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
