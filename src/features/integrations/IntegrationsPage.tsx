import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileSignature,
  Mail,
  Plus,
  Search,
  Settings2,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

type Integration = {
  id: string;
  name: string;
  category: string;
  purpose: string;
  moves: string;
  mark: string;
  colour: string;
  connected: boolean;
  icon: LucideIcon;
};

const catalogue: Integration[] = [
  {
    id: "microsoft",
    name: "Microsoft 365",
    category: "Communications",
    purpose: "Bring shared provider mail into one secure team inbox.",
    moves: "Email, sender details and attachments",
    mark: "M",
    colour: "#2563eb",
    connected: true,
    icon: Mail,
  },
  {
    id: "google",
    name: "Google Workspace",
    category: "Communications",
    purpose:
      "Connect Gmail for participant, worker and stakeholder communication.",
    moves: "Email, sender details and attachments",
    mark: "G",
    colour: "#ea4335",
    connected: false,
    icon: Mail,
  },
  {
    id: "xero",
    name: "Xero",
    category: "Finance",
    purpose:
      "Send approved invoices and reconcile payments without re-entering data.",
    moves: "Contacts, invoices, payments and credit notes",
    mark: "X",
    colour: "#13b5ea",
    connected: false,
    icon: CircleDollarSign,
  },
  {
    id: "myob",
    name: "MYOB",
    category: "Finance",
    purpose:
      "Move approved billing records into your existing accounting workflow.",
    moves: "Customers, invoices and payment status",
    mark: "M",
    colour: "#7356bf",
    connected: false,
    icon: CircleDollarSign,
  },
  {
    id: "employment-hero",
    name: "Employment Hero Payroll",
    category: "Workforce",
    purpose:
      "Export approved hours when the roster and timesheets are ready for payroll.",
    moves: "People, approved hours and pay categories",
    mark: "EH",
    colour: "#6d4aff",
    connected: false,
    icon: UsersRound,
  },
  {
    id: "docusign",
    name: "DocuSign",
    category: "Documents",
    purpose: "Issue and track service agreements and employment documents.",
    moves: "Documents, recipients and signing status",
    mark: "D",
    colour: "#d6a800",
    connected: false,
    icon: FileSignature,
  },
];

