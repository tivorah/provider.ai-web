import { PageHeader } from "../components/PageHeader";
import {
  CalendarClock,
  CircleDollarSign,
  Download,
  FileCheck2,
  ShieldCheck,
  Users,
} from "lucide-react";

const reports = [
  {
    name: "Roster exceptions",
    description: "Open shifts, attendance exceptions and unapproved services.",
    cadence: "Live",
    icon: CalendarClock,
  },
  {
    name: "Worker eligibility",
    description: "Credential gaps, upcoming expiries and recorded overrides.",
    cadence: "Today",
    icon: Users,
  },
  {
    name: "Payroll preparation",
    description: "Approved hours, travel, allowances and unresolved exceptions.",
    cadence: "This fortnight",
    icon: FileCheck2,
  },
  {
    name: "Claims and reconciliation",
    description: "Invoice status, claim exceptions, ageing and payments.",
    cadence: "This month",
    icon: CircleDollarSign,
  },
  {
    name: "Audit evidence register",
    description: "Evidence coverage, owners, due dates and approval history.",
    cadence: "Current",
    icon: ShieldCheck,
  },
] as const;

function downloadReport(name: string) {
  const csv = [
    ["Report", "Generated", "Status"],
    [name, new Date().toISOString(), "Demo export — connect production data before use"],
  ]
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${name.toLowerCase().replaceAll(" ", "-")}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function Reports() {
  return (
    <section className="page reports-page m-0 min-h-[calc(100vh-73px)] w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px] leading-normal">
      <PageHeader category="Business operations" title="Reports" description="Review operational exports, payroll information and audit evidence."></PageHeader>

      <div className="table-panel">
        <div className="grid min-h-11 grid-cols-[minmax(190px,1.3fr)_minmax(220px,2fr)_100px_105px] items-center gap-4 border-b border-line bg-[#f3f3ef] px-5 text-[11px] font-semibold uppercase tracking-[.06em] text-muted max-lg:hidden">
          <span>Report</span><span>Purpose</span><span>Period</span><span className="text-right">Export</span>
        </div>
        {reports.map((report) => (
          <article className="grid min-h-[76px] grid-cols-[minmax(190px,1.3fr)_minmax(220px,2fr)_100px_105px] items-center gap-4 border-b border-line px-5 py-3 last:border-b-0 max-lg:grid-cols-[minmax(0,1fr)_auto]" key={report.name}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><report.icon className="size-[18px]" /></span>
              <strong className="text-[13px] font-semibold text-ink">{report.name}</strong>
            </div>
            <p className="m-0 text-[13px] leading-5 text-muted max-lg:col-span-2">{report.description}</p>
            <span className="text-[12px] font-medium text-copy max-lg:col-span-2">{report.cadence}</span>
            <button className="secondary-button justify-self-end max-lg:col-start-2 max-lg:row-start-1" onClick={() => downloadReport(report.name)}>
              <Download className="size-4" /> CSV
            </button>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">
        Every production export is permission checked, tenant scoped and recorded in the audit trail.
      </p>
    </section>
  );
}
