import { PageHeader } from "../../components/PageHeader";
import { useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight, Filter, ShieldCheck, Sparkles, X } from "lucide-react";
import { complianceItems } from "../../mocks/mockDomain";
import { ActionRow } from "../shared/components/ModuleUi";

export function CompliancePage() {
  const [detail, setDetail] = useState<string | null>(null);
  const [showOnlyActions, setShowOnlyActions] = useState(false);
  const visibleItems = showOnlyActions ? complianceItems.filter((item) => item.issues > 0) : complianceItems;
  return (
    <section className="page compliance-page m-0 min-h-[calc(100vh-73px)] w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px] leading-normal">
      <PageHeader category="Business operations" title="Quality" description="Review incidents, compliance tasks and the evidence behind your services."></PageHeader>
      <div className="compliance-hero [display:grid] [grid-template-columns:1fr_300px] [gap:12px] [margin-bottom:12px] max-[1000px]:[grid-template-columns:1fr]">
        <div className="audit-score flex items-center gap-5 rounded-xl border border-line bg-white p-5 [&_h2]:mb-1 [&_h2]:mt-2.5 [&_h2]:text-[18px] [&_h2]:font-semibold [&_p]:m-0 [&_p]:max-w-[530px] [&_p]:text-[13px] [&_p]:leading-5 [&_p]:text-muted max-[560px]:items-start max-[560px]:gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-canvas text-brand-700"><ShieldCheck size={24} strokeWidth={1.4} /></span>
          <div>
            <h2 className="mb-2 text-lg font-medium text-ink">Evidence and actions, in view</h2>
            <p className="text-sm leading-6 text-muted">Review evidence gaps, action owners and the records behind your services.</p>
            <div className="mt-5 flex flex-wrap gap-6 text-xs text-muted">
              <span><strong className="mr-1 text-lg text-ink">{complianceItems.reduce((total, item) => total + item.evidence, 0)}</strong> evidence items</span>
              <span><strong className="mr-1 text-lg text-ink">{complianceItems.reduce((total, item) => total + item.issues, 0)}</strong> open actions</span>
              <span><strong className="mr-1 text-lg text-ink">{complianceItems.length}</strong> quality areas</span>
            </div>
          </div>
        </div>
        <div className="next-audit grid content-center gap-3 rounded-xl border border-line bg-white p-5 [grid-template-columns:42px_1fr] [&>span]:grid [&>span]:size-[42px] [&>span]:place-items-center [&>span]:rounded-lg [&>span]:bg-warning/10 [&>span]:text-warning [&_small]:block [&_small]:text-[12px] [&_small]:text-muted [&_strong]:mt-1 [&_strong]:block [&_strong]:text-[14px] [&_p]:mb-0 [&_p]:mt-1 [&_p]:text-[12px] [&_p]:text-warning [&_button]:col-span-2 [&_button]:min-h-10 [&_button]:rounded-lg [&_button]:border [&_button]:border-line [&_button]:bg-white [&_button]:px-3 [&_button]:text-[12px] [&_button]:font-semibold [&_button]:text-brand-700">
          <span>
            <CalendarDays />
          </span>
          <div>
            <small>Next surveillance audit</small>
            <strong>21 October 2026</strong>
            <p>Review preparation and action owners</p>
          </div>
          <button onClick={() => setDetail("Surveillance audit plan")}>Open audit plan</button>
        </div>
      </div>
      <div className="compliance-layout [display:grid] [grid-template-columns:minmax(550px,1fr)_320px] [gap:12px] max-[1000px]:[grid-template-columns:1fr]">
        <article className="table-panel [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden] [box-shadow:none] max-[760px]:[overflow-x:auto]">
          <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
            <div>
              <h2>Practice standards coverage</h2>
              <p>Evidence mapped to your registration groups</p>
            </div>
            <button className={`filter-button ${showOnlyActions ? "border-brand-300 bg-brand-50 text-brand-800" : ""}`} onClick={() => setShowOnlyActions((value) => !value)} aria-pressed={showOnlyActions}>
              <Filter size={15} /> {showOnlyActions ? "Showing open actions" : "Filter open actions"}
            </button>
          </div>
          <div className="standards-list [padding:0_18px_10px]">
            {visibleItems.map((item) => (
              <button onClick={() => setDetail(item.area)} className="standard-row grid w-full items-center gap-3 border-0 border-t border-[#dddfd7] bg-white py-3.5 text-left [grid-template-columns:38px_1fr_120px_82px_16px] max-[640px]:[grid-template-columns:38px_1fr_16px] max-[640px]:[&_.standard-score]:hidden max-[640px]:[&_.issue-count]:hidden [&>span:nth-child(2)_strong]:block [&>span:nth-child(2)_strong]:text-[14px] [&>span:nth-child(2)_small]:mt-1 [&>span:nth-child(2)_small]:block [&>span:nth-child(2)_small]:text-[12px] [&>span:nth-child(2)_small]:text-muted" key={item.area}>
                <span className={`standard-icon [width:34px] [height:34px] [border-radius:9px] [display:grid] [place-items:center] [&.mint]:[background:#e7f7f1] [&.mint]:[color:#25805f] [&.violet]:[background:#f0f5fa] [&.violet]:[color:#386590] [&.blue]:[background:#f0f5fa] [&.blue]:[color:#3479b8] [&.amber]:[background:#fff0df] [&.amber]:[color:#a96829] [&.rose]:[background:#ffebee] [&.rose]:[color:#b54d61] ${item.tone}`}>
                  <ShieldCheck size={17} />
                </span>
                <span>
                  <strong>{item.area}</strong>
                  <small>
                    {item.evidence} evidence items · {item.owner}
                  </small>
                </span>
                <span className="standard-score grid grid-cols-[34px_1fr] items-center gap-2 [&_strong]:text-[12px] [&_i]:h-1.5 [&_i]:overflow-hidden [&_i]:rounded [&_i]:bg-[#e6eef8] [&_b]:block [&_b]:h-full [&_b]:rounded-[inherit] [&_b]:bg-brand-600">
                  <strong>{item.score}%</strong>
                  <i>
                    <b style={{ width: `${item.score}%` }} />
                  </i>
                </span>
                <span
                  className={item.issues ? "issue-count rounded-md bg-warning/10 px-2 py-1.5 text-center text-[11px] font-semibold text-warning" : "issue-count rounded-md bg-positive/10 px-2 py-1.5 text-center text-[11px] font-semibold text-positive"}
                >
                  {item.issues ? `${item.issues} actions` : "Complete"}
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </article>
        <aside className="compliance-side [display:grid] [gap:12px] [align-content:start] max-[1000px]:[grid-template-columns:1fr_1fr] max-[760px]:[grid-template-columns:1fr]">
          <article className="panel [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [padding:20px] deadline-panel [padding-bottom:5px]">
            <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
              <div>
                <h2>Priority actions</h2>
                <p>Due in the next 14 days</p>
              </div>
              <span className="count-pill [background:#eff6ff] [color:#4f8ace] [font-size:11px] [font-weight:700] [padding:4px_7px] [border-radius:7px]">4</span>
            </div>
            <ActionRow
              tone="rose"
              title="Review participant risk assessment"
              meta="Isla Wilson · due tomorrow"
              onAction={() => setDetail("Participant risk assessment")}
            />
            <ActionRow
              tone="amber"
              title="Verify worker screening renewal"
              meta="Liam Smith · due 8 Aug"
              onAction={() => setDetail("Worker screening renewal")}
            />
            <ActionRow
              tone="violet"
              title="Approve incident corrective action"
              meta="INC-2041 · due 11 Aug"
              onAction={() => setDetail("Incident corrective action")}
            />
            <button onClick={() => { setShowOnlyActions(true); window.scrollTo({ top: 260, behavior: "smooth" }); }} className="view-all flex w-full items-center justify-center gap-1.5 border-0 bg-white py-3 text-[12px] font-semibold text-brand-700">
              View all compliance actions <ArrowRight size={14} />
            </button>
          </article>
          <article className="briefing-card [padding:18px] [border:1px_solid_#daeafc] [border-radius:15px] [background:radial-gradient(circle_at_100%_0,#e3f0ff,transparent_40%),linear-gradient(145deg,#f8fbff,#edf5ff)] [&_>_p]:[margin:14px_0] [&_>_p]:[font-size:11px] [&_>_p]:[color:#6f6b82] [&_>_p]:[line-height:1.55] [&_>_button]:[border:0] [&_>_button]:[background:transparent] [&_>_button]:[color:#4d88cc] [&_>_button]:[padding:0] [&_>_button]:[display:flex] [&_>_button]:[gap:6px] [&_>_button]:[align-items:center] [&_>_button]:[font-size:11px] [&_>_button]:[font-weight:700]">
            <div className="briefing-title [display:grid] [grid-template-columns:33px_1fr_20px] [align-items:center] [gap:8px] [&_>_span]:[width:33px] [&_>_span]:[height:33px] [&_>_span]:[border-radius:10px] [&_>_span]:[display:grid] [&_>_span]:[place-items:center] [&_>_span]:[background:white] [&_>_span]:[color:#569ae8] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_11.5px_var(--font-sans)] [&_small]:[margin-top:3px] [&_small]:[color:#919dab] [&_small]:[font-size:11px] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#85819a]">
              <span>
                <Sparkles size={18} />
              </span>
              <div>
                <strong>Evidence assistant</strong>
                <small>Provider.ai quality intelligence</small>
              </div>
            </div>
            <p className="!text-[13px] !leading-5">
              I found two policies referenced in training records that have
              newer approved versions.
            </p>
            <button className="!text-[12px]" onClick={() => setDetail("Evidence version gap")}>
              Review evidence gap <ArrowRight size={14} />
            </button>
          </article>
        </aside>
      </div>
      {detail && <div className="fixed inset-0 z-[120] bg-ink/35" onMouseDown={(event) => event.target === event.currentTarget && setDetail(null)}><aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l border-line bg-white shadow-float"><header className="flex items-start justify-between border-b border-line p-6"><div><p className="eyebrow">Quality record</p><h2 className="m-0 text-xl font-semibold">{detail}</h2><p className="mt-2 text-sm text-muted">Review source evidence, ownership, due dates and attributable history.</p></div><button className="icon-button shrink-0" onClick={() => setDetail(null)} aria-label="Close quality detail"><X className="size-4" /></button></header><div className="grid gap-4 overflow-y-auto p-6"><div className="rounded-lg border border-line p-4"><strong className="text-sm">Evidence status</strong><p className="mb-0 mt-2 text-sm text-muted">Review the mapped evidence, record the outcome and assign any required follow-up before its due date.</p></div><label className="grid gap-2 text-sm font-medium">Owner<select defaultValue="Quality manager" className="min-h-11 border px-3"><option>Quality manager</option><option>Service manager</option><option>Organisation administrator</option></select></label><label className="grid gap-2 text-sm font-medium">Review note<textarea className="min-h-28 border p-3" placeholder="Record review notes and evidence needed…" /></label></div><footer className="mt-auto flex justify-end gap-2 border-t border-line p-4"><button className="secondary-button" onClick={() => setDetail(null)}>Cancel</button><button className="primary-button" onClick={() => setDetail(null)}>Save review</button></footer></aside></div>}
    </section>
  );
}
