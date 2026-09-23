# Accounting, payroll and compliance workspace

The new workspace is available in mock mode. It is an interactive product demonstration, not a production accounting ledger or compliance determination service. The existing API-backed finance screen remains the destination in API mode.

## Workflows delivered

- Invoices: create and edit drafts, quantity/rate calculations in integer cents, tax treatment, evidence review, approval, filtering and CSV export. Approved/paid records are read-only.
- Receipts: exact-amount matching against a sample bank statement, atomic paid status and duplicate-match rejection.
- Supplier bills: creation, categories, due dates and receipt-gated approval. No payments are initiated.
- Payroll: six fictional employees, sample gross/PAYG/net/super/leave figures, exception review, gated pay-run approval and review CSV. These are not award, tax-table or leave-accrual calculations.
- Tax: source-linked review checklist and working totals. No BAS, income tax return, state payroll tax calculation or STP lodgement.
- Registry: official ABN Lookup links and manual review notes. No verified-status claims or background monitoring.
- Compliance: action register, owners, review dates, priorities, evidence references, completion gate, worker checks, incident/complaint follow-up and CSV export. Existing practice standards remain accessible in their own tab.
- Assistant: current-section context, curated source cards, deterministic guided responses and creation of compliance review tasks. This is explicitly labelled a preview, not a connected LLM.
- Activity: locally persisted action history, shared between accounting and compliance. This is not a tamper-proof audit log.

Demo operations are stored in `provider-operations-demo-v1` in browser local storage. This key is separate from login state. Do not enter real financial, participant or employee information in the demo. The headless browser checks use an isolated browser context.

## Official sources

Reference guidance checked 24 September 2026, with URLs and per-section relevance in `src/features/operations/guidance.ts`:

- ATO: NDIS GST treatment and Single Touch Payroll.
- Fair Work Ombudsman: SCHADS pay, allowances and pay tools.
- NDIA: pricing schedules and effective-date review.
- NDIS Commission: incident reporting categories and notification process.
- ABN Lookup: public registry and web-service access information.

Review dates on demo actions are internal scheduling dates, not statutory deadlines. Guidance cards are reference material, not a live change feed. Reading a source does not establish a provider's eligibility, compliance, registration or tax position.

## Production connections still required

1. Organisation-scoped API tables and permissions for invoice lines, credit notes, receipts, bills, payroll runs, evidence and action history. Use transactional state transitions, idempotency, immutable posted records and attributable audit entries. Do not expose browser-local demo records through live mode.
2. A chosen accounting/payroll provider for award interpretation, effective-dated rates, tax tables, super, payslips, STP and payment reconciliation. Production approval must not be confused with a provider submission receipt.
3. Registered ABN web-service access, a server-side adapter, dated raw results and field-level change detection. Worker screening and NDIS provider registration need their respective authorised access; ABN status is insufficient.
4. A scheduled official-source retrieval service with version history, publication/effective dates, change review, subscriptions and deduplicated notifications. The current app does not fetch government sources on a schedule.
5. A server-side AI provider connection with source retrieval, tenant/role checks, citations, privacy controls and human approval for mutations. Never put AI or registry credentials in Vite variables.
6. Secure document storage, malware scanning, retention policy and audit records before accepting real evidence uploads. Current evidence fields store references only.

## Verification

`npm test` covers monetary rounding, GST-free handling, sample gross pay, matching correctness, duplicate prevention and invalid transitions. `npm run build` checks TypeScript and the production bundle.

Browser validation covers invoice creation/approval, matching, payroll review gates, assistant-to-compliance tasks, evidence review, refresh persistence and 390px mobile layouts.
