import { PageHeader } from "../../components/PageHeader";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Info,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  CheckCircle2,
  Send,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { people } from "../../mocks/mockDomain";
import { Avatar, SummaryStat } from "../shared/components/ModuleUi";
import { PersonRecord } from "./components/PersonRecord";

export function PeoplePage() {
  const [peopleList, setPeopleList] = useState(people);
  const [filter, setFilter] = useState("All people");
  const [selectedPerson, setSelectedPerson] = useState<
    (typeof people)[number] | null
  >(null);
  const [personTab, setPersonTab] = useState("Overview");
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  if (selectedPerson)
    return (
      <PersonRecord
        person={selectedPerson}
        tab={personTab}
        onTabChange={setPersonTab}
        onBack={() => {
          setSelectedPerson(null);
          setPersonTab("Overview");
        }}
      />
    );
  return (
    <section className="page people-page m-0 min-h-[calc(100vh-73px)] w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px] leading-normal">
      <PageHeader category="Your team" title="Workforce" description="Manage your team, worker credentials and readiness for upcoming services."><button className="primary-button" onClick={() => setAdding(true)}>
          <Plus />
          Add person
        </button></PageHeader>
      <div className="summary-grid">
        <SummaryStat
          icon={<UsersRound />}
          value="42"
          label="Active team members"
          detail="+3 this month"
        />
        <SummaryStat
          icon={<BadgeCheck />}
          value="91%"
          label="Roster ready"
          detail="38 people eligible"
          tone="mint"
        />
        <SummaryStat
          icon={<TriangleAlert />}
          value="5"
          label="Credentials expiring"
          detail="Next 30 days"
          tone="amber"
        />
        <SummaryStat
          icon={<Clock3 />}
          value="83%"
          label="Capacity utilised"
          detail="1,124 of 1,350 hrs"
          tone="violet"
        />
      </div>
      <article className="table-panel [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden] [box-shadow:none] max-[760px]:[overflow-x:auto]">
        <div className="table-panel-head [padding:12px_14px] [display:flex] [align-items:center] [gap:9px] [border-bottom:1px_solid_var(--border)] [&_.compact-search]:[margin-left:auto] [&_.compact-search]:[width:200px] [&_button]:[font-size:13px]">
          <div className="segmented [padding:3px] [border-radius:9px] [background:#ecf3fa] [display:flex] [&_button]:[border:0] [&_button]:[border-radius:7px] [&_button]:[padding:7px_10px] [&_button]:[background:transparent] [&_button]:[color:#8d8d9b] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_button.active]:[background:white] [&_button.active]:[color:#4682c6] [&_button.active]:[box-shadow:none] [&_button]:[font-size:11px] [&_button]:[font-size:14px]">
            {["All people", "Roster ready", "Action needed", "Onboarding"].map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>
          <label className="compact-search [display:flex] [align-items:center] [gap:8px] [border:1px_solid_var(--border)] [border-radius:10px] [background:white] [color:#9999aa] [padding:0_11px] [&_input]:[width:100%] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[background:transparent] [&_input]:[padding:10px_0] [&_input]:[font-size:11px] [&_input]:[font-size:14px]">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, role or location…"
            />
          </label>
        </div>
        <div className="data-table people-table [&_.data-row]:[grid-template-columns:1.55fr_.8fr_.85fr_.8fr_.72fr_26px] [&_.data-row]:[gap:12px] max-[760px]:[min-width:780px]">
          <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] data-head [min-height:37px] [background:#f7f7f4] [color:#72756d] [text-transform:uppercase] [letter-spacing:.5px] [font-size:11px] [font-weight:700] [font-size:14px]">
            <span>Team member</span>
            <span>Employment</span>
            <span>Readiness</span>
            <span>Weekly capacity</span>
            <span>Credentials</span>
            <span />
          </div>
          {peopleList
            .filter(
              (person) => filter === "All people" || person.status === filter,
            )
            .filter((person) =>
              `${person.name} ${person.role} ${person.location} ${person.type}`
                .toLowerCase()
                .includes(query.trim().toLowerCase()),
            )
            .map((person) => (
              <div
                className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] clickable-row [cursor:pointer] [transition:background_.16s_ease] [&:hover]:[background:#f7fbff]"
                onClick={() => {
                  setSelectedPerson(person);
                  setPersonTab("Overview");
                }}
                key={person.id}
              >
                <span className="person-cell [display:flex] [align-items:center] [gap:9px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [&_strong]:[font-size:12px] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]">
                  <Avatar initials={person.initials} tone={person.colour} />
                  <span>
                    <strong>{person.name}</strong>
                    <small>
                      {person.role} · {person.location}
                    </small>
                  </span>
                </span>
                <span>
                  <strong>{person.type}</strong>
                  <small>NSW · SCHADS</small>
                </span>
                <span>
                  <span
                    className={`readiness [display:flex] [align-items:center] [gap:5px] [font-size:11px] [font-weight:700] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&.ready]:[color:#23805e] [&.ready_i]:[background:#28ae81] [&.attention]:[color:#a96728] [&.attention_i]:[background:#e79b48] [&.blocked]:[color:#b34d61] [&.blocked_i]:[background:#e5657c] [font-size:12px] ${person.readiness === 100 ? "ready" : person.readiness < 80 ? "blocked" : "attention"}`}
                  >
                    <i />
                    {person.status}
                  </span>
                  <small>{person.readiness}% complete</small>
                </span>
                <span>
                  <strong>
                    {person.hours} / {person.capacity} hrs
                  </strong>
                  <span className="mini-progress [display:block] [width:82px] [height:4px] [margin-top:5px] [border-radius:3px] [background:#e9f0f8] [&_i]:[height:100%] [&_i]:[display:block] [&_i]:[border-radius:inherit] [&_i]:[background:#5d9de7]">
                    <i
                      style={{
                        width: `${(person.hours / person.capacity) * 100}%`,
                      }}
                    />
                  </span>
                </span>
                <span>
                  <strong>{person.credentials} verified</strong>
                  <small
                    className={
                      person.expiring ? "warning-text [color:#b36928]" : ""
                    }
                  >
                    {person.expiring
                      ? `${person.expiring} expiring soon`
                      : "All current"}
                  </small>
                </span>
                <span>
                  <button
                    aria-label={`Open ${person.name}`}
                    className="row-menu grid size-9 place-items-center rounded-lg border-0 bg-transparent text-muted hover:bg-brand-50 hover:text-brand-700"
                    onClick={(event) => { event.stopPropagation(); setSelectedPerson(person); setPersonTab("Overview"); }}
                  >
                    <ChevronRight size={17} />
                  </button>
                </span>
              </div>
            ))}
        </div>
      </article>
      {adding && (
        <div
          className="fixed inset-0 z-[120] bg-[#18202c]/35 backdrop-blur-[2px]"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setAdding(false)
          }
        >
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l border-[#dddfd7] bg-white shadow-[-18px_0_50px_rgba(16,24,40,.14)]">
            <header className="flex items-start justify-between border-b border-[#e4e7eb] px-6 py-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[.08em] text-brand-600">
                  Team member record
                </span>
                <h2 className="mb-0 mt-1 text-[21px]! font-semibold!">
                  Add person
                </h2>
                <p className="mb-0 mt-1 text-xs text-[#667085]">
                  Create the workforce record and begin onboarding.
                </p>
              </div>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-lg border border-[#dddfd7] bg-white"
                onClick={() => setAdding(false)}
                aria-label="Close add person"
              >
                <X className="size-4" />
              </button>
            </header>
            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const name = String(form.get("name") || "").trim();
                setPeopleList((current) => [
                  {
                    id: `w-${Date.now()}`,
                    initials: name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase(),
                    name,
                    role: String(form.get("role")),
                    type: String(form.get("type")),
                    location: String(form.get("location")),
                    readiness: 20,
                    status: "Onboarding",
                    hours: 0,
                    capacity: Number(form.get("capacity")) || 38,
                    credentials: 0,
                    expiring: 0,
                    colour: "blue",
                  },
                  ...current,
                ]);
                setAdding(false);
                setFilter("All people");
              }}
            >
              <div className="grid flex-1 content-start gap-5 overflow-y-auto px-6 py-6 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-xs [&_label]:font-semibold [&_input]:h-10 [&_input]:rounded-lg [&_input]:border [&_input]:border-[#dddfd7] [&_input]:px-3 [&_select]:h-10 [&_select]:rounded-lg [&_select]:border [&_select]:border-[#dddfd7] [&_select]:px-3">
                <div>
                  <h3 className="m-0 text-sm">Identity and role</h3>
                  <p className="mb-0 mt-1 text-xs text-[#667085]">
                    The essentials required to create the record.
                  </p>
                </div>
                <label>
                  Full name
                  <input
                    name="name"
                    required
                    autoFocus
                    placeholder="Team member’s full name"
                  />
                </label>
                <label>
                  Job title
                  <input
                    name="role"
                    required
                    placeholder="Disability Support Worker"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label>
                    Employment type
                    <select name="type" defaultValue="Casual">
                      <option>Casual</option>
                      <option>Part-time</option>
                      <option>Full-time</option>
                    </select>
                  </label>
                  <label>
                    Weekly capacity
                    <input
                      name="capacity"
                      type="number"
                      min="1"
                      max="60"
                      defaultValue="38"
                    />
                  </label>
                </div>
                <label>
                  Primary location
                  <input
                    name="location"
                    required
                    placeholder="Suburb or service region"
                  />
                </label>
              </div>
              <footer className="flex justify-end gap-2 border-t border-[#e4e7eb] bg-[#fafbfc] px-6 py-4">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setAdding(false)}
                >
                  Cancel
                </button>
                <button className="primary-button">Create person</button>
              </footer>
            </form>
          </aside>
        </div>
      )}
    </section>
  );
}
