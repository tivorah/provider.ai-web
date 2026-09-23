import type { Candidate, CandidateStage, DashboardData, FinanceSnapshot, Job, Principal, XeroConnection } from "./types";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string[]>) { super(message); }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, credentials: "include", headers: { "content-type": "application/json", ...options?.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: { code: "REQUEST_FAILED", message: `Request failed with status ${response.status}` } }));
    throw new ApiError(response.status, body.error?.code ?? "REQUEST_FAILED", body.error?.message ?? "Something went wrong", body.error?.fields);
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
}

export const liveApi = {
  me: () => request<{ data: Principal }>("/v1/auth/me").then((result) => result.data),
  register: (input: { organisationName: string; firstName: string; lastName: string; email: string; password: string }) => request<{ data: Principal }>("/v1/auth/register", { method: "POST", body: JSON.stringify(input) }).then((result) => result.data),
  login: (input: { email: string; password: string }) => request<{ data: Principal }>("/v1/auth/login", { method: "POST", body: JSON.stringify(input) }).then((result) => result.data),
  logout: () => request<void>("/v1/auth/logout", { method: "POST" }),
  dashboard: () => request<{ data: DashboardData }>("/v1/dashboard").then((result) => result.data),
  jobs: () => request<{ data: Job[] }>("/v1/jobs").then((result) => result.data),
  createJob: (input: { title: string; location: string; employmentType: string; description: string; status: "draft" | "open"; channels?: string[] }) => request<{ data: Job }>("/v1/jobs", { method: "POST", body: JSON.stringify(input) }).then((result) => result.data),
  updateJob: (id: string, input: { title: string; location: string; employmentType: string; description: string; status: Job["status"]; channels?: string[] }) => request<{ data: Job }>(`/v1/jobs/${id}`, { method: "PATCH", body: JSON.stringify(input) }).then((result) => result.data),
  candidates: () => request<{ data: Candidate[] }>("/v1/candidates").then((result) => result.data),
  createCandidate: (input: { jobId?: string; firstName: string; lastName: string; email: string; phone?: string; location: string; score: number; source: string; notes?: string }) => request<{ data: Candidate }>("/v1/candidates", { method: "POST", body: JSON.stringify(input) }).then((result) => result.data),
  moveCandidate: (id: string, stage: CandidateStage) => request<{ data: Candidate }>(`/v1/candidates/${id}/stage`, { method: "PATCH", body: JSON.stringify({ stage }) }).then((result) => result.data),
  convertCandidate: (id: string) => request<{ data: unknown }>(`/v1/candidates/${id}/convert`, { method: "POST" }).then((result) => result.data)
  ,xeroStatus: () => request<{ data: XeroConnection }>("/v1/integrations/xero/status").then((result) => result.data),
  xeroAuthorize: () => request<{ data: { authorizeUrl: string } }>("/v1/integrations/xero/authorize", { method: "POST" }).then((result) => result.data),
  xeroSync: () => request<{ data: XeroConnection }>("/v1/integrations/xero/sync", { method: "POST" }).then((result) => result.data),
  xeroDisconnect: () => request<void>("/v1/integrations/xero", { method: "DELETE" })
  ,finance: () => request<{ data: FinanceSnapshot }>("/v1/finance").then((result) => result.data)
};
