export type PaymentStatus = "pagada" | "parcial" | "pendiente";
export type DeliveryStatus = "pendiente" | "enviada" | "entregada";

export type Product = {
  id: string;
  name: string;
  code: string;
  spec: string;
  price: number;
  commission: number;
  active: boolean;
  image?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  salesCount: number;
};

export type Installment = {
  id: string;
  label: string;
  dueDate: string;
  amount: number;
  paid: boolean;
  method?: string;
};

export type Sale = {
  id: string;
  number: number;
  date: string;
  customerId: string;
  customerName: string;
  seller: string;
  productName: string;
  quantity: number;
  total: number;
  collected: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  installments: Installment[];
};

export const company = {
  name: "Vimarti LLC",
  suite: "Business Manager",
  initials: "VI",
};

export const currentUser = {
  name: "tomas",
  email: "tomas@gmail.com",
  role: "Administrador",
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Moto 1",
    code: "001111",
    spec: "125CC",
    price: 4000,
    commission: 400,
    active: true,
  },
  {
    id: "p2",
    name: "test",
    code: "123",
    spec: "test",
    price: 1000,
    commission: 100,
    active: true,
  },
];

export const customers: Customer[] = [
  {
    id: "c1",
    name: "Mario Lopez",
    email: "mario@lopez.com",
    phone: "232414221224",
    city: "Córdoba",
    salesCount: 2,
  },
  {
    id: "c2",
    name: "Martin Gimenez",
    email: "mgim@gmail.com",
    phone: "34235325252",
    city: "Rosario",
    salesCount: 1,
  },
];

export const sales: Sale[] = [
  {
    id: "3",
    number: 3,
    date: "2026-08-31T05:04:06",
    customerId: "c2",
    customerName: "Martin Gimenez",
    seller: "tomas",
    productName: "Moto 1",
    quantity: 1,
    total: 4000,
    collected: 2000,
    paymentStatus: "parcial",
    deliveryStatus: "enviada",
    installments: [
      { id: "i1", label: "Anticipo", dueDate: "2026-08-31", amount: 2000, paid: true, method: "Efectivo" },
      { id: "i2", label: "Cuota 1 de 1", dueDate: "2026-09-30", amount: 2000, paid: false },
    ],
  },
  {
    id: "2",
    number: 2,
    date: "2026-08-25T09:43:05",
    customerId: "c1",
    customerName: "Mario Lopez",
    seller: "admin",
    productName: "Moto 1",
    quantity: 1,
    total: 4000,
    collected: 1000,
    paymentStatus: "parcial",
    deliveryStatus: "enviada",
    installments: [
      { id: "i3", label: "Anticipo", dueDate: "2026-08-25", amount: 1000, paid: true, method: "Vía financiera" },
      { id: "i4", label: "Cuota 1 de 3", dueDate: "2026-09-25", amount: 1000, paid: false },
      { id: "i5", label: "Cuota 2 de 3", dueDate: "2026-10-25", amount: 1000, paid: false },
      { id: "i6", label: "Cuota 3 de 3", dueDate: "2026-11-25", amount: 1000, paid: false },
    ],
  },
  {
    id: "1",
    number: 1,
    date: "2026-08-24T03:01:51",
    customerId: "c1",
    customerName: "Mario Lopez",
    seller: "admin",
    productName: "test",
    quantity: 1,
    total: 600,
    collected: 600,
    paymentStatus: "pagada",
    deliveryStatus: "pendiente",
    installments: [
      { id: "i7", label: "Pago único", dueDate: "2026-08-24", amount: 600, paid: true, method: "Efectivo" },
    ],
  },
];

export const paymentMethods = [
  { id: "m1", label: "Efectivo", amount: 2600, count: 2 },
  { id: "m2", label: "Vía financiera", amount: 1000, count: 1 },
];

export const summary = {
  soldAmount: 8600,
  confirmedSales: 3,
  collectedAmount: 3600,
  overdueInstallments: 0,
};

export const deliveryFlow = [
  { label: "Pendientes", value: 1, tone: "warning" as const },
  { label: "Enviadas", value: 2, tone: "info" as const },
  { label: "Entregadas", value: 0, tone: "success" as const },
];

export const topProducts = [
  { name: "Moto 1", units: 2 },
  { name: "test", units: 1 },
];

export const sellerRanking = [
  { position: 1, name: "tomas", units: 1, bonus: 0, commission: 400, nextGoal: 5 },
];

export const users = [
  {
    id: "u1",
    name: "admin",
    email: "admin@brocosolutions.com",
    role: "Administrador",
    active: true,
  },
  {
    id: "u2",
    name: "tomas",
    email: "tomas@gmail.com",
    role: "Administrador",
    active: true,
  },
];

export const roles = [
  { id: "r1", name: "Administrador", users: 2, permissions: "Acceso total a ventas, catálogo y configuración" },
  { id: "r2", name: "Vendedor", users: 0, permissions: "Crear ventas y clientes, ver su propio ranking" },
  { id: "r3", name: "Depósito", users: 0, permissions: "Gestionar entregas y stock" },
];

export const integrations = [
  { id: "g1", name: "WhatsApp Business", detail: "Avisos de cuotas y entregas", connected: true },
  { id: "g2", name: "Facturación electrónica", detail: "Emisión automática de comprobantes", connected: false },
  { id: "g3", name: "Pasarela de cobros", detail: "Links de pago para cuotas", connected: false },
];

export const suppliers = [
  { id: "s1", name: "Motos del Litoral SA", contact: "compras@litoral.com", products: 12 },
  { id: "s2", name: "Repuestos Andina", contact: "ventas@andina.com", products: 4 },
];

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function formatMoney(value: number) {
  return currency.format(value).replace("US$", "US$ ").replace(/\s+/, " ");
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(value),
  );
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function getSale(id: string) {
  return sales.find((sale) => sale.id === id);
}
