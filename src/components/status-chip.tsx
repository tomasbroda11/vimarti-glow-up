import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "info" | "neutral" | "brand";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning border-warning/25",
  info: "bg-info-soft text-info border-info/25",
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-brand-soft text-primary border-primary/25",
};

export function StatusChip({
  children,
  tone = "neutral",
  dot = true,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

const paymentTone: Record<string, { tone: Tone; label: string }> = {
  pagada: { tone: "success", label: "Pagada" },
  parcial: { tone: "warning", label: "Pago parcial" },
  pendiente: { tone: "neutral", label: "Pendiente" },
};

const deliveryTone: Record<string, { tone: Tone; label: string }> = {
  pendiente: { tone: "neutral", label: "Pendiente" },
  enviada: { tone: "info", label: "Enviada" },
  entregada: { tone: "success", label: "Entregada" },
};

export function PaymentChip({ status }: { status: string }) {
  const cfg = paymentTone[status] ?? paymentTone.pendiente!;
  return <StatusChip tone={cfg.tone}>{cfg.label}</StatusChip>;
}

export function DeliveryChip({ status }: { status: string }) {
  const cfg = deliveryTone[status] ?? deliveryTone.pendiente!;
  return <StatusChip tone={cfg.tone}>{cfg.label}</StatusChip>;
}
