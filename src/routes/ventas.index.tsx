import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Receipt } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Td, TableShell, Th, Tr } from "@/components/data-table";
import {
  EmptyState,
  PageHeader,
  Panel,
  PanelHeader,
  ProgressBar,
} from "@/components/primitives";
import { DeliveryChip, PaymentChip } from "@/components/status-chip";
import { formatDate, formatMoney, sales } from "@/lib/mock-data";

export const Route = createFileRoute("/ventas/")({
  head: () => ({
    meta: [
      { title: "Órdenes de venta — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Confirmá ventas, registrá cuotas y seguí las entregas de Vimarti desde una única vista operativa.",
      },
      { property: "og:title", content: "Órdenes de venta — Vimarti" },
      {
        property: "og:description",
        content: "Ventas, cobros, saldos y estado de entrega de cada operación de Vimarti LLC.",
      },
    ],
  }),
  component: VentasPage,
});

function VentasPage() {
  const [payment, setPayment] = useState("todos");
  const [delivery, setDelivery] = useState("todos");
  const [order, setOrder] = useState("recientes");

  const rows = useMemo(() => {
    const filtered = sales.filter(
      (sale) =>
        (payment === "todos" || sale.paymentStatus === payment) &&
        (delivery === "todos" || sale.deliveryStatus === delivery),
    );
    return [...filtered].sort((a, b) => {
      if (order === "antiguas") return a.number - b.number;
      if (order === "mayor") return b.total - a.total;
      if (order === "menor") return a.total - b.total;
      return b.number - a.number;
    });
  }, [payment, delivery, order]);

  const selectClass =
    "rounded-md border border-input bg-surface px-2.5 py-1.5 text-sm text-foreground outline-hidden focus:border-primary";

  return (
    <AppShell breadcrumb="Ventas">
      <PageHeader
        eyebrow="Ventas"
        title="Órdenes de venta"
        description="Confirmá ventas, registrá cuotas y seguí las entregas desde una única vista operativa."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Nueva venta
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Pago
          <select value={payment} onChange={(e) => setPayment(e.target.value)} className={selectClass}>
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="parcial">Pago parcial</option>
            <option value="pagada">Pagada</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Entrega
          <select
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            className={selectClass}
          >
            <option value="todos">Todas</option>
            <option value="pendiente">Pendiente</option>
            <option value="enviada">Enviada</option>
            <option value="entregada">Entregada</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto">
          Ordenar
          <select value={order} onChange={(e) => setOrder(e.target.value)} className={selectClass}>
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
            <option value="mayor">Total mayor a menor</option>
            <option value="menor">Total menor a mayor</option>
          </select>
        </label>
      </div>

      <Panel padded={false}>
        <PanelHeader
          title="Operaciones"
          subtitle={`${rows.length} ${rows.length === 1 ? "operación visible" : "operaciones visibles"}`}
        />
        {rows.length === 0 ? (
          <EmptyState
            icon={<Receipt className="size-5" aria-hidden />}
            title="Ninguna venta coincide con los filtros"
            description="Ajustá los filtros de pago o entrega para ver más operaciones."
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Venta</Th>
                <Th>Cliente</Th>
                <Th>Producto</Th>
                <Th align="right">Importe</Th>
                <Th className="min-w-40">Cobro</Th>
                <Th>Pago</Th>
                <Th>Entrega</Th>
                <Th align="right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((sale) => {
                const progress = (sale.collected / sale.total) * 100;
                return (
                  <Tr key={sale.id}>
                    <Td>
                      <Link
                        to="/ventas/$saleId"
                        params={{ saleId: sale.id }}
                        className="block font-display font-semibold transition-colors duration-150 hover:text-primary"
                      >
                        #{sale.number}
                      </Link>
                      <span className="tabular block text-xs text-muted-foreground">
                        {formatDate(sale.date)}
                      </span>
                    </Td>
                    <Td>
                      <span className="block truncate font-medium">{sale.customerName}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Vendedor: {sale.seller}
                      </span>
                    </Td>
                    <Td className="text-muted-foreground whitespace-nowrap">
                      {sale.productName} × {sale.quantity}
                    </Td>
                    <Td align="right" className="font-medium">
                      {formatMoney(sale.total)}
                    </Td>
                    <Td>
                      <ProgressBar
                        value={progress}
                        tone={progress >= 100 ? "success" : "warning"}
                      />
                      <span className="tabular mt-1.5 block text-xs text-muted-foreground">
                        {formatMoney(sale.collected)} · saldo{" "}
                        {formatMoney(sale.total - sale.collected)}
                      </span>
                    </Td>
                    <Td>
                      <PaymentChip status={sale.paymentStatus} />
                    </Td>
                    <Td>
                      <DeliveryChip status={sale.deliveryStatus} />
                    </Td>
                    <Td align="right">
                      <Link
                        to="/ventas/$saleId"
                        params={{ saleId: sale.id }}
                        className="inline-flex rounded-md border border-border px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-accent"
                      >
                        Ver detalle
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </Panel>
    </AppShell>
  );
}
