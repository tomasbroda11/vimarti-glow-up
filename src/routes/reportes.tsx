import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  EmptyState,
  Initials,
  PageHeader,
  Panel,
  PanelHeader,
  ProgressBar,
} from "@/components/primitives";
import { StatusChip } from "@/components/status-chip";
import {
  deliveryFlow,
  formatMoney,
  sellerRanking,
  summary,
  topProducts,
} from "@/lib/mock-data";

export const Route = createFileRoute("/reportes")({
  head: () => ({
    meta: [
      { title: "Reportes de rendimiento — Vimarti Business Manager" },
      {
        name: "description",
        content:
          "Rendimiento semanal de Vimarti: cobros, flujo de entregas, productos más vendidos y ranking de vendedores.",
      },
      { property: "og:title", content: "Reportes de rendimiento — Vimarti" },
      {
        property: "og:description",
        content: "Cobros, entregas e incentivos de la semana de viernes a jueves en Vimarti LLC.",
      },
    ],
  }),
  component: ReportesPage,
});

function ReportesPage() {
  const totalDeliveries = deliveryFlow.reduce((acc, item) => acc + item.value, 0) || 1;
  const maxUnits = Math.max(...topProducts.map((product) => product.units), 1);

  const kpis = [
    { label: "Ventas", value: String(summary.confirmedSales) },
    { label: "Monto vendido", value: formatMoney(summary.soldAmount) },
    { label: "Monto cobrado", value: formatMoney(summary.collectedAmount) },
    { label: "Cuotas vencidas", value: String(summary.overdueInstallments) },
  ];

  const toneBar: Record<string, string> = {
    warning: "bg-warning",
    info: "bg-info",
    success: "bg-success",
  };

  return (
    <AppShell breadcrumb="Reportes">
      <PageHeader
        eyebrow="Reportes"
        title="Rendimiento de Vimarti"
        description="Cobros, entregas e incentivos para la semana de viernes a jueves."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Panel key={kpi.label}>
            <p className="truncate text-sm text-muted-foreground">{kpi.label}</p>
            <p className="tabular mt-2 font-display text-2xl font-bold">{kpi.value}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel padded={false}>
          <PanelHeader title="Flujo de entregas" subtitle="Estado de las operaciones confirmadas" />
          <div className="px-5 py-5">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-muted">
              {deliveryFlow.map((item) => (
                <div
                  key={item.label}
                  className={toneBar[item.tone]}
                  style={{ width: `${(item.value / totalDeliveries) * 100}%` }}
                  aria-hidden
                />
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-4">
              {deliveryFlow.map((item) => (
                <div key={item.label}>
                  <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`size-2 rounded-full ${toneBar[item.tone]}`} aria-hidden />
                    {item.label}
                  </dt>
                  <dd className="tabular mt-1 font-display text-xl font-bold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Panel>

        <Panel padded={false}>
          <PanelHeader title="Productos más vendidos" subtitle="Unidades vendidas en el mes" />
          <div className="space-y-4 px-5 py-5">
            {topProducts.map((product) => (
              <div key={product.name}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                  <p className="min-w-0 truncate text-sm font-medium">{product.name}</p>
                  <p className="tabular text-sm text-muted-foreground">{product.units} u.</p>
                </div>
                <ProgressBar className="mt-2" value={(product.units / maxUnits) * 100} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel padded={false}>
          <PanelHeader title="Ranking semanal de vendedores" subtitle="Progreso hacia el bono" />
          <ol className="divide-y divide-border">
            {sellerRanking.map((seller) => (
              <li key={seller.name} className="px-5 py-5">
                <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm font-bold text-background">
                    {seller.position}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{seller.name}</p>
                    <p className="tabular text-xs text-muted-foreground">
                      {seller.units} {seller.units === 1 ? "moto" : "motos"} · comisión{" "}
                      {formatMoney(seller.commission)}
                    </p>
                  </div>
                  <StatusChip tone="brand">Bono {formatMoney(seller.bonus)}</StatusChip>
                </div>
                <ProgressBar className="mt-4" value={(seller.units / seller.nextGoal) * 100} />
                <p className="mt-2 text-xs text-muted-foreground">
                  Próximo objetivo: {seller.nextGoal} ventas ({seller.nextGoal - seller.units}{" "}
                  restantes)
                </p>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel padded={false}>
          <PanelHeader title="Vendedor del mes" subtitle="Requiere 20 ventas confirmadas" />
          <EmptyState
            icon={<Trophy className="size-5" aria-hidden />}
            title="Todavía sin ganador"
            description="Ningún vendedor alcanzó las 20 ventas requeridas este mes."
          />
          <div className="border-t border-border px-5 py-4">
            <div className="flex items-center gap-3">
              <Initials name="tomas" tone="brand" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">tomas lidera con 1 venta</p>
                <p className="text-xs text-muted-foreground">19 ventas para el premio</p>
              </div>
            </div>
            <ProgressBar className="mt-3" value={(1 / 20) * 100} />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
