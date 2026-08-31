import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Td, TableShell, Th, Tr } from "@/components/data-table";
import { EmptyState, Initials, PageHeader, Panel, PanelHeader } from "@/components/primitives";
import { StatusChip } from "@/components/status-chip";
import { customers } from "@/lib/mock-data";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Registros de clientes de Vimarti: contacto, ciudad y cantidad de ventas confirmadas por cliente.",
      },
      { property: "og:title", content: "Clientes — Vimarti" },
      {
        property: "og:description",
        content: "Base de clientes utilizada por las ventas confirmadas de Vimarti LLC.",
      },
    ],
  }),
  component: ClientesPage,
});

function ClientesPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <AppShell breadcrumb="Clientes">
      <PageHeader
        eyebrow="Clientes"
        title="Clientes"
        description="Creá y mantené los registros de clientes utilizados por las ventas confirmadas."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Nuevo cliente
          </button>
        }
      />

      <Panel padded={false}>
        <PanelHeader
          title="Clientes"
          subtitle={`${rows.length} ${rows.length === 1 ? "cliente" : "clientes"} registrados`}
          action={
            <label className="shrink-0">
              <span className="sr-only">Buscar cliente</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre o email"
                className="w-48 rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-hidden transition-colors duration-150 placeholder:text-muted-foreground focus:border-primary sm:w-60"
              />
            </label>
          }
        />
        {rows.length === 0 ? (
          <EmptyState
            icon={<Users className="size-5" aria-hidden />}
            title="Sin resultados"
            description="No encontramos clientes que coincidan con la búsqueda."
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Email</Th>
                <Th>Teléfono</Th>
                <Th>Ciudad</Th>
                <Th align="right">Ventas</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((customer) => (
                <Tr key={customer.id}>
                  <Td>
                    <div className="flex min-w-0 items-center gap-3">
                      <Initials name={customer.name} />
                      <span className="min-w-0 truncate font-medium">{customer.name}</span>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground">{customer.email}</Td>
                  <Td className="tabular text-muted-foreground">{customer.phone}</Td>
                  <Td className="text-muted-foreground">{customer.city}</Td>
                  <Td align="right">
                    <StatusChip tone="brand" dot={false}>
                      {customer.salesCount}
                    </StatusChip>
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Ver detalle
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Editar
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Panel>
    </AppShell>
  );
}
