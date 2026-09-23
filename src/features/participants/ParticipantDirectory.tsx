import { SummaryStat } from "../shared/components/ModuleUi";
import { PageHeader } from "../../components/PageHeader";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Filter,
  HeartHandshake,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { avatarToneClass } from "../../utils/tailwind";
import { participants } from "../../mocks/mockDomain";
import { formatMoney as money } from "../../utils/formatters";
import { ParticipantRecord } from "./components/ParticipantRecord";
export function ParticipantDirectory() {
  const [selectedId, setSelectedId] = useState<string | null>(null),
    [tab, setTab] = useState("Overview"),
    [query, setQuery] = useState(""),
    [statusFilter, setStatusFilter] = useState("All statuses"),
    [regionFilter, setRegionFilter] = useState("All regions"),
    [drawerOpen, setDrawerOpen] = useState(false),
    [participantList, setParticipantList] = useState(participants);
  const selected = participantList.find((p) => p.id === selectedId);
  if (selected)
    return (
      <ParticipantRecord
        participant={selected}
        tab={tab}
        setTab={setTab}
        onBack={() => {
          setSelectedId(null);
          setTab("Overview");
        }}
      />
    );
  const visible = participantList.filter((p) => {
    const matchesQuery = `${p.name} ${p.ndis} ${p.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || p.status === statusFilter;
    const matchesRegion = regionFilter === "All regions" || p.location.includes(regionFilter);
    return matchesQuery && matchesStatus && matchesRegion;
  });
  return (
    <section className="page m-0 max-w-none participant-directory text-sm leading-normal">
      <PageHeader category="Care delivery" title="Participants" description="Manage participant records, plans, agreements and support needs."><button onClick={() => setDrawerOpen(true)} className="primary-button min-h-11"><Plus className="size-4" />Add participant</button></PageHeader>
      <div className="summary-grid">
        <SummaryStat icon={<UsersRound />} value="38" label="Active participants" detail="Current service records" />
        <SummaryStat icon={<HeartHandshake />} value="34" label="Services this week" detail="Planned participant support" />
        <SummaryStat icon={<AlertTriangle />} value="4" label="Need attention" detail="Records awaiting review" />
        <SummaryStat icon={<WalletCards />} value="68%" label="Plan utilisation" detail="Average across active plans" />
      </div>
      <div className="participant-directory-tools [display:flex] [gap:8px] [margin-bottom:11px] [&_label]:[flex:1] [&_label]:[max-width:440px] [&_label]:[height:40px] [&_label]:[padding:0_10px] [&_label]:[display:flex] [&_label]:[align-items:center] [&_label]:[gap:7px] [&_label]:[border:1px_solid_#dddfd7] [&_label]:[border-radius:9px] [&_label]:[background:#fff] [&_label_svg]:[width:15px] [&_label_svg]:[color:#9299a8] [&_input]:[flex:1] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[font-size:11px] [&>button]:[border:1px_solid_#dddfd7] [&>button]:[border-radius:9px] [&>button]:[background:#fff] [&>button]:[padding:0_11px] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:6px] [&>button]:[font-size:11px] [&>button_svg]:[width:14px]">
        <label>
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, NDIS number or location…"
          />
        </label>
        <label className="relative max-w-[190px]!">
          <Filter className="pointer-events-none" />
          <select aria-label="Filter participant status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-full w-full border-0 bg-transparent pr-7 text-[12px] outline-none">
            <option>All statuses</option><option>Active</option><option>Onboarding</option><option>Inactive</option>
          </select>
        </label>
        <label className="max-w-[180px]!"><select aria-label="Filter service region" value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} className="h-full w-full border-0 bg-transparent px-2 text-[12px] outline-none"><option>All regions</option><option>Sydney</option><option>Parramatta</option><option>Liverpool</option><option>Penrith</option></select></label>
      </div>
      <div className="participant-directory-table [border:1px_solid_#dddfd7] [border-radius:12px] [background:#fff] [overflow:hidden] max-[760px]:[overflow:auto]">
        <div className="participant-directory-row [&_small]:[font-size:11px] [&_em]:[font-size:11px] [width:100%] [min-height:72px] [padding:11px_15px] [border:0] [border-top:1px_solid_#dddfd7] [background:#fff] [display:grid] [grid-template-columns:1.5fr_1fr_1fr_1fr_.75fr_15px] [gap:12px] [align-items:center] [text-align:left] [&:not(.head):hover]:[background:#f3f3ef] [&.head]:[min-height:40px] [&.head]:[border-top:0] [&.head]:[background:#f3f3ef] [&.head]:[color:#72756d] [&.head]:[font-size:11px] [&.head]:[font-weight:800] [&.head]:[text-transform:uppercase] [&.head]:[letter-spacing:.04em] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_em]:[display:inline-block] [&_em]:[padding:4px_7px] [&_em]:[border-radius:9px] [&_em]:[background:#e7f6ef] [&_em]:[color:#267b60] [&_em]:[font-size:11px] [&_em]:[font-style:normal] [&_em.medium]:[background:#fff0d9] [&_em.medium]:[color:#95651d] [&_em.high]:[background:#ffe5e8] [&_em.high]:[color:#a73c50] [&>svg]:[width:14px] [&>svg]:[color:#9ba1ae] max-[1050px]:[grid-template-columns:1.5fr_1fr_1fr_.8fr_15px] max-[1050px]:[&>span:nth-child(4)]:[display:none] max-[760px]:[min-width:790px] [&_strong]:[font-size:13px] [&.head]:[font-size:11px] max-[760px]:[&_strong]:[font-size:12px] head">
          <span>Participant</span>
          <span>Plan & funding</span>
          <span>Support coordinator</span>
          <span>Next support</span>
          <span>Record status</span>
          <span />
        </div>
        {visible.map((person) => (
          <button
            className="participant-directory-row [&_small]:[font-size:11px] [&_em]:[font-size:11px] [width:100%] [min-height:72px] [padding:11px_15px] [border:0] [border-top:1px_solid_#dddfd7] [background:#fff] [display:grid] [grid-template-columns:1.5fr_1fr_1fr_1fr_.75fr_15px] [gap:12px] [align-items:center] [text-align:left] [&:not(.head):hover]:[background:#f3f3ef] [&.head]:[min-height:40px] [&.head]:[border-top:0] [&.head]:[background:#f3f3ef] [&.head]:[color:#72756d] [&.head]:[font-size:11px] [&.head]:[font-weight:800] [&.head]:[text-transform:uppercase] [&.head]:[letter-spacing:.04em] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_em]:[display:inline-block] [&_em]:[padding:4px_7px] [&_em]:[border-radius:9px] [&_em]:[background:#e7f6ef] [&_em]:[color:#267b60] [&_em]:[font-size:11px] [&_em]:[font-style:normal] [&_em.medium]:[background:#fff0d9] [&_em.medium]:[color:#95651d] [&_em.high]:[background:#ffe5e8] [&_em.high]:[color:#a73c50] [&>svg]:[width:14px] [&>svg]:[color:#9ba1ae] max-[1050px]:[grid-template-columns:1.5fr_1fr_1fr_.8fr_15px] max-[1050px]:[&>span:nth-child(4)]:[display:none] max-[760px]:[min-width:790px] [&_strong]:[font-size:13px] [&.head]:[font-size:11px] max-[760px]:[&_strong]:[font-size:12px]"
            onClick={() => setSelectedId(person.id)}
            key={person.id}
          >
            <span className="participant-name [display:flex] [align-items:center] [gap:9px] [&>i]:[width:39px] [&>i]:[height:39px] [&>i]:[border-radius:11px] [&>i]:[display:grid] [&>i]:[place-items:center] [&>i]:[font-style:normal] [&>i]:[font-size:11px] [&>i]:[font-weight:800]">
              <i className={avatarToneClass(person.colour)}>
                {person.initials}
              </i>
              <span>
                <strong>{person.name}</strong>
                <small>
                  {person.pronouns} · NDIS {person.ndis}
                </small>
              </span>
            </span>
            <span>
              <strong>{person.plan}</strong>
              <small>{money(person.budget - person.used)} available</small>
            </span>
            <span>
              <strong>{person.coordinator}</strong>
              <small>Support coordinator</small>
            </span>
            <span>
              <strong>{person.nextShift}</strong>
              <small>{person.location}</small>
            </span>
            <span>
              <em className={person.risk.toLowerCase()}>{person.risk} risk</em>
              <small>{person.status}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
      {drawerOpen && (
        <div className="fixed inset-0 z-[120] bg-[#18202c]/35 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}>
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l border-[#dddfd7] bg-white shadow-[-18px_0_50px_rgba(16,24,40,.14)]">
            <header className="flex items-start justify-between border-b border-[#e4e7eb] px-6 py-5">
              <div><span className="text-[11px] font-medium tracking-[.08em] text-[#1d4ed8] uppercase">Participant record</span><h2 className="mb-0 mt-1 text-[21px] font-semibold">Add participant</h2><p className="mb-0 mt-1 text-xs text-[#667085]">Create the core record now. Additional care and plan details can be added afterwards.</p></div>
              <button type="button" className="grid size-9 shrink-0 place-items-center rounded-[7px] border border-[#dddfd7] bg-white text-[#667085] hover:bg-[#f5f7f9]" onClick={() => setDrawerOpen(false)} aria-label="Close add participant drawer"><X className="size-4" /></button>
            </header>
            <form className="flex min-h-0 flex-1 flex-col" onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const name = String(data.get("name") || "").trim();
              const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
              setParticipantList((current) => [...current, { id:`p-${Date.now()}`, initials, name, pronouns:String(data.get("pronouns")), ndis:String(data.get("ndis")), plan:String(data.get("plan")), coordinator:String(data.get("coordinator") || "Not assigned"), location:String(data.get("location")), status:"Onboarding", risk:"Low", budget:Number(data.get("budget")) || 0, used:0, renewal:"Not recorded", goals:0, nextShift:"Not scheduled", colour:"blue" }]);
              setDrawerOpen(false);
            }}>
              <div className="grid flex-1 content-start gap-5 overflow-y-auto px-6 py-6 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-xs [&_label]:font-medium [&_input]:h-10 [&_input]:px-3 [&_select]:h-10 [&_select]:px-3">
                <section className="grid gap-4">
                  <div><h3 className="m-0 text-[14px] font-semibold">Identity</h3><p className="mb-0 mt-1 text-xs text-[#667085]">Information used to identify the participant.</p></div>
                  <label>Full name<input name="name" required autoFocus placeholder="Participant’s full name" /></label>
                  <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1"><label>Pronouns<select name="pronouns" defaultValue="they/them"><option>they/them</option><option>she/her</option><option>he/him</option></select></label><label>NDIS number<input name="ndis" required placeholder="4300 000 000" /></label></div>
                  <label>Location<input name="location" required placeholder="Suburb or service region" /></label>
                </section>
                <section className="grid gap-4 border-t border-[#e4e7eb] pt-5">
                  <div><h3 className="m-0 text-[14px] font-semibold">Plan and coordination</h3><p className="mb-0 mt-1 text-xs text-[#667085]">Initial funding and support coordination details.</p></div>
                  <label>Plan management<select name="plan" defaultValue="Plan managed"><option>Plan managed</option><option>Agency managed</option><option>Self managed</option></select></label>
                  <label>Plan budget<input name="budget" type="number" min="0" placeholder="0" /></label>
                  <label>Support coordinator<input name="coordinator" placeholder="Optional" /></label>
                </section>
              </div>
              <footer className="flex justify-end gap-2 border-t border-[#e4e7eb] bg-[#fafbfc] px-6 py-4"><button type="button" className="secondary-button" onClick={() => setDrawerOpen(false)}>Cancel</button><button className="primary-button">Create participant</button></footer>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}
