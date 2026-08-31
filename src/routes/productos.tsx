import { createFileRoute } from "@tanstack/react-router";
import { Bike, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Td, TableFooterBar, TableShell, Th, Tr } from "@/components/data-table";
import {
  EmptyState,
  PageHeader,
  Panel,
  PanelHeader,
  SegmentedFilter,
} from "@/components/primitives";
import { StatusChip } from "@/components/status-chip";
import { formatMoney, products } from "@/lib/mock-data";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Catálogo de productos — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Catálogo comercial de motos y vehículos de Vimarti: precios de venta, comisiones y estado de cada producto.",
      },
      { property: "og:title", content: "Catálogo de productos — Vimarti" },
      {
        property: "og:description",
        content: "Precios, comisiones y estado del catálogo comercial de Vimarti LLC.",
      },
    ],
  }),
  component: ProductosPage,
});

type Filter = "activos" | "inactivos" | "todos";
type Sort = "nombre" | "precio" | "comision";

function ProductosPage() {
  const [filter, setFilter] = useState<Filter>("activos");
  const [sort, setSort] = useState<Sort>("nombre");

  const rows = useMemo(() => {
    const filtered = products.filter((product) =>
      filter === "todos" ? true : filter === "activos" ? product.active : !product.active,
    );
    return [...filtered].sort((a, b) => {
      if (sort === "precio") return b.price - a.price;
      if (sort === "comision") return b.commission - a.commission;
      return a.name.localeCompare(b.name, "es");
    });
  }, [filter, sort]);

  return (
    <AppShell breadcrumb="Productos">
      <PageHeader
        eyebrow="Productos"
        title="Catálogo"
        description="Administrá el catálogo comercial de motos y vehículos de Vimarti."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Nuevo producto
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SegmentedFilter
          label="Estado del producto"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "activos", label: "Activos" },
            { value: "inactivos", label: "Inactivos" },
            { value: "todos", label: "Todos" },
          ]}
        />
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          Ordenar por
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-md border border-input bg-surface px-2.5 py-1.5 text-sm text-foreground outline-hidden focus:border-primary"
          >
            <option value="nombre">Nombre A-Z</option>
            <option value="precio">Precio mayor a menor</option>
            <option value="comision">Comisión mayor a menor</option>
          </select>
        </label>
      </div>

      <Panel padded={false}>
        <PanelHeader
          title="Productos"
          subtitle={`${rows.length} ${rows.length === 1 ? "producto" : "productos"} en la vista`}
        />
        {rows.length === 0 ? (
          <EmptyState
            icon={<Bike className="size-5" aria-hidden />}
            title="No hay productos en esta vista"
            description="Cambiá el filtro de estado o cargá un nuevo producto al catálogo."
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Producto</Th>
                  <Th>Especificación</Th>
                  <Th align="right">Precio de venta</Th>
                  <Th align="right">Comisión</Th>
                  <Th>Estado</Th>
                  <Th align="right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
                          <Bike className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{product.name}</span>
                          <span className="tabular block truncate text-xs text-muted-foreground">
                            #{product.code}
                          </span>
                        </span>
                      </div>
                    </Td>
                    <Td className="text-muted-foreground">{product.spec}</Td>
                    <Td align="right" className="font-medium">
                      {formatMoney(product.price)}
                    </Td>
                    <Td align="right" className="text-muted-foreground">
                      {formatMoney(product.commission)}
                    </Td>
                    <Td>
                      <StatusChip tone={product.active ? "success" : "neutral"}>
                        {product.active ? "Activo" : "Inactivo"}
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
            <TableFooterBar>
              <span>Página 1 de 1</span>
              <span className="flex items-center gap-2">
                Filas por página
                <select className="rounded-md border border-input bg-surface px-2 py-1 text-sm text-foreground outline-hidden focus:border-primary">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </span>
            </TableFooterBar>
          </>
        )}
      </Panel>
    </AppShell>
  );
}
