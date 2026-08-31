import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus, TrendingUp, Wallet } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Td, TableShell, Th, Tr } from "@/components/data-table";
import { PageHeader, Panel, PanelHeader, ProgressBar } from "@/components/primitives";
import { DeliveryChip, PaymentChip } from "@/components/status-chip";
import { formatDateTime, formatMoney, paymentMethods, sales, summary } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumen — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Actividad comercial de Vimarti: monto vendido, cobros por medio de pago y últimas operaciones confirmadas.",
      },
      { property: "og:title", content: "Resumen — Vimarti Business Manager" },
      {
        property: "og:description",
        content: "Panel de ventas, cobros y operaciones recientes de Vimarti LLC.",
      },
    ],
  }),
  component: ResumenPage,
});

function KpiCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Panel className="p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 truncate text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-brand-soft text-primary">
          {icon}
        </span>
      </div>
      <p className="tabular mt-3 font-display text-3xl font-bold">{value}</p>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-medium text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" aria-hidden />
          En vivo
        </span>
        {hint}
      </p>
    </Panel>
  );
}

function ResumenPage() {
  const totalCollected = paymentMethods.reduce((acc, method) => acc + method.amount, 0);

  return (
    <AppShell breadcrumb="Resumen">
      <PageHeader
        eyebrow="Resumen"
        title="Actividad comercial"
        description="Ventas, cobros y operaciones recientes de la empresa."
        action={
          <Link
            to="/ventas"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Nueva venta
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <KpiCard
          label="Monto vendido"
          value={formatMoney(summary.soldAmount)}
          hint="ventas confirmadas"
          icon={<TrendingUp className="size-4" aria-hidden />}
        />
        <KpiCard
          label="Monto cobrado"
          value={formatMoney(summary.collectedAmount)}
          hint="cobros registrados"
          icon={<Wallet className="size-4" aria-hidden />}
        />
        <KpiCard
          label="Ventas confirmadas"
          value={String(summary.confirmedSales)}
          hint="operaciones activas"
          icon={<ArrowUpRight className="size-4" aria-hidden />}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        <Panel padded={false}>
          <PanelHeader title="Cobros por medio de pago" subtitle="Cobros confirmados" />
          <div className="divide-y divide-border">
            {paymentMethods.map((method) => (
              <div key={method.id} className="px-5 py-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                  <p className="min-w-0 truncate text-sm font-medium">{method.label}</p>
                  <p className="tabular font-display text-sm font-semibold">
                    {formatMoney(method.amount)}
                  </p>
                </div>
                <ProgressBar
                  className="mt-2.5"
                  value={totalCollected ? (method.amount / totalCollected) * 100 : 0}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  {method.count} {method.count === 1 ? "cobro" : "cobros"} ·{" "}
                  {Math.round((method.amount / totalCollected) * 100)}% del total
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel padded={false}>
          <PanelHeader
            title="Ventas recientes"
            subtitle="Últimas operaciones confirmadas"
            action={
              <Link
                to="/ventas"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors duration-150 hover:text-primary/80"
              >
                Ver todas
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            }
          />
          <TableShell>
            <thead>
              <tr>
                <Th>Venta</Th>
                <Th>Fecha</Th>
                <Th align="right">Importe</Th>
                <Th>Pago</Th>
                <Th>Entrega</Th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <Tr key={sale.id}>
                  <Td className="font-display font-semibold">
                    <Link
                      to="/ventas/$saleId"
                      params={{ saleId: sale.id }}
                      className="transition-colors duration-150 hover:text-primary"
                    >
                      #{sale.number}
                    </Link>
                  </Td>
                  <Td className="whitespace-nowrap text-muted-foreground">
                    {formatDateTime(sale.date)}
                  </Td>
                  <Td align="right" className="font-medium">
                    {formatMoney(sale.total)}
                  </Td>
                  <Td>
                    <PaymentChip status={sale.paymentStatus} />
                  </Td>
                  <Td>
                    <DeliveryChip status={sale.deliveryStatus} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Panel>
      </div>
    </AppShell>
  );
}
