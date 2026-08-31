import { createFileRoute } from "@tanstack/react-router";
import { Moon, Plus, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Td, TableShell, Th, Tr } from "@/components/data-table";
import { Initials, PageHeader, Panel, PanelHeader } from "@/components/primitives";
import { StatusChip } from "@/components/status-chip";
import { integrations, roles, suppliers, users } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Usuarios, roles, integraciones, proveedores y apariencia de la instancia de gestión de Vimarti.",
      },
      { property: "og:title", content: "Configuración — Vimarti" },
      {
        property: "og:description",
        content: "Administrá usuarios, roles, integraciones y apariencia del sistema de Vimarti LLC.",
      },
    ],
  }),
  component: ConfiguracionPage,
});

const tabs = ["Usuarios", "Roles", "Integraciones", "Proveedores", "Apariencia"] as const;
type Tab = (typeof tabs)[number];

function ConfiguracionPage() {
  const [tab, setTab] = useState<Tab>("Usuarios");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppShell breadcrumb="Configuración">
      <PageHeader
        eyebrow="Configuración"
        title="Configuración"
        description="Usuarios, roles, integraciones y apariencia de la instancia."
      />

      <div
        role="tablist"
        aria-label="Secciones de configuración"
        className="mb-4 flex flex-wrap gap-1 border-b border-border"
      >
        {tabs.map((item) => (
          <button
            key={item}
            role="tab"
            type="button"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors duration-150",
              tab === item
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Usuarios" && (
        <Panel padded={false}>
          <PanelHeader
            title="Usuarios"
            subtitle="El acceso se asigna mediante roles y permisos."
            action={
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
              >
                <Plus className="size-4" aria-hidden />
                Invitar usuario
              </button>
            }
          />
          <TableShell>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Email</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <div className="flex min-w-0 items-center gap-3">
                      <Initials name={user.name} />
                      <span className="truncate font-medium">{user.name}</span>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground">{user.email}</Td>
                  <Td>
                    <StatusChip tone="brand" dot={false}>
                      {user.role}
                    </StatusChip>
                  </Td>
                  <Td>
                    <StatusChip tone={user.active ? "success" : "neutral"}>
                      {user.active ? "Activo" : "Inactivo"}
                    </StatusChip>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Desactivar
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Panel>
      )}

      {tab === "Roles" && (
        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <Panel key={role.id}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <h2 className="min-w-0 truncate text-base font-semibold">{role.name}</h2>
                <StatusChip tone="neutral" dot={false}>
                  {role.users} usuarios
                </StatusChip>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{role.permissions}</p>
              <button
                type="button"
                className="mt-4 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
              >
                Editar permisos
              </button>
            </Panel>
          ))}
        </div>
      )}

      {tab === "Integraciones" && (
        <Panel padded={false}>
          <PanelHeader title="Integraciones" subtitle="Servicios conectados a la instancia" />
          <ul className="divide-y divide-border">
            {integrations.map((integration) => (
              <li
                key={integration.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{integration.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{integration.detail}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusChip tone={integration.connected ? "success" : "neutral"}>
                    {integration.connected ? "Conectada" : "Sin conectar"}
                  </StatusChip>
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                  >
                    {integration.connected ? "Configurar" : "Conectar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {tab === "Proveedores" && (
        <Panel padded={false}>
          <PanelHeader title="Proveedores" subtitle="Origen del catálogo comercial" />
          <TableShell>
            <thead>
              <tr>
                <Th>Proveedor</Th>
                <Th>Contacto</Th>
                <Th align="right">Productos</Th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <Tr key={supplier.id}>
                  <Td className="font-medium">{supplier.name}</Td>
                  <Td className="text-muted-foreground">{supplier.contact}</Td>
                  <Td align="right">{supplier.products}</Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Panel>
      )}

      {tab === "Apariencia" && (
        <Panel padded={false} className="max-w-xl">
          <PanelHeader title="Apariencia" subtitle="Tema de la interfaz para tu usuario" />
          <div className="grid gap-3 px-5 py-5 sm:grid-cols-2">
            {[
              { label: "Claro", value: false, icon: Sun },
              { label: "Oscuro", value: true, icon: Moon },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setDark(option.value)}
                aria-pressed={dark === option.value}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium transition-colors duration-150",
                  dark === option.value
                    ? "border-primary bg-brand-soft text-primary"
                    : "border-border hover:bg-accent",
                )}
              >
                <option.icon className="size-4 shrink-0" aria-hidden />
                {option.label}
              </button>
            ))}
          </div>
        </Panel>
      )}
    </AppShell>
  );
}
