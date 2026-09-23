import { ArrowLeft, CheckCircle2, Mail, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { people } from "../../../mocks/mockDomain";
import { Avatar } from "../../shared/components/ModuleUi";
import { PersonTab } from "./PersonTab";

const tabs = [
  "Overview",
  "Onboarding",
  "Employment",
  "Credentials",
  "Availability",
  "Documents",
];

export function PersonRecord({
  person,
  tab,
  onTabChange,
  onBack,
}: {
  person: (typeof people)[number];
  tab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
}) {
  const [accessSent, setAccessSent] = useState(false);

  return (
    <section className="person-record page m-0 min-h-[calc(100vh-73px)] w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px]">
      <button
        className="mb-5 inline-flex items-center gap-2 border-0 bg-transparent p-0 text-xs font-bold text-brand-700"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" /> Back to people
      </button>
      <header className="grid grid-cols-[66px_1fr_auto] items-center gap-4 max-[760px]:grid-cols-[54px_1fr]">
        <Avatar initials={person.initials} tone={person.colour} large />
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[.1em] text-brand-600">
            Team member record
          </span>
          <h1 className="mb-1 mt-1.5 text-[28px]! font-semibold! tracking-[-.04em]!">
            {person.name}
          </h1>
          <p className="m-0 text-xs text-[#69778b]">
            {person.role} · {person.type} · {person.location}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <em
              className={`rounded-full px-2 py-1 text-[11px] font-bold not-italic ${person.readiness === 100 ? "bg-[#e8f7f1] text-[#24785c]" : "bg-[#fff1df] text-[#966126]"}`}
            >
              {person.status}
            </em>
            <span className="text-[11px] text-[#7b8798]">
              {person.readiness}% roster ready
            </span>
          </div>
        </div>
        <aside className="flex gap-2 max-[760px]:col-span-2">
          <button
            className="secondary-button"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("provider-navigate", { detail: "inbox" }),
              )
            }
          >
            <Mail className="size-4" /> Email
          </button>
          <button
            className="primary-button"
            onClick={() => setAccessSent(true)}
          >
            <Send className="size-4" />
            {accessSent ? "Access sent" : "Send login access"}
          </button>
        </aside>
      </header>
      {accessSent && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#cce9dc] bg-[#eef9f4] px-4 py-3 text-[#256f57]">
          <CheckCircle2 className="size-5" />
          <span>
            <strong className="block text-xs">
              Provider.ai access invitation sent
            </strong>
            <small className="text-[11px]">
              Access will follow this team member’s assigned role.
            </small>
          </span>
        </div>
      )}
      <nav className="mt-6 flex overflow-x-auto border-b border-[#dde4ec]">
        {tabs.map((item) => (
          <button
            className={`min-h-11 whitespace-nowrap border-0 border-b-2 px-3 text-xs font-semibold ${tab === item ? "border-brand-500 text-brand-700" : "border-transparent bg-transparent text-[#748095]"}`}
            onClick={() => onTabChange(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="mt-4 rounded-2xl border border-[#dddfd7] bg-[#f7f9fc] shadow-[0_8px_28px_rgba(31,52,86,.035)]">
        {tab === "Overview" && (
          <div className="grid gap-4 p-5 lg:grid-cols-[1.3fr_.7fr]">
            <section className="rounded-xl border border-[#dddfd7] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[.08em] text-[#7c899b]">
                    Workforce profile
                  </span>
                  <h2 className="mt-1.5 text-base!">Employment overview</h2>
                </div>
                <ShieldCheck className="size-5 text-[#29916d]" />
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["Employment", person.type],
                  ["Primary role", person.role],
                  ["Service region", person.location],
                  [
                    "Weekly allocation",
                    `${person.hours} of ${person.capacity} hours`,
                  ],
                ].map(([label, value]) => (
                  <div className="rounded-xl bg-[#f7f9fc] p-4" key={label}>
                    <small className="block text-[11px] font-bold uppercase tracking-[.07em] text-[#8995a6]">
                      {label}
                    </small>
                    <strong className="mt-2 block text-xs">{value}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border border-[#dddfd7] bg-white p-5">
              <span className="text-[11px] font-bold uppercase tracking-[.08em] text-[#7c899b]">
                Roster readiness
              </span>
              <strong className="mt-4 block text-[30px] tracking-[-.05em]">
                {person.readiness}%
              </strong>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8edf3]">
                <i
                  className="block h-full rounded-full bg-[#2aae7f]"
                  style={{ width: `${person.readiness}%` }}
                />
              </div>
              <p className="mt-4 text-xs leading-6 text-[#6f7d90]">
                {person.credentials} credentials verified ·{" "}
                {person.expiring
                  ? `${person.expiring} expiring soon`
                  : "all current"}
              </p>
            </section>
          </div>
        )}
        {tab !== "Overview" && <PersonTab person={person} tab={tab} />}
      </div>
    </section>
  );
}
