export type Invoice = {
  id: string;
  participant: string;
  payer: string;
  service: string;
  date: string;
  due: string;
  quantity: number;
  rate: number;
  gst: boolean;
  evidence: boolean;
  status: "Draft" | "Approved" | "Paid";
  paid: number;
};
export type WorkerPay = {
  id: string;
  name: string;
  role: string;
  hours: number;
  rate: number;
  allowances: number;
  withholding: number;
  superAmount: number;
  leave: number;
  issue: string;
  reviewed: boolean;
};
export type Bill = {
  id: string;
  supplier: string;
  category: string;
  amount: number;
  due: string;
  receipt: boolean;
  approved: boolean;
};
export type ComplianceTask = {
  id: string;
  title: string;
  area: string;
  person: string;
  owner: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In review" | "Complete";
  evidence: string;
  note: string;
};
export type AuditEntry = { id: string; at: string; action: string };
export type OperationsState = {
  invoices: Invoice[];
  workers: WorkerPay[];
  bills: Bill[];
  tasks: ComplianceTask[];
  matches: Record<string, string>;
  payApproved: boolean;
  reviews: string[];
  audit: AuditEntry[];
};
export const money = (cents: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    cents / 100,
  );
export const subtotal = (invoice: Invoice) =>
  Math.round(invoice.quantity * invoice.rate);
export const tax = (invoice: Invoice) =>
  invoice.gst ? Math.round(subtotal(invoice) / 10) : 0;
export const total = (invoice: Invoice) => subtotal(invoice) + tax(invoice);
export const gross = (worker: WorkerPay) =>
  Math.round(worker.hours * worker.rate) + worker.allowances;