export function IntegrationsPage() {
  const [items, setItems] = useState(catalogue);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Integration | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          `${item.name} ${item.category} ${item.purpose}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [items, category, query],
  );
  const connected = items.filter((item) => item.connected);
  const notify = (copy: string) => {
    setNotice(copy);
    window.setTimeout(() => setNotice(""), 2400);
  };
  const connect = (item: Integration) => {
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, connected: true } : entry,
      ),
    );
    notify(`${item.name} connected to Provider.ai.`);
  };
  const disconnect = (item: Integration) => {
    setItems((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, connected: false } : entry,
      ),
    );
    setSelected(null);
    notify(`${item.name} disconnected.`);
  };

  return (
    <section className="page module-page w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[13px]">
      <header className="mb-6 flex items-end justify-between gap-5 max-sm:flex-col max-sm:items-start">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[.1em] text-brand-600">
            Connected operations
          </span>
          <h1 className="mb-1.5 mt-2 text-[32px]! font-semibold! tracking-[-.04em]!">
            Integrations
          </h1>
          <p className="m-0 max-w-[680px] text-[14px] text-[#69778b]">
            Connect only the systems that move essential provider work.
            Provider.ai remains the operational source of truth.
          </p>
        </div>
        <button
          className="secondary-button"
          onClick={() => setRequesting(true)}
        >
          <Plus className="size-4" />
          Request integration
        </button>
      </header>

      <section className="grid gap-4 rounded-2xl bg-[#101c30] p-5 text-white shadow-[0_16px_38px_rgba(17,31,53,.1)] sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#8eb5fb]">
            Connection health
          </span>
          <h2 className="mt-2 text-[20px]! font-semibold! text-white!">
            {connected.length
              ? `${connected.length} system${connected.length === 1 ? "" : "s"} connected and healthy`
              : "No systems connected yet"}
          </h2>
          <p className="mt-1.5 text-xs text-[#a7b4c7]">
            Connections only access the records required for their stated
            workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {connected.map((item) => (
            <button
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.06] px-3 py-2 text-xs"
              onClick={() => setSelected(item)}
              key={item.id}
            >
              <i className="size-2 rounded-full bg-[#45ce9a]" />
              {item.name}
              <Settings2 className="size-3.5 text-[#8fa1b8]" />
            </button>
          ))}
        </div>
      </section>

      <div className="my-5 flex items-center gap-3 max-md:flex-col max-md:items-stretch">
        <label className="flex h-10 min-w-0 max-w-[420px] flex-1 items-center gap-2 rounded-xl border border-[#dfe5ec] bg-white px-3">
          <Search className="size-4 text-[#8a96a7]" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-0"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search integrations by workflow…"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X className="size-3.5" />
            </button>
          )}
        </label>
        <div className="flex gap-1 overflow-auto rounded-xl border border-[#e0e5eb] bg-[#f5f7fa] p-1">
          {["All", "Communications", "Finance", "Workforce", "Documents"].map(
            (item) => (
              <button
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-semibold ${category === item ? "bg-white text-[#223047] shadow-sm" : "text-[#6f7c8f]"}`}
                onClick={() => setCategory(item)}
                key={item}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {visible.map((item) => (
          <article
            className="group grid grid-cols-[48px_1fr_auto] items-start gap-4 rounded-2xl border border-[#e0e6ee] bg-white p-5 shadow-[0_6px_22px_rgba(31,52,86,.035)] transition hover:border-[#cad8ed] hover:shadow-[0_12px_32px_rgba(31,52,86,.07)] max-sm:grid-cols-[44px_1fr]"
            key={item.id}
          >
            <span
              className="grid size-12 place-items-center rounded-[15px] text-xs font-extrabold text-white max-sm:size-11"
              style={{ background: item.colour }}
            >
              {item.mark}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px]! font-semibold!">{item.name}</h2>
                {item.connected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7f1] px-2 py-1 text-[11px] font-bold text-[#23765a]">
                    <Check className="size-3" />
                    Connected
                  </span>
                )}
              </div>
              <small className="mt-1 block text-[11px] font-bold uppercase tracking-[.08em] text-[#8692a3]">
                {item.category}
              </small>
              <p className="mb-0 mt-3 text-xs leading-6 text-[#5f6f84]">
                {item.purpose}
              </p>
              <div className="mt-3 rounded-lg bg-[#f3f3ef] px-3 py-2">
                <small className="block text-[11px] font-bold uppercase tracking-[.06em] text-[#8c98a8]">
                  Data used
                </small>
                <span className="mt-1 block text-[11px] text-[#536176]">
                  {item.moves}
                </span>
              </div>
            </div>
            <button
              className={
                item.connected
                  ? "secondary-button max-sm:col-span-2"
                  : "primary-button max-sm:col-span-2"
              }
              onClick={() =>
                item.connected ? setSelected(item) : connect(item)
              }
            >
              {item.connected ? (
                <>
                  <Settings2 className="size-4" />
                  Manage
                </>
              ) : (
                <>
                  Connect
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </article>
        ))}
      </div>
      {!visible.length && (
        <div className="grid min-h-64 place-content-center text-center">
          <strong>No relevant integrations found</strong>
          <small className="mt-2 text-[#7c899a]">
            Try another workflow or request the connection you need.
          </small>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[120] bg-[#18202c]/35 backdrop-blur-[2px]"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelected(null)
          }
        >
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[500px] flex-col bg-white shadow-[-18px_0_50px_rgba(16,24,40,.16)]">
            <header className="flex items-start justify-between border-b border-[#e3e7ed] p-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[.08em] text-brand-600">
                  Connected system
                </span>
                <h2 className="mt-1 text-[22px]! font-semibold!">
                  {selected.name}
                </h2>
                <p className="mt-1 text-xs text-[#6b788b]">
                  Control what Provider.ai exchanges with this system.
                </p>
              </div>
              <button
                className="grid size-9 place-items-center rounded-lg border border-[#dfe4eb]"
                onClick={() => setSelected(null)}
              >
                <X className="size-4" />
              </button>
            </header>
            <div className="grid gap-4 p-6">
              <section className="rounded-xl border border-[#dfe5ec] p-4">
                <strong className="text-xs">Active workflow</strong>
                <p className="mt-2 text-xs leading-6 text-[#68778b]">
                  {selected.purpose}
                </p>
              </section>
              <section className="rounded-xl border border-[#dfe5ec] p-4">
                <strong className="text-xs">Permitted data</strong>
                <p className="mt-2 text-xs leading-6 text-[#68778b]">
                  {selected.moves}
                </p>
              </section>
              <label className="flex items-center justify-between rounded-xl border border-[#dfe5ec] p-4">
                <span>
                  <strong className="block text-xs">Automatic sync</strong>
                  <small className="mt-1 block text-[#788598]">
                    Keep approved records up to date.
                  </small>
                </span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
            <footer className="mt-auto flex justify-between border-t border-[#e3e7ed] bg-[#fafbfc] p-5">
              <button
                className="text-xs font-bold text-[#b4485b]"
                onClick={() => disconnect(selected)}
              >
                Disconnect
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setSelected(null);
                  notify(`${selected.name} settings saved.`);
                }}
              >
                Save settings
              </button>
            </footer>
          </aside>
        </div>
      )}
      {requesting && (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-[#18202c]/35 p-5 backdrop-blur-[2px]">
          <form
            className="w-full max-w-[480px] rounded-2xl bg-white shadow-2xl"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setRequesting(false);
              notify("Integration request sent to the Provider.ai team.");
            }}
          >
            <header className="flex justify-between border-b border-[#e3e7ed] p-5">
              <div>
                <h2 className="text-[19px]!">Request an integration</h2>
                <p className="mt-1 text-xs text-[#6b788b]">
                  Tell us the workflow—not just the software name.
                </p>
              </div>
              <button type="button" onClick={() => setRequesting(false)}>
                <X className="size-4" />
              </button>
            </header>
            <div className="grid gap-4 p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-xs [&_input]:h-10 [&_input]:rounded-lg [&_input]:border [&_input]:border-[#dfe4eb] [&_input]:px-3 [&_textarea]:min-h-24 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#dfe4eb] [&_textarea]:p-3">
              <label>
                System name
                <input required placeholder="e.g. your payroll system" />
              </label>
              <label>
                What should it help your team do?
                <textarea
                  required
                  placeholder="Describe the information you currently enter twice or move manually."
                />
              </label>
            </div>
            <footer className="flex justify-end gap-2 border-t border-[#e3e7ed] bg-[#fafbfc] p-4">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setRequesting(false)}
              >
                Cancel
              </button>
              <button className="primary-button">
                Send request
                <ChevronRight className="size-4" />
              </button>
            </footer>
          </form>
        </div>
      )}
      {notice && (
        <div className="fixed bottom-6 right-6 z-[140] flex items-center gap-2 rounded-xl bg-[#152033] px-4 py-3 text-xs font-semibold text-white shadow-xl">
          <Check className="size-4 text-[#58d3a5]" />
          {notice}
        </div>
      )}
    </section>
  );
}
