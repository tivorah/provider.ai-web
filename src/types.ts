export type Page =
  | "dashboard"
  | "participants"
  | "roster"
  | "people"
  | "recruitment"
  | "compliance"
  | "finance"
  | "reports"
  | "settings"
  // Prototype-only destinations remain typed while their code is retired. They
  // are deliberately absent from production navigation and command search.
  | "goals"
  | "analytics"
  | "inbox"
  | "integrations"
  | "access";
export type CandidateStage = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected" | "withdrawn";

export interface Principal { id: string; email: string; firstName: string; lastName: string; role: string; organisation: { id: string; name: string; slug: string }; }
export interface Job { id: string; title: string; location: string; employmentType: string; description: string; status: "draft" | "open" | "paused" | "closed"; createdAt: string; channels?: string[]; }

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobId?: string;
  phone?: string;
  location: string;
  stage: CandidateStage;
  score: number;
  source: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardData {
  greeting: string;
  summary: string;
  widgets: Array<{ id: string; title: string; value: string; detail: string; trend?: string; tone: string }>;
  roster: Array<{ id: string; time: string; participant: string; worker: string; status: string; colour: string }>;
  attention: Array<{ id: string; title: string; detail: string; kind: string }>;
}
export interface XeroConnection { status: "connected" | "disconnected" | "error"; organisationName?: string; lastSyncAt?: string; lastSyncStatus?: string; lastError?: string; settings: Record<string, boolean>; }
export interface FinanceSnapshot { invoices: Array<{ id: string; participant: string; payer: string; period: string; amount: number; status: string; items: number }>; payroll: Array<{ id: string; employee: string; classification: string; ordinaryHours: number; overtimeHours: number; penaltyHours: number; allowances: number; grossPay: number; tax: number; superannuation: number; deductions: number; netPay: number; leaveHours: number; status: string }>; payPeriod?: { id: string; periodStart: string; periodEnd: string; paymentDate: string; status: string }; }