export const bankTransactions = [
  {
    id: "BNK-001",
    name: "Harbour Plan Management",
    reference: "INV-2041",
    amount: 56000,
    date: "2026-09-21",
  },
  {
    id: "BNK-002",
    name: "Grace Martin",
    reference: "INV-2042",
    amount: 84000,
    date: "2026-09-22",
  },
  {
    id: "BNK-003",
    name: "Plan partner remittance",
    reference: "Needs remittance",
    amount: 120000,
    date: "2026-09-23",
  },
];
export function seedOperations(): OperationsState {
  return {
    invoices: [
      {
        id: "INV-2041",
        participant: "Ethan Carter",
        payer: "Harbour Plan Management",
        service: "Community participation · demo rate",
        date: "2026-09-14",
        due: "2026-09-28",
        quantity: 8,
        rate: 7000,
        gst: false,
        evidence: true,
        status: "Approved",
        paid: 0,
      },
      {
        id: "INV-2042",
        participant: "Grace Martin",
        payer: "Self managed",
        service: "Daily living support · demo rate",
        date: "2026-09-15",
        due: "2026-09-29",
        quantity: 12,
        rate: 7000,
        gst: false,
        evidence: true,
        status: "Approved",
        paid: 0,
      },
      {
        id: "INV-2043",
        participant: "Lucas Brown",
        payer: "NDIA managed",
        service: "Personal care · demo rate",
        date: "2026-09-16",
        due: "2026-09-30",
        quantity: 16,
        rate: 6800,
        gst: false,
        evidence: false,
        status: "Draft",
        paid: 0,
      },
      {
        id: "INV-2044",
        participant: "Isla Wilson",
        payer: "Care Plan Partners",
        service: "Community access · demo rate",
        date: "2026-09-17",
        due: "2026-10-01",
        quantity: 10,
        rate: 7200,
        gst: false,
        evidence: true,
        status: "Draft",
        paid: 0,
      },
      {
        id: "INV-2045",
        participant: "Noah Harris",
        payer: "Self managed",
        service: "Private administration service",
        date: "2026-09-01",
        due: "2026-09-15",
        quantity: 2,
        rate: 10000,
        gst: true,
        evidence: true,
        status: "Approved",
        paid: 0,
      },
      {
        id: "INV-2046",
        participant: "Mia Thompson",
        payer: "Harbour Plan Management",
        service: "Daily living support · demo rate",
        date: "2026-09-02",
        due: "2026-09-16",
        quantity: 6,
        rate: 7000,
        gst: false,
        evidence: true,
        status: "Paid",
        paid: 42000,
      },
    ],
    workers: [
      {
        id: "EMP-01",
        name: "Ava Williams",
        role: "Support worker · SCHADS review",
        hours: 64,
        rate: 3800,
        allowances: 4200,
        withholding: 44000,
        superAmount: 29184,
        leave: 38,
        issue: "",
        reviewed: true,
      },
      {
        id: "EMP-02",
        name: "Jack Harris",
        role: "Support worker · casual",
        hours: 48,
        rate: 4600,
        allowances: 2800,
        withholding: 39000,
        superAmount: 26496,
        leave: 0,
        issue: "Review broken-shift allowance and casual classification",
        reviewed: false,
      },
      {
        id: "EMP-03",
        name: "Amelia Taylor",
        role: "Team leader · permanent",
        hours: 76,
        rate: 4200,
        allowances: 0,
        withholding: 63000,
        superAmount: 38304,
        leave: 72,
        issue: "",
        reviewed: true,
      },
      {
        id: "EMP-04",
        name: "Liam Smith",
        role: "Support worker · part time",
        hours: 52,
        rate: 3800,
        allowances: 5600,
        withholding: 31000,
        superAmount: 23712,
        leave: 24,
        issue: "Timesheet approval missing for one shift",
        reviewed: false,
      },
      {
        id: "EMP-05",
        name: "Zoe King",
        role: "Service coordinator",
        hours: 76,
        rate: 4500,
        allowances: 0,
        withholding: 72000,
        superAmount: 41040,
        leave: 56,
        issue: "",
        reviewed: true,
      },
      {
        id: "EMP-06",
        name: "Oliver Martin",
        role: "Support worker · casual",
        hours: 36,
        rate: 4600,
        allowances: 2100,
        withholding: 23000,
        superAmount: 19872,
        leave: 0,
        issue: "",
        reviewed: true,
      },
    ],
    bills: [
      {
        id: "BILL-101",
        supplier: "Care Supplies Co. (demo)",
        category: "Consumables",
        amount: 46200,
        due: "2026-09-30",
        receipt: true,
        approved: false,
      },
      {
        id: "BILL-102",
        supplier: "Community Fleet (demo)",
        category: "Vehicle expenses",
        amount: 128000,
        due: "2026-10-02",
        receipt: true,
        approved: false,
      },
      {
        id: "BILL-103",
        supplier: "Ava Williams",
        category: "Staff reimbursement",
        amount: 8400,
        due: "2026-09-28",
        receipt: false,
        approved: false,
      },
      {
        id: "BILL-104",
        supplier: "Workplace Learning (demo)",
        category: "Training",
        amount: 55000,
        due: "2026-10-04",
        receipt: true,
        approved: true,
      },
    ],
    tasks: [
      {
        id: "CMP-101",
        title: "Worker screening renewal",
        area: "Worker screening",
        person: "Liam Smith",
        owner: "Olivia Williams",
        due: "2026-09-28",
        priority: "High",
        status: "Open",
        evidence: "",
        note: "Request renewal evidence and verify through the appropriate worker screening process.",
      },
      {
        id: "CMP-102",
        title: "Review participant support agreement",
        area: "Participant safeguards",
        person: "Lucas Brown",
        owner: "Amelia Taylor",
        due: "2026-09-29",
        priority: "High",
        status: "Open",
        evidence: "",
        note: "Confirm signed agreement and current support plan before approving the related invoice.",
      },
      {
        id: "CMP-103",
        title: "Incident assessment and follow-up",
        area: "Incidents",
        person: "Ethan Carter",
        owner: "Olivia Williams",
        due: "2026-09-24",
        priority: "High",
        status: "In review",
        evidence: "Demo incident record INC-041",
        note: "Fictional scenario. Assess reportability and applicable notification timeframe using Commission guidance.",
      },
      {
        id: "CMP-104",
        title: "SCHADS classification review",
        area: "Workforce",
        person: "Jack Harris",
        owner: "Amelia Taylor",
        due: "2026-09-30",
        priority: "Medium",
        status: "Open",
        evidence: "",
        note: "Review duties, classification, employment type and applicable allowances.",
      },
      {
        id: "CMP-105",
        title: "Complaints register review",
        area: "Complaints",
        person: "Service team",
        owner: "Olivia Williams",
        due: "2026-10-02",
        priority: "Medium",
        status: "Open",
        evidence: "Demo complaints register v2",
        note: "Review actions, participant communication and resolution records.",
      },
      {
        id: "CMP-106",
        title: "Medication training evidence",
        area: "Training",
        person: "Ava Williams",
        owner: "Amelia Taylor",
        due: "2026-10-05",
        priority: "Low",
        status: "Complete",
        evidence: "Demo training certificate",
        note: "Evidence reviewed in this example.",
      },
    ],
    matches: {},
    payApproved: false,
    reviews: [],
    audit: [],
  };
}
export function reconcile(
  state: OperationsState,
  transactionId: string,
  invoiceId: string,
): OperationsState {
  const transaction = bankTransactions.find((row) => row.id === transactionId);
  const invoice = state.invoices.find((row) => row.id === invoiceId);
  if (
    !transaction ||
    !invoice ||
    state.matches[transactionId] ||
    invoice.status !== "Approved" ||
    total(invoice) - invoice.paid !== transaction.amount
  )
    throw new Error(
      "Select an approved invoice with an exact outstanding balance. Each bank entry can only be matched once.",
    );
  return {
    ...state,
    matches: { ...state.matches, [transactionId]: invoiceId },
    invoices: state.invoices.map((row) =>
      row.id === invoiceId ? { ...row, status: "Paid", paid: total(row) } : row,
    ),
  };
}
export function csvDownload(name: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          let text = String(value);
          if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
          return `"${text.replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
