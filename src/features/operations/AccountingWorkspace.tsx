import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Download,
  Plus,
  Search,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { AssistantButton, ContextAssistant } from "./ContextAssistant";
import { useOperations, updateOperations } from "./store";
import {
  bankTransactions,
  csvDownload,
  gross,
  money,
  reconcile,
  subtotal,
  tax,
  total,
  type Invoice,
  type WorkerPay,
} from "./model";
import { Badge, cell, head, Modal, Panel, Stat } from "./Ui";
import { guidance, guidanceChecked } from "./guidance";

const tabs = [
  "Overview",
  "Invoices & claims",
  "Bills & expenses",
  "Payroll",
  "Bank matching",
  "Tax & obligations",
  "Registry checks",
  "Reports",
  "Activity",
] as const;
type Tab = (typeof tabs)[number];
export function AccountingWorkspace() {
  const state = useOperations();
  const [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [edit, setEdit] = useState<Invoice | "new" | null>(null);
  const [worker, setWorker] = useState<WorkerPay | null>(null);
  const [newBill, setNewBill] = useState(false);
  const [notice, setNotice] = useState("");
  const [abn, setAbn] = useState("");
  const [match, setMatch] = useState<Record<string, string>>({});
  const [registryNote, setRegistryNote] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const outstanding = state.invoices
    .filter((row) => row.status === "Approved")
    .reduce((sum, row) => sum + total(row) - row.paid, 0);
  const payroll = state.workers.reduce((sum, row) => sum + gross(row), 0);
  const taxWithheld = state.workers.reduce(
    (sum, row) => sum + row.withholding,
    0,
  );
  const superTotal = state.workers.reduce(
    (sum, row) => sum + row.superAmount,
    0,
  );
  const payrollIssues = state.workers.filter((row) => !row.reviewed);
  const invoices = state.invoices.filter(
    (row) =>
      `${row.id} ${row.participant} ${row.payer}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" ||
        (filter === "Overdue"
          ? row.status === "Approved" && row.due < today
          : row.status === filter)),
  );
  const act = (
    label: string,
    change: Parameters<typeof updateOperations>[1],
  ) => {
    try {
      updateOperations(label, change);
      setNotice(label);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to save. Please try again.",
      );
    }
  };
  const exportInvoices = () =>
    csvDownload("demo-invoices.csv", [
      [
        "Invoice",
        "Participant",
        "Payer",
        "Due",
        "Status",
        "Subtotal AUD",
        "GST AUD",
        "Total AUD",
        "Paid AUD",
      ],
      ...invoices.map((row) => [
        row.id,
        row.participant,
        row.payer,
        row.due,
        row.status,
        subtotal(row) / 100,
        tax(row) / 100,
        total(row) / 100,
        row.paid / 100,
      ]),
    ]);
  const exportPayroll = () =>
    csvDownload("demo-payroll-review.csv", [
      ["DEMO ONLY - Not a payment or STP file"],
      [
        "Employee",
        "Hours",
        "Gross AUD",
        "Sample PAYG AUD",
        "Net AUD",
        "Sample super AUD",
        "Review",
      ],
      ...state.workers.map((row) => [
        row.name,
        row.hours,
        gross(row) / 100,
        row.withholding / 100,
        (gross(row) - row.withholding) / 100,
        row.superAmount / 100,
        row.reviewed ? "Reviewed" : row.issue,
      ]),
    ]);
  return (
    <section className="page m-0 max-w-none space-y-6">
      <PageHeader
        category="Business operations"
        title="Accounting & payroll"
        description="From delivered care to reconciled income. Keep every review in view."
      >
        <AssistantButton section="finance" />
        <button className="primary-button" onClick={() => setEdit("new")}>
          <Plus size={16} />
          Create invoice
        </button>
      </PageHeader>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-xs text-brand-800">
        <span>
          Demo workspace · Fictional people and amounts · Changes saved in this
          browser
        </span>
        <span>Bank, payroll, ATO and registry connections: not connected</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Accounts receivable"
          value={money(outstanding)}
          detail={`${state.invoices.filter((row) => row.status === "Approved").length} approved invoices awaiting payment`}
        />
        <Stat
          label="Draft billing"
          value={money(
            state.invoices
              .filter((row) => row.status === "Draft")
              .reduce((sum, row) => sum + total(row), 0),
          )}
          detail="Review evidence before approval"
        />
        <Stat
          label="Sample gross payroll"
          value={money(payroll)}
          detail={`${state.workers.length} people · ${payrollIssues.length} reviews pending`}
        />
        <Stat
          label="Supplier bills"
          value={money(state.bills.reduce((sum, row) => sum + row.amount, 0))}
          detail={`${state.bills.filter((row) => !row.approved).length} awaiting approval`}
        />
      </div>
      <nav className="workspace-tabs" aria-label="Accounting sections">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-current={tab === item ? "page" : undefined}
            onClick={() => {
              setTab(item);
              setNotice("");
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      {notice && (
        <div
          role="status"
          className="rounded-xl border border-brand-200 bg-white p-4 text-sm"
        >
          {notice}
        </div>
      )}

      {tab === "Overview" && (
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Panel
              title="Your finance review queue"
              description="Resolve the source record before moving money."
            >
              {[
                {
                  title: "Billing ready for review",
                  copy: `${state.invoices.filter((row) => row.status === "Draft").length} drafts · check agreements and delivered supports`,
                  target: "Invoices & claims" as Tab,
                },
                {
                  title: "Payroll exceptions",
                  copy: `${payrollIssues.length} worker reviews · timesheets and award checks`,
                  target: "Payroll" as Tab,
                },
                {
                  title: "Unmatched bank entries",
                  copy: `${bankTransactions.length - Object.keys(state.matches).length} sample transactions · review remittances`,
                  target: "Bank matching" as Tab,
                },
                {
                  title: "Tax preparation",
                  copy: "Review tax codes, PAYG and reporting connections",
                  target: "Tax & obligations" as Tab,
                },
              ].map((item) => (
                <button
                  key={item.title}
                  className="flex w-full items-center justify-between gap-4 border-b border-line px-5 py-5 text-left last:border-0 hover:bg-canvas"
                  onClick={() => setTab(item.target)}
                >
                  <span>
                    <strong className="text-sm font-medium">
                      {item.title}
                    </strong>
                    <span className="mt-2 block text-xs text-muted">
                      {item.copy}
                    </span>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </Panel>
            <Panel
              title="Cash position in this demo"
              description="Based on the displayed invoices and supplier bills."
            >
              <div className="grid gap-5 p-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted">
                    Recorded invoice receipts
                  </p>
                  <p className="mt-3 text-xl">
                    {money(
                      state.invoices.reduce((sum, row) => sum + row.paid, 0),
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted">
                    Invoice balance outstanding
                  </p>
                  <p className="mt-3 text-xl">{money(outstanding)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Approved supplier bills</p>
                  <p className="mt-3 text-xl">
                    {money(
                      state.bills
                        .filter((row) => row.approved)
                        .reduce((sum, row) => sum + row.amount, 0),
                    )}
                  </p>
                </div>
              </div>
            </Panel>
          </div>
          <Panel
            title="Provider briefing"
            description="Official sources, relevant to this section."
          >
            <div className="p-5">
              <ContextAssistant section="finance" />
            </div>
          </Panel>
        </div>
      )}

      {tab === "Invoices & claims" && (
        <Panel
          title="Invoices & claim preparation"
          description="Approval prepares a demo invoice. No invoice is emailed and no NDIS claim is submitted."
          action={
            <button className="secondary-button" onClick={exportInvoices}>
              <Download size={15} />
              Export
            </button>
          }
        >
          <div className="flex flex-wrap gap-3 p-5">
            <label className="flex min-w-0 flex-1 items-center gap-2">
              <Search size={17} />
              <input
                className="workspace-field"
                aria-label="Search invoices"
                placeholder="Search participant, payer or invoice…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <select
              className="workspace-field w-auto"
              aria-label="Invoice status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {["All", "Draft", "Approved", "Paid", "Overdue"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="bg-canvas">
                <tr>
                  {[
                    "Invoice / participant",
                    "Payer",
                    "Due",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((item) => (
                    <th className={head} key={item}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className={cell}>
                      <button
                        className="text-left hover:text-brand-700"
                        onClick={() => setEdit(row)}
                      >
                        <span className="block font-medium">
                          {row.participant}
                        </span>
                        <span className="mt-1 block text-xs text-muted">
                          {row.id}
                        </span>
                      </button>
                    </td>
                    <td className={cell}>{row.payer}</td>
                    <td className={cell}>
                      {row.due}
                      {row.status === "Approved" && row.due < today && (
                        <span className="mt-1 block text-xs text-warning">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className={cell}>
                      {money(total(row))}
                      <span className="mt-1 block text-xs text-muted">
                        {row.gst
                          ? "Includes GST"
                          : "GST-free · review conditions"}
                      </span>
                    </td>
                    <td className={cell}>
                      <Badge warn={!row.evidence}>
                        {!row.evidence ? "Evidence missing" : row.status}
                      </Badge>
                    </td>
                    <td className={cell}>
                      {row.status === "Draft" ? (
                        <button
                          disabled={!row.evidence}
                          className="secondary-button disabled:opacity-40"
                          onClick={() =>
                            act(`Approved ${row.id} (demo)`, (current) => ({
                              ...current,
                              invoices: current.invoices.map((item) =>
                                item.id === row.id
                                  ? { ...item, status: "Approved" }
                                  : item,
                              ),
                            }))
                          }
                        >
                          Approve
                        </button>
                      ) : row.status === "Approved" ? (
                        <button
                          className="secondary-button"
                          onClick={() => setTab("Bank matching")}
                        >
                          Match receipt
                        </button>
                      ) : (
                        <CheckCircle2 size={18} className="text-positive" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!invoices.length && (
              <p className="p-8 text-center text-sm text-muted">
                No invoices match these filters.
              </p>
            )}
          </div>
        </Panel>
      )}

      {tab === "Bills & expenses" && (
        <Panel
          title="Supplier bills & reimbursements"
          description="Receipt evidence is required before approval. Payment connections are not enabled."
          action={
            <button
              className="secondary-button"
              onClick={() => setNewBill(true)}
            >
              <Plus size={15} />
              Add bill
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-canvas">
                <tr>
                  {["Supplier", "Category", "Due", "Total", "Review"].map(
                    (item) => (
                      <th key={item} className={head}>
                        {item}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {state.bills.map((row) => (
                  <tr key={row.id} className="border-t border-line">
                    <td className={cell}>
                      {row.supplier}
                      <span className="mt-1 block text-xs text-muted">
                        {row.id}
                      </span>
                    </td>
                    <td className={cell}>{row.category}</td>
                    <td className={cell}>{row.due}</td>
                    <td className={cell}>{money(row.amount)}</td>
                    <td className={cell}>
                      {row.approved ? (
                        <Badge>Approved · unpaid</Badge>
                      ) : (
                        <button
                          disabled={!row.receipt}
                          className="secondary-button disabled:opacity-50"
                          onClick={() =>
                            act(`Approved bill ${row.id}`, (current) => ({
                              ...current,
                              bills: current.bills.map((item) =>
                                item.id === row.id
                                  ? { ...item, approved: true }
                                  : item,
                              ),
                            }))
                          }
                        >
                          {row.receipt ? "Approve bill" : "Receipt missing"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "Payroll" && (
        <div className="space-y-5">
          <Panel
            title="Fortnightly pay run · 14–27 September 2026"
            description="Sample amounts only. Award interpretation, PAYG, super and leave must be calculated by your connected payroll provider."
            action={
              <button className="secondary-button" onClick={exportPayroll}>
                <Download size={15} />
                Export review
              </button>
            }
          >
            <div className="grid gap-4 border-b border-line p-5 sm:grid-cols-4">
              {[
                ["Gross", payroll],
                ["Sample PAYG", taxWithheld],
                ["Net pay", payroll - taxWithheld],
                ["Sample super", superTotal],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-2 text-xl">{money(Number(value))}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-canvas">
                  <tr>
                    {[
                      "Employee",
                      "Hours",
                      "Gross",
                      "Net",
                      "Sample super",
                      "Review",
                    ].map((item) => (
                      <th key={item} className={head}>
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.workers.map((row) => (
                    <tr key={row.id} className="border-t border-line">
                      <td className={cell}>
                        <button
                          className="flex items-center gap-3 text-left"
                          onClick={() => setWorker(row)}
                        >
                          <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-xs text-brand-800">
                            {row.name
                              .split(" ")
                              .map((name) => name[0])
                              .join("")}
                          </span>
                          <span>
                            {row.name}
                            <span className="mt-1 block text-xs text-muted">
                              {row.role}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className={cell}>{row.hours}</td>
                      <td className={cell}>{money(gross(row))}</td>
                      <td className={cell}>
                        {money(gross(row) - row.withholding)}
                      </td>
                      <td className={cell}>{money(row.superAmount)}</td>
                      <td className={cell}>
                        <button onClick={() => setWorker(row)}>
                          <Badge warn={!row.reviewed}>
                            {row.reviewed ? "Reviewed" : "Needs review"}
                          </Badge>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line p-5">
              <p className="text-xs text-muted">
                {payrollIssues.length
                  ? `${payrollIssues.length} reviews block approval.`
                  : "All sample worker records reviewed."}{" "}
                STP: not connected · No payments sent.
              </p>
              <button
                className="primary-button"
                disabled={payrollIssues.length > 0 || state.payApproved}
                onClick={() =>
                  act(
                    "Approved demo payroll review — no payment or lodgement",
                    (current) => ({ ...current, payApproved: true }),
                  )
                }
              >
                {state.payApproved ? "Demo run approved" : "Approve demo run"}
              </button>
            </footer>
          </Panel>
          <Panel
            title="Payroll readiness"
            description="Keep these checks with each pay run."
          >
            <div className="grid gap-4 p-5 md:grid-cols-3">
              {[
                "Timesheets, breaks, overtime and allowances",
                "Classification, leave and employee details",
                "STP submission and super payment receipt",
              ].map((text) => (
                <div key={text} className="rounded-xl border border-line p-4">
                  <Wallet className="mb-3 text-brand-700" size={20} />
                  <p className="text-sm leading-6">{text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "Bank matching" && (
        <Panel
          title="Bank reconciliation"
          description="Sample bank statement. Match approved invoices by exact outstanding amount; unmatched entries stay open."
        >
          <div className="divide-y divide-line">
            {bankTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="text-sm font-medium">{transaction.name}</p>
                  <p className="mt-1 text-xs text-muted">
                    {transaction.date} · {transaction.reference}
                  </p>
                </div>
                <strong className="text-sm">{money(transaction.amount)}</strong>
                {state.matches[transaction.id] ? (
                  <Badge>Matched to {state.matches[transaction.id]}</Badge>
                ) : (
                  <div className="flex max-w-full flex-wrap gap-2">
                    <select
                      aria-label={`Invoice for ${transaction.id}`}
                      className="workspace-field w-auto max-w-full"
                      value={match[transaction.id] || ""}
                      onChange={(event) =>
                        setMatch({
                          ...match,
                          [transaction.id]: event.target.value,
                        })
                      }
                    >
                      <option value="">Select matching invoice</option>
                      {state.invoices
                        .filter(
                          (row) =>
                            row.status === "Approved" &&
                            total(row) - row.paid === transaction.amount,
                        )
                        .map((row) => (
                          <option key={row.id} value={row.id}>
                            {row.id} · {row.participant}
                          </option>
                        ))}
                    </select>
                    <button
                      className="secondary-button"
                      disabled={!match[transaction.id]}
                      onClick={() =>
                        act(
                          `Matched ${transaction.id} to ${match[transaction.id]}`,
                          (current) =>
                            reconcile(
                              current,
                              transaction.id,
                              match[transaction.id],
                            ),
                        )
                      }
                    >
                      Match
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {tab === "Tax & obligations" && (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Panel
            title="Tax review workbench"
            description="Working figures, not a BAS calculation or tax return. Timing and eligibility need accountant review."
          >
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Stat
                label="GST on approved / paid sales"
                value={money(
                  state.invoices
                    .filter((row) => row.status !== "Draft")
                    .reduce((sum, row) => sum + tax(row), 0),
                )}
                detail="GST-coded invoices in this demo"
              />
              <Stat
                label="Sample payroll withholding"
                value={money(taxWithheld)}
                detail="Illustrative amounts, not tax-table calculations"
              />
            </div>
            <div className="divide-y divide-line">
              {[
                "GST-free NDIS evidence reviewed",
                "Supplier tax invoices and GST credits reviewed",
                "PAYG and STP reconciliation reviewed",
                "Super obligations and payment timing reviewed",
                "BAS period, accounting basis and due date confirmed",
                "State payroll tax applicability reviewed",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 p-5 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={state.reviews.includes(item)}
                    onChange={(event) =>
                      act(
                        `${event.target.checked ? "Completed" : "Reopened"}: ${item}`,
                        (current) => ({
                          ...current,
                          reviews: current.reviews.includes(item)
                            ? current.reviews.filter((value) => value !== item)
                            : [...current.reviews, item],
                        }),
                      )
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          </Panel>
          <Panel
            title="Official guidance"
            description={`Curated reference · checked ${guidanceChecked}`}
          >
            <div className="space-y-5 p-5">
              {guidance
                .filter((item) => ["gst", "stp", "schads"].includes(item.id))
                .map((item) => (
                  <div key={item.id}>
                    <p className="text-xs text-brand-700">{item.agency}</p>
                    <h3 className="mt-2 text-sm font-medium">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted">
                      {item.summary}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex min-h-10 items-center gap-1 text-xs text-brand-800 underline"
                    >
                      Read official guidance
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "Registry checks" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Business identity checks"
            description="Open the official ABN registry. No automated verification is connected."
          >
            <form
              className="space-y-4 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                const value = abn.replace(/\s/g, "");
                if (!/^\d{11}$/.test(value)) {
                  setNotice("Enter an 11-digit ABN.");
                  return;
                }
                window.open(
                  `https://abr.business.gov.au/ABN/View?abn=${value}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              <label className="grid gap-2 text-sm">
                Australian Business Number
                <input
                  className="workspace-field"
                  value={abn}
                  inputMode="numeric"
                  onChange={(event) => setAbn(event.target.value)}
                  placeholder="Enter an ABN"
                  required
                />
              </label>
              <button className="primary-button">
                Open ABN Lookup
                <ArrowUpRight size={16} />
              </button>
              <label className="grid gap-2 text-sm">
                Record your manual review
                <textarea
                  className="workspace-field min-h-24 py-3"
                  value={registryNote}
                  onChange={(event) => setRegistryNote(event.target.value)}
                  placeholder="Entity, source, date and what you verified…"
                />
              </label>
              <button
                type="button"
                disabled={!registryNote.trim()}
                className="secondary-button"
                onClick={() => {
                  act(
                    `Manual registry review — ${abn || "entity not specified"}: ${registryNote}`,
                    (current) => current,
                  );
                  setRegistryNote("");
                }}
              >
                Save review to activity
              </button>
            </form>
          </Panel>
          <Panel
            title="Connection status"
            description="Government and business sources are separate connections."
          >
            <div className="divide-y divide-line">
              {[
                [
                  "ABN Lookup",
                  "Legal entity, ABN and public registration information",
                  "https://abr.business.gov.au/Tools",
                ],
                [
                  "NDIS Commission",
                  "Provider registration and regulatory information",
                  "https://www.ndiscommission.gov.au/",
                ],
                [
                  "Fair Work Ombudsman",
                  "Award and employment guidance",
                  "https://www.fairwork.gov.au/",
                ],
                [
                  "ATO",
                  "Tax, payroll reporting and super guidance",
                  "https://www.ato.gov.au/",
                ],
              ].map(([name, description, url]) => (
                <div key={name} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium">{name}</h3>
                    <Badge warn>Not connected</Badge>
                  </div>
                  <p className="my-2 text-xs leading-6 text-muted">
                    {description}
                  </p>
                  <a
                    className="text-xs text-brand-800 underline"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open official source
                  </a>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "Reports" && (
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Receivables ledger",
              description: "Invoice totals, status, tax and receipts.",
              action: exportInvoices,
            },
            {
              title: "Payroll review pack",
              description: "People, hours, sample deductions and exceptions.",
              action: exportPayroll,
            },
            {
              title: "Activity export",
              description: "Local actions and timestamps for review.",
              action: () =>
                csvDownload("demo-finance-activity.csv", [
                  ["Time", "Action"],
                  ...state.audit.map((row) => [row.at, row.action]),
                ]),
            },
          ].map((report) => (
            <Panel
              key={report.title}
              title={report.title}
              description={report.description}
            >
              <div className="p-5">
                <button className="secondary-button" onClick={report.action}>
                  <Download size={15} />
                  Download CSV
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
      {tab === "Activity" && (
        <Panel
          title="Activity log"
          description="Local demo history. This is not an immutable production audit trail."
        >
          {state.audit.length ? (
            <ol className="divide-y divide-line">
              {state.audit.map((row) => (
                <li key={row.id} className="p-5">
                  <p className="text-sm">{row.action}</p>
                  <time className="mt-2 block text-xs text-muted">
                    {new Date(row.at).toLocaleString("en-AU")}
                  </time>
                </li>
              ))}
            </ol>
          ) : (
            <p className="p-8 text-sm text-muted">
              Create an invoice or review a record to see its activity here.
            </p>
          )}
        </Panel>
      )}

      {edit && (
        <InvoiceEditor
          invoice={edit === "new" ? undefined : edit}
          onClose={() => setEdit(null)}
          onSave={(invoice) => {
            act(
              `${edit === "new" ? "Created" : "Updated"} ${invoice.id}`,
              (current) => ({
                ...current,
                invoices:
                  edit === "new"
                    ? [...current.invoices, invoice]
                    : current.invoices.map((row) =>
                        row.id === invoice.id ? invoice : row,
                      ),
              }),
            );
            setEdit(null);
          }}
        />
      )}
      {worker && (
        <Modal
          title={`${worker.name} · payroll review`}
          onClose={() => setWorker(null)}
        >
          <div className="space-y-5">
            <Badge>Sample payslip preview · not issued</Badge>
            <p className="text-sm text-muted">{worker.role}</p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Ordinary hours", worker.hours],
                ["Illustrative hourly rate", money(worker.rate)],
                ["Allowances", money(worker.allowances)],
                ["Gross pay", money(gross(worker))],
                ["Sample PAYG", money(worker.withholding)],
                ["Net pay", money(gross(worker) - worker.withholding)],
                ["Sample super", money(worker.superAmount)],
                ["Sample leave balance", `${worker.leave} hours`],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-muted">{label}</dt>
                  <dd className="mt-1">{value}</dd>
                </div>
              ))}
            </dl>
            {worker.issue && (
              <p className="rounded-xl bg-warning/10 p-4 text-sm leading-6 text-warning">
                {worker.issue}
              </p>
            )}
            <p className="text-xs leading-6 text-muted">
              Demo review only. No tax-table or award calculation is performed.
              Finalise payroll in your connected provider before paying workers.
            </p>
            <button
              className="primary-button"
              disabled={worker.reviewed}
              onClick={() => {
                act(
                  `Reviewed payroll exception for ${worker.name}`,
                  (current) => ({
                    ...current,
                    payApproved: false,
                    workers: current.workers.map((row) =>
                      row.id === worker.id ? { ...row, reviewed: true } : row,
                    ),
                  }),
                );
                setWorker(null);
              }}
            >
              {worker.reviewed
                ? "Already reviewed"
                : "Mark demo review complete"}
            </button>
          </div>
        </Modal>
      )}
      {newBill && (
        <Modal title="Add supplier bill" onClose={() => setNewBill(false)}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              act("Added supplier bill", (current) => ({
                ...current,
                bills: [
                  ...current.bills,
                  {
                    id: `BILL-${crypto.randomUUID().slice(0, 8)}`,
                    supplier: String(data.get("supplier")).trim(),
                    category: String(data.get("category")),
                    amount: Math.round(Number(data.get("amount")) * 100),
                    due: String(data.get("due")),
                    receipt: data.get("receipt") === "on",
                    approved: false,
                  },
                ],
              }));
              setNewBill(false);
            }}
          >
            <label className="grid gap-2 text-sm">
              Supplier
              <input
                name="supplier"
                className="workspace-field"
                required
                maxLength={120}
              />
            </label>
            <label className="grid gap-2 text-sm">
              Category
              <select name="category" className="workspace-field">
                {[
                  "Consumables",
                  "Vehicle expenses",
                  "Training",
                  "Software",
                  "Staff reimbursement",
                  "Other",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Amount including tax (AUD)
              <input
                name="amount"
                type="number"
                min="0.01"
                max="1000000"
                step="0.01"
                required
                className="workspace-field"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Due date
              <input
                type="date"
                name="due"
                required
                className="workspace-field"
              />
            </label>
            <label className="flex gap-2 text-sm">
              <input type="checkbox" name="receipt" />
              Receipt reviewed (demo)
            </label>
            <button className="primary-button">Save bill</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function InvoiceEditor({
  invoice,
  onClose,
  onSave,
}: {
  invoice?: Invoice;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}) {
  const [quantity, setQuantity] = useState(invoice?.quantity ?? 1);
  const [rate, setRate] = useState((invoice?.rate ?? 7000) / 100);
  const [gst, setGst] = useState(invoice?.gst ?? false);
  const locked = !!invoice && invoice.status !== "Draft";
  const amount = Math.round(quantity * Math.round(rate * 100));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked) return;
    const data = new FormData(event.currentTarget);
    onSave({
      id: invoice?.id ?? `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      participant: String(data.get("participant")).trim(),
      payer: String(data.get("payer")).trim(),
      service: String(data.get("service")).trim(),
      date: String(data.get("date")),
      due: String(data.get("due")),
      quantity,
      rate: Math.round(rate * 100),
      gst,
      evidence: data.get("evidence") === "on",
      status: "Draft",
      paid: 0,
    });
  };
  return (
    <Modal
      title={invoice ? `${invoice.id} · ${invoice.status}` : "Create invoice"}
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={submit}>
        <fieldset disabled={locked} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Participant
              <input
                name="participant"
                required
                maxLength={100}
                className="workspace-field"
                defaultValue={invoice?.participant}
                placeholder="Participant name"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Payer
              <input
                name="payer"
                required
                maxLength={120}
                className="workspace-field"
                defaultValue={invoice?.payer}
                placeholder="Plan manager or self managed"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Support / service description
            <input
              name="service"
              required
              maxLength={200}
              className="workspace-field"
              defaultValue={invoice?.service}
              placeholder="Delivered support and service reference"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Service date
              <input
                name="date"
                type="date"
                required
                defaultValue={
                  invoice?.date ?? new Date().toISOString().slice(0, 10)
                }
                className="workspace-field"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Due date
              <input
                name="due"
                type="date"
                required
                defaultValue={invoice?.due}
                className="workspace-field"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Quantity
              <input
                type="number"
                min="0.01"
                max="10000"
                step="0.01"
                required
                className="workspace-field"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
            <label className="grid gap-2 text-sm">
              Unit rate (AUD)
              <input
                type="number"
                min="0.01"
                max="100000"
                step="0.01"
                required
                className="workspace-field"
                value={rate}
                onChange={(event) => setRate(Number(event.target.value))}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Tax treatment
            <select
              value={gst ? "gst" : "free"}
              onChange={(event) => setGst(event.target.value === "gst")}
              className="workspace-field"
            >
              <option value="free">GST-free — verify eligibility</option>
              <option value="gst">GST 10%</option>
            </select>
          </label>
          <label className="flex items-start gap-2 text-sm leading-6">
            <input
              type="checkbox"
              name="evidence"
              className="mt-1.5"
              defaultChecked={invoice?.evidence}
            />
            Service agreement, delivery evidence, price and tax treatment
            reviewed (demo)
          </label>
        </fieldset>
        <div className="flex flex-wrap justify-between gap-3 rounded-xl bg-canvas p-4 text-sm">
          <span>Subtotal {money(amount)}</span>
          <span>GST {money(gst ? Math.round(amount / 10) : 0)}</span>
          <strong>
            Total {money(amount + (gst ? Math.round(amount / 10) : 0))}
          </strong>
        </div>
        <p className="text-xs leading-5 text-muted">
          Rates are illustrative, not an NDIS price lookup. Approved and paid
          invoices are locked. No email, payment or claim submission occurs.
        </p>
        <div className="flex justify-end gap-3">
          <button type="button" className="secondary-button" onClick={onClose}>
            Close
          </button>
          {!locked && <button className="primary-button">Save draft</button>}
        </div>
      </form>
    </Modal>
  );
}
