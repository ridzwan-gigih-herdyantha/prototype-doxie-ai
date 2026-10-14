export type OrderStatus =
  | "pending"
  | "approved"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "paid" | "unpaid" | "partial" | "refunded";

export type Priority = "low" | "normal" | "high";

export interface Order {
  id: string;
  customer: string;
  customerRef: string;
  email: string;
  date: string; // ISO
  items: number;
  warehouse: string;
  salesRep: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  priority: Priority;
  amount: number;
  currency: "EUR" | "USD" | "GBP";
  status: OrderStatus;
  tags: string[];
  notes?: string;
  lines: {
    sku: string;
    name: string;
    qty: number;
    unit: number;
  }[];
}

export const ORDERS: Order[] = [
  {
    id: "ORD-10231",
    customer: "Nordkap Industries AS",
    customerRef: "CUST-0481",
    email: "accounts@nordkap.no",
    date: "2026-10-12",
    items: 12,
    warehouse: "Oslo-1",
    salesRep: "M. Berg",
    paymentMethod: "Invoice (NET30)",
    paymentStatus: "unpaid",
    priority: "high",
    amount: 2340.0,
    currency: "EUR",
    status: "pending",
    tags: ["wholesale", "repeat"],
    notes: "Customer requested delivery before Friday.",
    lines: [
      { sku: "BR-220", name: "Industrial bearing 220mm", qty: 6, unit: 180 },
      { sku: "LB-05", name: "Lubricant pack 5L", qty: 4, unit: 65 },
      { sku: "SV-FLG", name: "Service flange kit", qty: 2, unit: 500 },
    ],
  },
  {
    id: "ORD-10230",
    customer: "Harbour & Finch Ltd.",
    customerRef: "CUST-0122",
    email: "orders@harbourfinch.co.uk",
    date: "2026-10-12",
    items: 3,
    warehouse: "Rotterdam-2",
    salesRep: "A. Dubois",
    paymentMethod: "Card",
    paymentStatus: "paid",
    priority: "normal",
    amount: 489.5,
    currency: "GBP",
    status: "pending",
    tags: ["retail"],
    lines: [
      { sku: "LT-R2", name: "Lantern rope 20m", qty: 3, unit: 163.17 },
    ],
  },
  {
    id: "ORD-10229",
    customer: "Fjord Marine Supply",
    customerRef: "CUST-0317",
    email: "procurement@fjordmarine.com",
    date: "2026-10-11",
    items: 24,
    warehouse: "Bergen-1",
    salesRep: "S. Ødegaard",
    paymentMethod: "Invoice (NET60)",
    paymentStatus: "partial",
    priority: "high",
    amount: 14820.0,
    currency: "EUR",
    status: "approved",
    tags: ["key-account", "marine"],
    lines: [
      { sku: "RP-100", name: "Mooring rope 100m", qty: 10, unit: 980 },
      { sku: "CL-55", name: "Cleat 55mm", qty: 14, unit: 358.57 },
    ],
  },
  {
    id: "ORD-10228",
    customer: "Alpine Mech GmbH",
    customerRef: "CUST-0244",
    email: "einkauf@alpinemech.de",
    date: "2026-10-11",
    items: 7,
    warehouse: "Munich-3",
    salesRep: "T. Hofer",
    paymentMethod: "SEPA",
    paymentStatus: "paid",
    priority: "normal",
    amount: 1875.0,
    currency: "EUR",
    status: "approved",
    tags: ["machinery"],
    lines: [
      { sku: "GR-77", name: "Gearbox GR-77", qty: 1, unit: 1200 },
      { sku: "BLT-M12", name: "Bolt M12 pack", qty: 6, unit: 112.5 },
    ],
  },
  {
    id: "ORD-10227",
    customer: "Lundgren Textiles",
    customerRef: "CUST-0509",
    email: "ap@lundgren.se",
    date: "2026-10-10",
    items: 18,
    warehouse: "Oslo-1",
    salesRep: "M. Berg",
    paymentMethod: "Invoice (NET30)",
    paymentStatus: "paid",
    priority: "low",
    amount: 3240.75,
    currency: "EUR",
    status: "shipped",
    tags: ["textile"],
    lines: [
      { sku: "FB-W", name: "Fabric wool roll", qty: 18, unit: 180 },
    ],
  },
  {
    id: "ORD-10226",
    customer: "Dockside Bakery Co.",
    customerRef: "CUST-0188",
    email: "owner@docksidebakery.ie",
    date: "2026-10-10",
    items: 2,
    warehouse: "Dublin-1",
    salesRep: "C. Walsh",
    paymentMethod: "Card",
    paymentStatus: "paid",
    priority: "normal",
    amount: 142.0,
    currency: "EUR",
    status: "delivered",
    tags: ["retail", "food"],
    lines: [
      { sku: "FL-50", name: "Flour sack 50kg", qty: 2, unit: 71 },
    ],
  },
  {
    id: "ORD-10225",
    customer: "Nordkap Industries AS",
    customerRef: "CUST-0481",
    email: "accounts@nordkap.no",
    date: "2026-10-09",
    items: 5,
    warehouse: "Oslo-1",
    salesRep: "M. Berg",
    paymentMethod: "Invoice (NET30)",
    paymentStatus: "paid",
    priority: "normal",
    amount: 1120.0,
    currency: "EUR",
    status: "delivered",
    tags: ["wholesale", "repeat"],
    lines: [
      { sku: "BR-180", name: "Industrial bearing 180mm", qty: 5, unit: 224 },
    ],
  },
  {
    id: "ORD-10224",
    customer: "Meridian Robotics",
    customerRef: "CUST-0601",
    email: "orders@meridianrobotics.com",
    date: "2026-10-09",
    items: 1,
    warehouse: "Munich-3",
    salesRep: "T. Hofer",
    paymentMethod: "Wire",
    paymentStatus: "refunded",
    priority: "high",
    amount: 8900.0,
    currency: "EUR",
    status: "returned",
    tags: ["key-account", "machinery"],
    notes: "Returned — SKU mismatch on delivery.",
    lines: [
      { sku: "ARM-6X", name: "Robotic arm 6-axis", qty: 1, unit: 8900 },
    ],
  },
  {
    id: "ORD-10223",
    customer: "Harbour & Finch Ltd.",
    customerRef: "CUST-0122",
    email: "orders@harbourfinch.co.uk",
    date: "2026-10-08",
    items: 4,
    warehouse: "Rotterdam-2",
    salesRep: "A. Dubois",
    paymentMethod: "Card",
    paymentStatus: "unpaid",
    priority: "low",
    amount: 220.0,
    currency: "GBP",
    status: "cancelled",
    tags: ["retail"],
    notes: "Customer cancelled — out of season.",
    lines: [
      { sku: "LT-R1", name: "Lantern rope 10m", qty: 4, unit: 55 },
    ],
  },
  {
    id: "ORD-10222",
    customer: "Fjord Marine Supply",
    customerRef: "CUST-0317",
    email: "procurement@fjordmarine.com",
    date: "2026-10-08",
    items: 9,
    warehouse: "Bergen-1",
    salesRep: "S. Ødegaard",
    paymentMethod: "Invoice (NET60)",
    paymentStatus: "paid",
    priority: "normal",
    amount: 5410.0,
    currency: "EUR",
    status: "shipped",
    tags: ["key-account", "marine"],
    lines: [
      { sku: "RP-50", name: "Mooring rope 50m", qty: 5, unit: 540 },
      { sku: "CL-80", name: "Cleat 80mm", qty: 4, unit: 677.5 },
    ],
  },
  {
    id: "ORD-10221",
    customer: "Dockside Bakery Co.",
    customerRef: "CUST-0188",
    email: "owner@docksidebakery.ie",
    date: "2026-10-07",
    items: 6,
    warehouse: "Dublin-1",
    salesRep: "C. Walsh",
    paymentMethod: "Card",
    paymentStatus: "paid",
    priority: "normal",
    amount: 332.0,
    currency: "EUR",
    status: "pending",
    tags: ["retail", "food"],
    lines: [
      { sku: "FL-25", name: "Flour sack 25kg", qty: 6, unit: 55.33 },
    ],
  },
  {
    id: "ORD-10220",
    customer: "Alpine Mech GmbH",
    customerRef: "CUST-0244",
    email: "einkauf@alpinemech.de",
    date: "2026-10-07",
    items: 15,
    warehouse: "Munich-3",
    salesRep: "T. Hofer",
    paymentMethod: "SEPA",
    paymentStatus: "paid",
    priority: "low",
    amount: 4580.0,
    currency: "EUR",
    status: "delivered",
    tags: ["machinery"],
    lines: [
      { sku: "BLT-M8", name: "Bolt M8 pack", qty: 15, unit: 305.33 },
    ],
  },
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const STATUS_COUNT = ORDERS.reduce((acc, o) => {
  acc[o.status] = (acc[o.status] ?? 0) + 1;
  return acc;
}, {} as Record<OrderStatus, number>);
