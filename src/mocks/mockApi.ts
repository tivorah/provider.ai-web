import type { Candidate, CandidateStage, DashboardData, FinanceSnapshot, Job, Principal, XeroConnection } from "../types";

const STORAGE_KEY = "provider-ai-mock-v1";
export const DEMO_CREDENTIALS = { email: "demo@provider.ai", password: "Provider123!" } as const;

interface MockEmployee { id: string; candidateId: string; firstName: string; lastName: string; email: string; jobTitle: string; status: "onboarding"; createdAt: string; }
interface MockState { session: boolean; principal: Principal; password: string; jobs: Job[]; candidates: Candidate[]; employees: MockEmployee[]; }

const demoPrincipal: Principal = { id: "10000000-0000-4000-8000-000000000001", email: DEMO_CREDENTIALS.email, firstName: "Olivia", lastName: "Williams", role: "owner", organisation: { id: "20000000-0000-4000-8000-000000000001", name: "Harbour Care", slug: "harbour-care" } };
const initialState = (): MockState => ({
  session: false,
  principal: demoPrincipal,
  password: DEMO_CREDENTIALS.password,
  jobs: [
    { id: "30000000-0000-4000-8000-000000000001", title: "Disability Support Worker", location: "Parramatta, NSW", employmentType: "casual", description: "Deliver person-centred community and daily living supports.", status: "open", channels: ["SEEK", "Indeed", "Provider careers page"], createdAt: "2026-07-25T01:00:00.000Z" },
    { id: "30000000-0000-4000-8000-000000000002", title: "Support Coordinator", location: "Sydney, NSW", employmentType: "full-time", description: "Help participants understand and implement their NDIS plans.", status: "open", channels: ["Indeed", "Provider careers page", "LinkedIn"], createdAt: "2026-07-28T01:00:00.000Z" },
    { id: "30000000-0000-4000-8000-000000000003", title: "Senior Support Worker", location: "Blacktown, NSW", employmentType: "part-time", description: "Lead shifts and support the development of our frontline team.", status: "draft", channels: [], createdAt: "2026-07-30T01:00:00.000Z" }
  ],
  candidates: [
    { id: "40000000-0000-4000-8000-000000000001", jobId: "30000000-0000-4000-8000-000000000001", firstName: "Mia", lastName: "Thompson", email: "mia.thompson@example.com", location: "Parramatta, NSW", stage: "interview", score: 94, source: "SEEK", createdAt: "2026-07-29T01:00:00.000Z" },
    { id: "40000000-0000-4000-8000-000000000002", jobId: "30000000-0000-4000-8000-000000000003", firstName: "Lachlan", lastName: "Reid", email: "lachlan.reid@example.com", location: "Blacktown, NSW", stage: "screening", score: 88, source: "referral", createdAt: "2026-07-30T01:00:00.000Z" },
    { id: "40000000-0000-4000-8000-000000000003", jobId: "30000000-0000-4000-8000-000000000001", firstName: "Amara", lastName: "Okafor", email: "amara.okafor@example.com", location: "Liverpool, NSW", stage: "offer", score: 91, source: "direct", createdAt: "2026-07-27T01:00:00.000Z" },
    { id: "40000000-0000-4000-8000-000000000004", jobId: "30000000-0000-4000-8000-000000000002", firstName: "Sophie", lastName: "Nguyen", email: "sophie.nguyen@example.com", location: "Sydney, NSW", stage: "applied", score: 82, source: "LinkedIn", createdAt: "2026-07-31T01:00:00.000Z" },
    { id: "40000000-0000-4000-8000-000000000005", jobId: "30000000-0000-4000-8000-000000000001", firstName: "Noah", lastName: "Wilson", email: "noah.wilson@example.com", location: "Penrith, NSW", stage: "applied", score: 79, source: "SEEK", createdAt: "2026-08-01T01:00:00.000Z" }
  ], employees: []
});

function read(): MockState {
  try { const stored = localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) as MockState : initialState(); }
  catch { return initialState(); }
}
function write(state: MockState) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
const delay = async <T>(value: T, milliseconds = 180) => new Promise<T>((resolve) => window.setTimeout(() => resolve(value), milliseconds));
const fail = (message: string) => Promise.reject(new Error(message));

