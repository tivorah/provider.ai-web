import {
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  CircleDollarSign,
  ChartNoAxesCombined,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { CandidateStage, Page } from "../types";

export interface NavigationItem {
  id: Page;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const primaryNavigation: NavigationGroup[] = [
  { label: "Workspace", items: [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
  ] },
  { label: "Service delivery", items: [
    { id: "participants", label: "Participants", icon: UsersRound },
    { id: "roster", label: "Roster", icon: CalendarDays },
  ] },
  { label: "Workforce", items: [
    { id: "people", label: "Workforce", icon: Users },
    { id: "recruitment", label: "Recruitment", icon: BriefcaseBusiness },
  ] },
  { label: "Operations", items: [
    { id: "finance", label: "Finance", icon: CircleDollarSign },
    { id: "compliance", label: "Quality", icon: ShieldCheck },
    { id: "reports", label: "Reports", icon: ChartNoAxesCombined },
  ] },
  { label: "Administration", items: [
    { id: "settings", label: "Settings", icon: Settings },
  ] },
];

export const recruitmentStages: Array<{ id: CandidateStage; label: string; colour: string }> = [
  { id: "applied", label: "Applied", colour: "blue" },
  { id: "screening", label: "Screening", colour: "amber" },
  { id: "interview", label: "Interview", colour: "violet" },
  { id: "offer", label: "Offer", colour: "green" },
];

export interface AccessRoleContent {
  id: string;
  name: string;
  description: string;
  users: number;
  colour: string;
  home: string;
  system?: boolean;
}

export const accessRoles: AccessRoleContent[] = [
  { id: "admin", name: "Organisation administrator", description: "Full organisation configuration and data access.", users: 2, colour: "violet", home: "Overview", system: true },
  { id: "manager", name: "Service manager", description: "Participants, teams, rosters and service quality.", users: 5, colour: "blue", home: "Today’s roster" },
  { id: "coordinator", name: "Support coordinator", description: "Assigned participants, plans, goals and communications.", users: 4, colour: "mint", home: "Participants" },
  { id: "worker", name: "Support worker", description: "Own shifts, assigned participants and shift documentation.", users: 31, colour: "amber", home: "My roster", system: true },
  { id: "people", name: "People & compliance", description: "Employees, recruitment, credentials and audit evidence.", users: 3, colour: "rose", home: "People" },
  { id: "finance", name: "Finance officer", description: "Claims, invoices, payments and financial reporting.", users: 2, colour: "slate", home: "Finance & claims" },
];

export const accessModules = [
  "Overview", "Participants", "Roster", "Shared inbox", "People",
  "Recruitment", "Quality & compliance", "Finance & claims", "Analytics",
  "Integrations", "Role management",
];

export const defaultAccessPermissions: Record<string, string[]> = {
  admin: accessModules,
  manager: ["Overview", "Participants", "Roster", "Shared inbox", "People", "Quality & compliance", "Analytics"],
  coordinator: ["Overview", "Participants", "Shared inbox"],
  worker: ["Overview", "Participants", "Roster"],
  people: ["Overview", "People", "Recruitment", "Quality & compliance"],
  finance: ["Overview", "Participants", "Finance & claims", "Analytics", "Integrations"],
};

export const onboardingChecklist = [
  "Personal and emergency details",
  "Tax file declaration",
  "Bank and superannuation",
  "Employment contract and policies",
  "Worker screening and identity",
  "Qualifications and training",
];

export const employeeCredentialNames = [
  "NDIS Worker Screening Check",
  "Working With Children Check",
  "First Aid & CPR",
  "Driver licence",
  "NDIS Worker Orientation",
];

export const weekDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const employeeDocumentNames = [
  "Employment contract.pdf",
  "Position description.pdf",
  "Code of Conduct — acknowledged.pdf",
  "Super choice form.pdf",
];

export const launchpadReadinessDomains = [
  { name: "Business identity", score: 100, label: "Ready" },
  { name: "Registration scope", score: 72, label: "Needs review" },
  { name: "Governance", score: 46, label: "Action needed" },
  { name: "Workforce", score: 64, label: "In progress" },
  { name: "Service delivery", score: 58, label: "In progress" },
  { name: "Application & audit", score: 18, label: "Not started" },
];

export const launchpadBlockers = [
  { title: "Complete Practice Standards self-assessment", area: "Governance", status: "Due 12 Aug" },
  { title: "Upload business continuity plan", area: "Governance", status: "No owner" },
  { title: "Confirm registration group scope", area: "Registration", status: "Needs approval" },
];

export const launchpadEvidenceFilters = ["All evidence", "Approved", "In review", "Missing"];

export const launchpadTabs = [
  { id: "journey", label: "Setup journey", icon: ClipboardCheck },
  { id: "scope", label: "Registration scope", icon: ShieldCheck },
  { id: "evidence", label: "Evidence library", icon: FolderOpen },
  { id: "readiness", label: "Readiness report", icon: BookOpenCheck },
] as const;

export const emailWritingTones = ["Professional", "Warm", "Concise"];

export interface MailboxProviderContent {
  name: string;
  mark: string;
  colour: string;
}

export const mailboxProviders: MailboxProviderContent[] = [
  { name: "Google Workspace", mark: "G", colour: "#4285f4" },
  { name: "Microsoft 365 / Outlook", mark: "M", colour: "#1473e6" },
  { name: "Zoho Mail", mark: "Z", colour: "#e94b4b" },
  { name: "Other email (IMAP/SMTP)", mark: "@", colour: "#569ae8" },
];
