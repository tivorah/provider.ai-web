import { PageHeader } from "../../components/PageHeader";
import { ArrowDownRight, ArrowRight, Banknote, Check, CircleDollarSign, Clock3, Download, Gauge, Info, ReceiptText, RefreshCcw, WalletCards, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { financeRevenueTrend as revenue } from "../../mocks/finance";
import { formatMoney as money } from "../../utils/formatters";
import { FinanceKpi } from "../shared/components/ModuleUi";

export function FinancePage() {
  const finance = useQuery({ queryKey: ["finance"], queryFn: api.finance });
  const claims = (finance.data?.invoices ?? []).map((invoice) => ({ ...invoice, status: invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }));
  const payroll = finance.data?.payroll ?? [];
  const [financeView, setFinanceView] = useState("Claims & invoices");
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [payrollApproved, setPayrollApproved] = useState(false);
  const [claimFilter, setClaimFilter] = useState("All");
  const [selectedClaim, setSelectedClaim] = useState<(typeof claims)[number] | null>(null);
  const filteredClaims = claims.filter((claim) => claimFilter === "All" || (claimFilter === "Exceptions" ? claim.status === "Exception" : claim.status === "Ready"));
  const exportPayerMix = () => {
    const url = URL.createObjectURL(new Blob(["Payer,Share\nNDIA managed,54%\nPlan managed,31%\nSelf managed,15%"], { type: "text/csv" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "payer-mix.csv"; anchor.click(); URL.revokeObjectURL(url);
  };
  const downloadCsv = (name: string, rows: string) => { const url = URL.createObjectURL(new Blob([rows], { type: "text/csv;charset=utf-8" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); };
  return (
    <section className="page finance-page m-0 min-h-[calc(100vh-73px)] w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px] leading-normal">
      <PageHeader category="Business operations" title="Finance" description="Review timesheets, invoices, claims and payroll preparation."><button className="primary-button min-h-11" onClick={() => setFinanceView("Customer billing")}><ReceiptText className="size-4" />Create invoice</button></PageHeader>
      <div className="summary-grid">
        <FinanceKpi
          icon={<Banknote />}
          label="Revenue this month"
          value="$184,260"
          trend="12.4%"
          positive
        />
        <FinanceKpi
          icon={<ReceiptText />}
          label="Ready to claim"
          value="$18,420"
          detail="12 approved claims"
        />
        <FinanceKpi
          icon={<Clock3 />}
          label="Accounts receivable"
          value="$32,840"
          detail="8.2 average days"
        />
        <FinanceKpi
          icon={<Gauge />}
          label="Gross margin"
          value="34.8%"
          trend="2.1%"
          positive
        />
      </div>
      <div className="workspace-tabs">
        {["Claims & invoices", "Customer billing", "Payroll & payslips", "Reconciliation", "Expenses"].map(
          (item) => (
            <button
              className={financeView === item ? "active" : ""}
              onClick={() => setFinanceView(item)}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {financeView === "Customer billing" && (
        <article className="billing-workspace [margin-bottom:16px] [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden]">
          <div className="billing-summary [padding:18px] [display:grid] [grid-template-columns:42px_1fr_auto_auto] [gap:13px] [align-items:center] [border-bottom:1px_solid_var(--border)] [&>span]:[width:42px] [&>span]:[height:42px] [&>span]:[border-radius:11px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:#386590] [&>span]:[background:#f0f5fa] [&_h2]:[margin:0] [&_p]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin-top:4px] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&>strong]:[font:700_19px_var(--font-sans)] max-[760px]:[grid-template-columns:42px_1fr] max-[760px]:[&>strong]:[grid-column:2] max-[760px]:[&>button]:[grid-column:2] [&_p]:[font-size:13px] [&_h2]:[font-size:18px]">
            <span>
              <ReceiptText />
            </span>
            <div>
              <h2>August customer billing run</h2>
              <p>
                Validated delivered shifts are grouped by participant, payer and
                service agreement.
              </p>
            </div>
            <strong>$18,420.00</strong>
            <button
              className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
              onClick={() => setInvoiceCreated(true)}
            >
              {invoiceCreated ? (
                <>
                  <Check />
                  Invoice generated
                </>
              ) : (
                <>Generate 12 invoices</>
              )}
            </button>
          </div>
          <div className="billing-lines [&_.data-row]:[grid-template-columns:1.2fr_1fr_.8fr_.7fr_.65fr] [&_.data-row]:[padding-inline:18px] max-[760px]:[overflow-x:auto] max-[760px]:[&_.data-row]:[min-width:720px] [font-size:13px]">
            <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] data-head [min-height:37px] [background:#f7f7f4] [color:#72756d] [text-transform:uppercase] [letter-spacing:.5px] [font-size:11px] [font-weight:700] [font-size:14px]">
              <span>Customer</span>
              <span>Billable supports</span>
              <span>Payer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {claims.slice(0, 4).map((claim) => (
              <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={claim.id}>
                <span>
                  <strong>{claim.participant}</strong>
                  <small>August monthly cycle</small>
                </span>
                <span>{claim.items} approved line items</span>
                <span>{claim.payer}</span>
                <strong>
                  $
                  {claim.amount.toLocaleString("en-AU", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
                <span
                  className={`claim-status [padding:4px_6px] [border-radius:6px] [font-size:11px] [font-weight:700] [&.ready]:[color:#5089cb] [&.ready]:[background:#f0f5fa] [&.submitted]:[color:#3578b3] [&.submitted]:[background:#f0f5fa] [&.paid]:[color:#25805f] [&.paid]:[background:#e8f7f1] [&.exception]:[color:#b54c61] [&.exception]:[background:#ffe9ed] [font-size:12px] ${invoiceCreated ? "submitted" : "ready"}`}
                >
                  {invoiceCreated ? "Generated" : "Ready"}
                </span>
              </div>
            ))}
          </div>
        </article>
      )}
      {financeView === "Payroll & payslips" && (
        <article className="billing-workspace [margin-bottom:16px] [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden]">
          <div className="billing-summary [padding:18px] [display:grid] [grid-template-columns:42px_1fr_auto_auto] [gap:13px] [align-items:center] [border-bottom:1px_solid_var(--border)] [&>span]:[width:42px] [&>span]:[height:42px] [&>span]:[border-radius:11px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:#386590] [&>span]:[background:#f0f5fa] [&_h2]:[margin:0] [&_p]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin-top:4px] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&>strong]:[font:700_19px_var(--font-sans)] max-[760px]:[grid-template-columns:42px_1fr] max-[760px]:[&>strong]:[grid-column:2] max-[760px]:[&>button]:[grid-column:2] [&_p]:[font-size:13px] [&_h2]:[font-size:18px]">
            <span>
              <Banknote />
            </span>
            <div>
              <h2>Fortnightly payroll</h2>
              <p>
                Calculation from approved roster hours and employee classifications.
              </p>
            </div>
            <strong>$18,936.24</strong>
            <button
              className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
              onClick={() => setPayrollApproved(true)}
            >
              {payrollApproved ? (
                <>
                  <Check />
                  Approved
                </>
              ) : (
                <>Approve pay run</>
              )}
            </button>
          </div>
          <div className="payroll-warning [padding:12px] [border-radius:10px] [display:flex] [gap:9px] [align-items:flex-start] [color:#86601f] [background:#fff5e7] [font-size:11px] [line-height:1.5] [&_svg]:[width:17px] [&_svg]:[flex:none] [margin:14px_18px] [font-size:12.5px]">
            <Info />
            <span>
              Provider.ai validates approved time, classifications, sleepovers, broken shifts,
              allowances and exceptions. Final tax, superannuation, leave balances and STP
              reporting are processed by the connected certified payroll ledger.
            </span>
          </div>
          <div className="billing-lines [&_.data-row]:[grid-template-columns:1.2fr_1fr_.8fr_.7fr_.65fr] [&_.data-row]:[padding-inline:18px] max-[760px]:[overflow-x:auto] max-[760px]:[&_.data-row]:[min-width:720px] [font-size:13px] payroll-lines [&_.data-row]:[grid-template-columns:1.2fr_1fr_.6fr_.7fr_.6fr]">
            <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] data-head [min-height:37px] [background:#f7f7f4] [color:#72756d] [text-transform:uppercase] [letter-spacing:.5px] [font-size:11px] [font-weight:700] [font-size:14px]">
              <span>Employee</span>
              <span>Classification</span>
              <span>Hours</span>
              <span>Gross pay</span>
              <span>Status</span>
            </div>
            {payroll.map((person) => {
              return (
                <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={person.id}>
                  <span>
                    <strong>{person.employee}</strong>
                    <small>{person.status}</small>
                  </span>
                  <span>{person.classification}</span>
                  <span>{person.ordinaryHours + person.overtimeHours + person.penaltyHours} hrs</span>
                  <strong>
                    $
                    {person.grossPay.toLocaleString("en-AU", {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                  <span
                    className={`claim-status [padding:4px_6px] [border-radius:6px] [font-size:11px] [font-weight:700] [&.ready]:[color:#5089cb] [&.ready]:[background:#f0f5fa] [&.submitted]:[color:#3578b3] [&.submitted]:[background:#f0f5fa] [&.paid]:[color:#25805f] [&.paid]:[background:#e8f7f1] [&.exception]:[color:#b54c61] [&.exception]:[background:#ffe9ed] [font-size:12px] ${payrollApproved ? "paid" : "ready"}`}
                  >
                    {payrollApproved ? "Approved" : person.status}
                  </span>
                </div>
              );
            })}
          </div>
          {payrollApproved && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-[#f7f7f4] p-4"><button className="secondary-button" onClick={() => downloadCsv("approved-pay-run.csv", "Employee,Classification,Hours,Status\nAva Williams,SCHADS Level 3.2,76,Approved\nLiam Smith,SCHADS Level 3.2,68,Approved")}><Download className="size-4" />Export approved pay run</button><button className="primary-button" onClick={() => window.print()}><ReceiptText className="size-4" />Generate payslip pack</button></div>}
        </article>
      )}
      {financeView === "Reconciliation" && <FinanceWorkspace title="Payment reconciliation" description="Match Xero payments and remittances to Provider.ai invoices without changing service-delivery evidence." action="Import latest payments" onAction={() => window.dispatchEvent(new CustomEvent("provider-notice", { detail: "Xero payment import queued. Unmatched records remain in exceptions." }))} rows={[["INV-2026-0814", "Bright Plan Management", "$4,280.00", "Matched"], ["INV-2026-0811", "NDIA", "$2,145.60", "Needs review"], ["INV-2026-0808", "Self managed", "$864.20", "Paid"]]} />}
      {financeView === "Expenses" && <FinanceWorkspace title="Operational expenses" description="Record provider expenses and receipts, then send approved transactions to the accounting ledger." action="Add expense" onAction={() => window.dispatchEvent(new CustomEvent("provider-notice", { detail: "Expense entry opened." }))} rows={[["EXP-1048", "Participant transport", "$186.40", "Awaiting receipt"], ["EXP-1047", "Worker training", "$420.00", "Approved"], ["EXP-1046", "Office supplies", "$94.15", "Sent to Xero"]]} />}
      {financeView === "Claims & invoices" && (
        <>
          <div className="finance-layout [display:grid] [grid-template-columns:1fr_280px] [gap:12px] [margin-bottom:12px] max-[1000px]:[grid-template-columns:1fr]">
            <article className="panel [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [padding:20px] revenue-panel [min-height:290px]">
              <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
                <div>
                  <h2>Revenue and labour</h2>
                  <p>Last 12 months · cash basis</p>
                </div>
                <div className="legend [display:flex] [gap:10px] [color:#72756d] [font-size:11px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:4px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:2px] [&_i]:[background:#599ce8] [&_i.labour]:[background:#b7d5f7]">
                  <span>
                    <i />
                    Revenue
                  </span>
                  <span>
                    <i className="labour" />
                    Direct labour
                  </span>
                </div>
              </div>
              <div className="bar-chart [height:205px] [padding:15px_10px_0] [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:8px] [border-bottom:1px_solid_#e2ebf6] [background:repeating-linear-gradient(to_bottom,#fff_0,#fff_50px,#ecf3fa_51px)]">
                {revenue.map((value, index) => (
                  <div className="bar-group [height:100%] [flex:1] [position:relative] [display:flex] [align-items:flex-end] [justify-content:center] [gap:2px] [&>span]:[width:8px] [&>span]:[border-radius:4px_4px_0_0] [&_small]:[position:absolute] [&_small]:[bottom:-17px] [&_small]:[color:#9b9ba8] [&_small]:[font-size:11px]" key={index}>
                    <span
                      className="revenue-bar [background:#599ce8]"
                      style={{ height: `${value}%` }}
                    />
                    <span
                      className="labour-bar [background:#bed9f8]"
                      style={{ height: `${value * 0.62}%` }}
                    />
                    <small>
                      {
                        [
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                        ][index]
                      }
                    </small>
                  </div>
                ))}
              </div>
            </article>
            <aside className="panel [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [padding:20px] payer-mix [padding-bottom:15px]">
              <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
                <div>
                  <h2>Payer mix</h2>
                  <p>Current month revenue</p>
                </div>
                <button onClick={exportPayerMix} aria-label="Export payer mix" title="Export payer mix"><Download size={17} /></button>
              </div>
              <div className="donut [width:120px] [height:120px] [margin:0_auto_15px] [border-radius:50%] [display:grid] [place-items:center] [background:radial-gradient(circle,white_56%,transparent_57%),conic-gradient(#599ce8_0_54%,#52bd98_54%_85%,#efaa57_85%)] [&>div]:[text-align:center] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_14px_var(--font-sans)] [&_small]:[color:#72756d] [&_small]:[font-size:11px]">
                <div>
                  <strong>$184k</strong>
                  <small>Total</small>
                </div>
              </div>
              <div className="payer-row [display:flex] [justify-content:space-between] [padding:7px_2px] [color:#777786] [font-size:11px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:6px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:2px] [&_i.ndia]:[background:#599ce8] [&_i.plan]:[background:#52bd98] [&_i.self]:[background:#efaa57]">
                <span>
                  <i className="ndia" />
                  NDIA managed
                </span>
                <strong>54%</strong>
              </div>
              <div className="payer-row [display:flex] [justify-content:space-between] [padding:7px_2px] [color:#777786] [font-size:11px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:6px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:2px] [&_i.ndia]:[background:#599ce8] [&_i.plan]:[background:#52bd98] [&_i.self]:[background:#efaa57]">
                <span>
                  <i className="plan" />
                  Plan managed
                </span>
                <strong>31%</strong>
              </div>
              <div className="payer-row [display:flex] [justify-content:space-between] [padding:7px_2px] [color:#777786] [font-size:11px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:6px] [&_i]:[width:7px] [&_i]:[height:7px] [&_i]:[border-radius:2px] [&_i.ndia]:[background:#599ce8] [&_i.plan]:[background:#52bd98] [&_i.self]:[background:#efaa57]">
                <span>
                  <i className="self" />
                  Self managed
                </span>
                <strong>15%</strong>
              </div>
            </aside>
          </div>
          <article className="table-panel [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden] [box-shadow:none] max-[760px]:[overflow-x:auto] claims-panel [&_.panel-heading]:[padding:14px_16px_10px]">
            <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
              <div>
                <h2>Claims and invoices</h2>
                <p>Latest billing activity</p>
              </div>
              <div className="segmented [padding:3px] [border-radius:9px] [background:#ecf3fa] [display:flex] [&_button]:[border:0] [&_button]:[border-radius:7px] [&_button]:[padding:7px_10px] [&_button]:[background:transparent] [&_button]:[color:#8d8d9b] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_button.active]:[background:white] [&_button.active]:[color:#4682c6] [&_button.active]:[box-shadow:none] [&_button]:[font-size:11px] [&_button]:[font-size:14px]">
                {["All", "Exceptions", "Ready"].map((filter) => <button key={filter} className={claimFilter === filter ? "active" : ""} onClick={() => setClaimFilter(filter)}>{filter}</button>)}
              </div>
            </div>
            <div className="data-table claims-table [&_.data-row]:[grid-template-columns:.8fr_1fr_.8fr_.8fr_.65fr_.6fr_25px] [&_.data-row]:[gap:10px] max-[760px]:[min-width:780px]">
              <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] data-head [min-height:37px] [background:#f7f7f4] [color:#72756d] [text-transform:uppercase] [letter-spacing:.5px] [font-size:11px] [font-weight:700] [font-size:14px]">
                <span>Reference</span>
                <span>Participant</span>
                <span>Service period</span>
                <span>Payer</span>
                <span>Amount</span>
                <span>Status</span>
                <span />
              </div>
              {filteredClaims.map((claim) => (
                <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={claim.id}>
                  <span>
                    <strong>{claim.id}</strong>
                    <small>{claim.items} support items</small>
                  </span>
                  <span>
                    <strong>{claim.participant}</strong>
                  </span>
                  <span>{claim.period}</span>
                  <span>{claim.payer}</span>
                  <span>
                    <strong>
                      $
                      {claim.amount.toLocaleString("en-AU", {
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </span>
                  <span>
                    <span
                      className={`claim-status [padding:4px_6px] [border-radius:6px] [font-size:11px] [font-weight:700] [&.ready]:[color:#5089cb] [&.ready]:[background:#f0f5fa] [&.submitted]:[color:#3578b3] [&.submitted]:[background:#f0f5fa] [&.paid]:[color:#25805f] [&.paid]:[background:#e8f7f1] [&.exception]:[color:#b54c61] [&.exception]:[background:#ffe9ed] [font-size:12px] ${claim.status.toLowerCase()}`}
                    >
                      {claim.status}
                    </span>
                  </span>
                  <span>
                    <button onClick={() => setSelectedClaim(claim)} aria-label={`Open ${claim.id}`} className="row-menu grid size-9 place-items-center rounded-lg border-0 bg-transparent text-muted hover:bg-brand-50 hover:text-brand-700">
                      <ArrowRight size={17} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </article>
        </>
      )}
      {selectedClaim && <div className="fixed inset-0 z-[120] bg-ink/35" onMouseDown={(event) => event.target === event.currentTarget && setSelectedClaim(null)}><aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-line bg-white shadow-float"><header className="flex items-start justify-between border-b border-line p-6"><div><p className="eyebrow">Claim record</p><h2 className="m-0 text-xl font-semibold">{selectedClaim.id}</h2><p className="mt-2 text-sm text-muted">{selectedClaim.participant} · {selectedClaim.period}</p></div><button className="icon-button" onClick={() => setSelectedClaim(null)} aria-label="Close claim"><X className="size-4" /></button></header><div className="grid gap-4 p-6"><div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-line p-4"><small className="text-muted">Amount</small><strong className="mt-1 block text-lg">{money(selectedClaim.amount)}</strong></div><div className="rounded-lg border border-line p-4"><small className="text-muted">Status</small><strong className="mt-1 block text-lg">{selectedClaim.status}</strong></div></div><div className="rounded-lg border border-line p-4"><strong className="text-sm">Claim evidence</strong><p className="mb-0 mt-2 text-sm text-muted">{selectedClaim.items} support items will be checked against approved visits, notes, agreements and price rules before submission.</p></div></div><footer className="mt-auto flex justify-end gap-2 border-t border-line p-4"><button className="secondary-button" onClick={() => setSelectedClaim(null)}>Close</button><button className="primary-button" onClick={() => { setSelectedClaim(null); setFinanceView("Customer billing"); }}>Review billing</button></footer></aside></div>}
    </section>
  );
}

function FinanceWorkspace({ title, description, action, onAction, rows }: { title: string; description: string; action: string; onAction: () => void; rows: string[][] }) { return <article className="mb-4 overflow-hidden rounded-xl border border-line bg-white"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5"><div><h2 className="m-0 text-[18px] font-semibold">{title}</h2><p className="mb-0 mt-1 text-[13px] text-muted">{description}</p></div><button className="primary-button min-h-11" onClick={onAction}>{action}</button></header><div className="overflow-x-auto"><div className="min-w-[620px]"><div className="grid grid-cols-4 bg-[#f7f7f4] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted"><span>Reference</span><span>Account or payer</span><span>Amount</span><span>Status</span></div>{rows.map((row) => <button key={row[0]} className="grid min-h-16 w-full grid-cols-4 items-center border-0 border-t border-line bg-white px-5 text-left text-[13px] hover:bg-brand-50/40" onClick={() => window.dispatchEvent(new CustomEvent("provider-notice", { detail: `${row[0]} opened.` }))}>{row.map((cell) => <span key={cell} className="font-medium last:text-muted">{cell}</span>)}</button>)}</div></div></article>; }
