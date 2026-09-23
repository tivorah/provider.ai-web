import type { Page } from "../types";

export const productionFeatures = {
  widgetBuilder: false,
  performanceGoals: false,
  sharedInbox: false,
  genericAnalytics: false,
  integrationMarketplace: false,
  standaloneIntelligence: false,
} as const;

const allMvpPages: Page[] = [
  "dashboard",
  "participants",
  "roster",
  "people",
  "recruitment",
  "compliance",
  "finance",
  "reports",
  "settings",
  "access",
];

const rolePages: Record<string, Page[]> = {
  owner: allMvpPages,
  administrator: allMvpPages,
  hr_manager: ["dashboard", "people", "recruitment", "compliance", "reports"],
  roster_coordinator: ["dashboard", "participants", "roster", "people", "reports"],
  compliance_manager: ["dashboard", "participants", "people", "compliance", "reports"],
  finance_officer: ["dashboard", "participants", "finance", "reports"],
  support_worker: ["dashboard", "participants", "roster"],
  auditor: ["dashboard", "participants", "people", "finance", "compliance", "reports"],
};

export function canAccessPage(role: string | undefined, page: Page) {
  if (!role) return false;
  return (rolePages[role] ?? ["dashboard"]).includes(page);
}
