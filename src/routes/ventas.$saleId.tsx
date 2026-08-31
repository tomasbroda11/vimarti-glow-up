import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Package, Truck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  Initials,
  PageHeader,
  Panel,
  PanelHeader,
  ProgressBar,
} from "@/components/primitives";
import { DeliveryChip, PaymentChip, StatusChip } from "@/components/status-chip";
import {
  customers,
  formatDate,
  formatDateTime,
  formatMoney,
  getSale,
  products,
} from "@/lib/mock-data";

export const Route = createFileRoute("/ventas/$saleId")({
  loader: ({ params }) => {
    const sale = getSale(params.saleId);
    if (!sale) throw notFound();
    return { sale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Venta no encontrada — Vimarti" }, { name: "robots", content: "noindex" }],
      };
    }
    const { sale } = loaderData;
    const title = `Venta #${sale.number} — ${sale.customerName} — Vimarti`;
    const description = `Detalle de la venta #${sale.number}: ${sale.productName}, ${formatMoney(sale.total)}, cobrado ${formatMoney(sale.collected)}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SaleDetailPage,
});

function SaleDetailPage() {
  const { sale } = Route.useLoaderData();
  const customer = customers.find((c) => c.id === sale.customerId);
  const product = products.find((p) => p.name === sale.productName);
  const balance = sale.total - sale.collected;
  const progress = (sale.collected / sale.total) * 100;

  const deliverySteps = [
    { label: "Pendiente", done: true },
    { label: "Enviada", done: sale.deliveryStatus !== "pendiente" },
    { label: "Entregada", done: sale.deliveryStatus === "entregada" },
  ];

  return (
    <AppShell breadcrumb={`Venta #${sale.number}`}>
      <Link
        to="/ventas"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a ventas
      </Link>

      <PageHeader
        eyebrow={`Venta #${sale.number}`}
        title={sale.customerName}
        description={`Confirmada el ${formatDateTime(sale.date)} · Vendedor ${sale.seller}`}
        action={
          <div className="flex flex-wrap gap-2">
            <PaymentChip status={sale.paymentStatus} />
            <DeliveryChip status={sale.deliveryStatus} />
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Panel>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Importe total</p>
                <p className="tabular mt-1 font-display text-2xl font-bold">
                  {formatMoney(sale.total)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cobrado</p>
                <p className="tabular mt-1 font-display text-2xl font-bold text-success">
                  {formatMoney(sale.collected)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className="tabular mt-1 font-display text-2xl font-bold text-warning">
                  {formatMoney(balance)}
                </p>
              </div>
            </div>
            <ProgressBar
              className="mt-5"
              value={progress}
              tone={progress >= 100 ? "success" : "warning"}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round(progress)}% del importe cobrado
            </p>
          </Panel>

          <Panel padded={false}>
            <PanelHeader title="Plan de cuotas" subtitle="Cobros registrados y vencimientos" />
            <ol className="divide-y divide-border">
              {sale.installments.map((installment) => (
                <li
                  key={installment.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
                >
                  <span
                    className={
                      installment.paid
                        ? "grid size-8 shrink-0 place-items-center rounded-full bg-success-soft text-success"
                        : "grid size-8 shrink-0 place-items-center rounded-full border border-dashed border-border-strong text-muted-foreground"
                    }
                    aria-hidden
                  >
                    {installment.paid ? <Check className="size-4" /> : <Package className="size-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{installment.label}</p>
                    <p className="tabular text-xs text-muted-foreground">
                      Vence {formatDate(installment.dueDate)}
                      {installment.method ? ` · ${installment.method}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-sm font-semibold">{formatMoney(installment.amount)}</p>
                    <StatusChip tone={installment.paid ? "success" : "neutral"} className="mt-1">
                      {installment.paid ? "Cobrada" : "Pendiente"}
                    </StatusChip>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel padded={false}>
            <PanelHeader title="Cliente" />
            <div className="px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <Initials name={sale.customerName} tone="brand" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{sale.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{customer?.email}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Teléfono</dt>
                  <dd className="tabular">{customer?.phone ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Ciudad</dt>
                  <dd>{customer?.city ?? "—"}</dd>
                </div>
              </dl>
            </div>
          </Panel>

          <Panel padded={false}>
            <PanelHeader title="Producto" />
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
                  <Package className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{sale.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {product ? `${product.spec} · #${product.code}` : "—"}
                  </p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Cantidad</dt>
                  <dd className="tabular">{sale.quantity}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Comisión vendedor</dt>
                  <dd className="tabular">{formatMoney(product?.commission ?? 0)}</dd>
                </div>
              </dl>
            </div>
          </Panel>

          <Panel padded={false}>
            <PanelHeader title="Entrega" />
            <ol className="px-5 py-4">
              {deliverySteps.map((step, index) => (
                <li key={step.label} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        step.done
                          ? "grid size-7 place-items-center rounded-full bg-foreground text-background"
                          : "grid size-7 place-items-center rounded-full border border-dashed border-border-strong text-muted-foreground"
                      }
                      aria-hidden
                    >
                      <Truck className="size-3.5" />
                    </span>
                    {index < deliverySteps.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-border" aria-hidden />
                    )}
                  </div>
                  <div className={index < deliverySteps.length - 1 ? "pb-4" : ""}>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.done ? "Completado" : "Pendiente"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