const dashboard: DashboardData = {
  greeting: "Good morning, Olivia", summary: "Your services are running smoothly. Two items need your attention.",
  widgets: [
    { id: "today-shifts", title: "Today's shifts", value: "24", detail: "22 confirmed · 2 open", trend: "+8%", tone: "indigo" },
    { id: "team-ready", title: "Team ready", value: "96%", detail: "3 credentials need attention", trend: "+2.4%", tone: "mint" },
    { id: "claims", title: "Claims awaiting", value: "$18,420", detail: "12 ready to submit", tone: "amber" },
    { id: "incidents", title: "Open incidents", value: "2", detail: "No reporting deadlines at risk", tone: "rose" }
  ],
  roster: [
    { id: "shift-1", time: "8:00 am", participant: "Ethan Carter", worker: "Ava Williams", status: "In progress", colour: "#5ba8ff" },
    { id: "shift-2", time: "10:30 am", participant: "Grace Martin", worker: "Jack Harris", status: "Confirmed", colour: "#18a978" },
    { id: "shift-3", time: "1:00 pm", participant: "Lucas Brown", worker: "Open shift", status: "Needs worker", colour: "#ee964b" },
    { id: "shift-4", time: "3:30 pm", participant: "Isla Wilson", worker: "Amelia Taylor", status: "Confirmed", colour: "#18a978" }
  ],
  attention: [
    { id: "attention-1", title: "Credential expires in 7 days", detail: "Working With Children Check · Liam Smith", kind: "credential" },
    { id: "attention-2", title: "Two open shifts tomorrow", detail: "Community participation · Western Sydney", kind: "roster" }
  ]
};

export const mockApi = {
  async me() { const state = read(); return state.session ? delay(state.principal, 250) : fail("No mock session"); },
  async register(input: { organisationName: string; firstName: string; lastName: string; email: string; password: string }) { const state = initialState(); state.session = true; state.password = input.password; state.principal = { ...demoPrincipal, email: input.email, firstName: input.firstName, lastName: input.lastName, organisation: { ...demoPrincipal.organisation, name: input.organisationName } }; write(state); return delay(state.principal); },
  async login(input: { email: string; password: string }) { const isDemoLogin = input.email.toLowerCase() === DEMO_CREDENTIALS.email && input.password === DEMO_CREDENTIALS.password; const state = isDemoLogin ? initialState() : read(); if (!isDemoLogin && (input.email.toLowerCase() !== state.principal.email.toLowerCase() || input.password !== state.password)) return fail(`Use ${DEMO_CREDENTIALS.email} and ${DEMO_CREDENTIALS.password}`); state.session = true; write(state); return delay(state.principal); },
  async logout() { const state = read(); state.session = false; write(state); return delay(undefined); },
  async dashboard() { const state = read(); return delay({ ...dashboard, greeting: `Good morning, ${state.principal.firstName}` }); },
  async jobs() { return delay(read().jobs); },
  async createJob(input: Omit<Job, "id" | "createdAt">) { const state = read(); const job: Job = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }; state.jobs.unshift(job); write(state); return delay(job); },
  async updateJob(id: string, input: Omit<Job, "id" | "createdAt">) { const state = read(); const job = state.jobs.find((item) => item.id === id); if (!job) return fail("Job not found"); Object.assign(job, input); write(state); return delay(job); },
  async candidates() { return delay(read().candidates); },
  async createCandidate(input: Omit<Candidate, "id" | "stage" | "createdAt">) { const state = read(); const candidate: Candidate = { ...input, id: crypto.randomUUID(), stage: "applied", createdAt: new Date().toISOString() }; state.candidates.unshift(candidate); write(state); return delay(candidate); },
  async moveCandidate(id: string, stage: CandidateStage) { const state = read(); const candidate = state.candidates.find((item) => item.id === id); if (!candidate) return fail("Candidate not found"); candidate.stage = stage; write(state); return delay(candidate); },
  async convertCandidate(id: string) { const state = read(); const candidate = state.candidates.find((item) => item.id === id); if (!candidate) return fail("Candidate not found"); candidate.stage = "hired"; const job = state.jobs.find((item) => item.id === candidate.jobId); const employee: MockEmployee = { id: crypto.randomUUID(), candidateId: id, firstName: candidate.firstName, lastName: candidate.lastName, email: candidate.email, jobTitle: job?.title ?? "Support Worker", status: "onboarding", createdAt: new Date().toISOString() }; state.employees.push(employee); write(state); return delay({ candidate, employee }); },
  async xeroStatus(): Promise<XeroConnection> { return delay({ status: "disconnected", settings: {} }); },
  async xeroAuthorize() { return fail("Xero credentials must be configured on the API deployment before connecting.") as Promise<{ authorizeUrl: string }>; },
  async xeroSync(): Promise<XeroConnection> { return fail("Connect Xero before syncing."); },
  async xeroDisconnect() { return delay(undefined); }
  ,async finance(): Promise<FinanceSnapshot> { return delay({ invoices: [], payroll: [] }); }
};

export function resetMockData() { localStorage.removeItem(STORAGE_KEY); }
