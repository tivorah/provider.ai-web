import { useState } from "react";
import { Download, Plus, Search, ArrowUpRight } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { CompliancePage as QualityOverview } from "../compliance/CompliancePage";
import { AssistantButton, ContextAssistant } from "./ContextAssistant";
import { useOperations, updateOperations } from "./store";
import { csvDownload, type ComplianceTask } from "./model";
import { Badge, cell, head, Modal, Panel, Stat } from "./Ui";
import { guidance, guidanceChecked } from "./guidance";

export function ComplianceWorkspace() {
  const state = useOperations();
  const [tab, setTab] = useState("Action register");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<ComplianceTask | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const tasks = state.tasks.filter(
    (task) =>
      `${task.title} ${task.person} ${task.owner} ${task.area}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" || task.status === filter),
  );
  const open = state.tasks.filter((task) => task.status !== "Complete");
  return (
    <section className="page m-0 max-w-none space-y-6">
      <PageHeader
        category="Governance & quality"
        title="Compliance"
        description="People, obligations and evidence. Turn the next review into a clear action."
      >
        <AssistantButton section="compliance" />
        <button className="primary-button" onClick={() => setSelected("new")}>
          <Plus size={16} />
          Add action
        </button>
      </PageHeader>
      <div className="rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-xs leading-6 text-brand-800">
        Demo register · Fictional people, dates and evidence · No regulatory
        reports are submitted. Review dates shown here are not statutory
        notification deadlines.
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Open actions"
          value={String(open.length)}
          detail="Assigned reviews across the organisation"
        />
        <Stat
          label="High priority"
          value={String(open.filter((task) => task.priority === "High").length)}
          detail="Review the underlying risk promptly"
        />
        <Stat
          label="Evidence needed"
          value={String(open.filter((task) => !task.evidence).length)}
          detail="Add a source reference before completion"
        />
        <Stat
          label="Completed"
          value={String(state.tasks.length - open.length)}
          detail="Reviewed and recorded in this demo"
        />
      </div>
      <nav className="workspace-tabs" aria-label="Compliance sections">
        {[
          "Action register",
          "Worker checks",
          "Incidents & complaints",
          "Evidence library",
          "Regulatory updates",
          "Practice standards",
        ].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      {notice && (
        <p
          role="status"
          className="rounded-xl border border-line bg-white p-4 text-sm"
        >
          {notice}
        </p>
      )}
      {tab === "Action register" && (
        <Panel
          title="Compliance actions"
          description="Search people, owners and obligations. Select a record to review its evidence."
          action={
            <button
              className="secondary-button"
              onClick={() =>
                csvDownload("demo-compliance-register.csv", [
                  [
                    "ID",
                    "Action",
                    "Person",
                    "Owner",
                    "Due",
                    "Priority",
                    "Status",
                    "Evidence",
                    "Note",
                  ],
                  ...tasks.map((task) => [
                    task.id,
                    task.title,
                    task.person,
                    task.owner,
                    task.due,
                    task.priority,
                    task.status,
                    task.evidence,
                    task.note,
                  ]),
                ])
              }
            >
              <Download size={15} />
              Export
            </button>
          }
        >
          <div className="flex flex-wrap gap-3 p-5">
            <label className="flex min-w-0 flex-1 items-center gap-2">
              <Search size={17} />
              <input
                aria-label="Search compliance actions"
                className="workspace-field"
                placeholder="Search people, actions or owners…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <select
              aria-label="Compliance status"
              className="workspace-field w-auto"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {["All", "Open", "In review", "Complete"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-canvas">
                <tr>
                  {[
                    "Action / person",
                    "Area",
                    "Owner",
                    "Review date",
                    "Priority",
                    "Status",
                  ].map((title) => (
                    <th key={title} className={head}>
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr className="border-t border-line" key={task.id}>
                    <td className={cell}>
                      <button
                        className="text-left hover:text-brand-700"
                        onClick={() => setSelected(task)}
                      >
                        <span className="font-medium">{task.title}</span>
                        <span className="mt-1 block text-xs text-muted">
                          {task.person} · {task.id}
                        </span>
                      </button>
                    </td>
                    <td className={cell}>{task.area}</td>
                    <td className={cell}>{task.owner}</td>
                    <td className={cell}>{task.due}</td>
                    <td className={cell}>
                      <Badge warn={task.priority === "High"}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className={cell}>
                      <Badge>{task.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!tasks.length && (
              <p className="p-8 text-center text-sm text-muted">
                No actions match these filters.
              </p>
            )}
          </div>
        </Panel>
      )}
      {tab === "Worker checks" && (
        <Panel
          title="People & readiness"
          description="Sample screening and training reviews. Registry access is not connected."
        >
          <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
            {state.workers.map((person) => {
              const records = state.tasks.filter(
                (task) => task.person === person.name,
              );
              return (
                <div
                  key={person.id}
                  className="rounded-xl border border-line p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-full bg-brand-50 text-sm text-brand-800">
                      {person.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium">{person.name}</h3>
                      <p className="mt-1 text-xs text-muted">{person.role}</p>
                    </div>
                  </div>
                  <p className="my-4 text-xs text-muted">
                    {records.length
                      ? `${records.filter((task) => task.status !== "Complete").length} open review actions`
                      : "No screening evidence recorded in demo"}
                  </p>
                  {records.map((task) => (
                    <button
                      key={task.id}
                      className="mb-2 block text-left text-xs text-brand-800 underline"
                      onClick={() => setSelected(task)}
                    >
                      {task.title} · {task.status}
                    </button>
                  ))}
                  <Badge warn>Registry verification not connected</Badge>
                </div>
              );
            })}
          </div>
        </Panel>
      )}
      {tab === "Incidents & complaints" && (
        <Panel
          title="Incident & complaint follow-up"
          description="Assess reportability immediately using the official category and timeframe. This app does not notify the Commission."
        >
          <div className="p-5">
            <a
              className="inline-flex items-center gap-2 text-sm text-brand-800 underline"
              href={guidance.find((item) => item.id === "incidents")!.url}
              target="_blank"
              rel="noreferrer"
            >
              Commission reporting guidance
              <ArrowUpRight size={16} />
            </a>
          </div>
          {state.tasks
            .filter((task) => ["Incidents", "Complaints"].includes(task.area))
            .map((task) => (
              <button
                key={task.id}
                className="flex w-full items-center justify-between gap-4 border-t border-line p-5 text-left"
                onClick={() => setSelected(task)}
              >
                <span>
                  <strong className="text-sm font-medium">{task.title}</strong>
                  <span className="mt-2 block text-xs text-muted">
                    {task.person} · {task.owner}
                  </span>
                </span>
                <Badge warn>{task.status}</Badge>
              </button>
            ))}
        </Panel>
      )}
      {tab === "Evidence library" && (
        <Panel
          title="Evidence references"
          description="References saved on demo reviews. These are not uploaded or verified documents."
        >
          <div className="divide-y divide-line">
            {state.tasks
              .filter((task) => task.evidence)
              .map((task) => (
                <button
                  key={task.id}
                  className="block w-full p-5 text-left hover:bg-canvas"
                  onClick={() => setSelected(task)}
                >
                  <p className="break-words text-sm font-medium">
                    {task.evidence}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    {task.title} · {task.owner} · {task.status}
                  </p>
                </button>
              ))}
          </div>
        </Panel>
      )}
      {tab === "Regulatory updates" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <Panel
            title="Regulatory watchlist"
            description={`Source review: ${guidanceChecked}. Automatic monitoring is not connected.`}
          >
            <div className="divide-y divide-line">
              {guidance.map((item) => (
                <article key={item.id} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-brand-700">
                      {item.agency}
                    </span>
                    <Badge>Reference</Badge>
                  </div>
                  <h3 className="mt-3 text-sm font-medium">{item.title}</h3>
                  <p className="my-3 text-xs leading-6 text-muted">
                    {item.action}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-800 underline"
                  >
                    Review source
                  </a>
                </article>
              ))}
            </div>
          </Panel>
          <Panel
            title="Compliance assistant"
            description="Create a review task from relevant guidance."
          >
            <div className="p-5">
              <ContextAssistant section="compliance" />
            </div>
          </Panel>
        </div>
      )}
      {tab === "Practice standards" && <QualityOverview />}
      {selected && (
        <Modal
          title={selected === "new" ? "Add compliance action" : selected.title}
          onClose={() => setSelected(null)}
        >
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const record: ComplianceTask = {
                id:
                  selected === "new"
                    ? `CMP-${crypto.randomUUID().slice(0, 8)}`
                    : selected.id,
                title: String(data.get("title")).trim(),
                area: String(data.get("area")),
                person: String(data.get("person")).trim(),
                owner: String(data.get("owner")).trim(),
                due: String(data.get("due")),
                priority: String(
                  data.get("priority"),
                ) as ComplianceTask["priority"],
                status: String(data.get("status")) as ComplianceTask["status"],
                evidence: String(data.get("evidence")).trim(),
                note: String(data.get("note")).trim(),
              };
              if (
                record.status === "Complete" &&
                (!record.evidence || !record.note)
              ) {
                setNotice(
                  "Completion requires an evidence reference and review note.",
                );
                return;
              }
              try {
                updateOperations(
                  `Saved compliance review ${record.id}: ${record.status}`,
                  (current) => ({
                    ...current,
                    tasks:
                      selected === "new"
                        ? [...current.tasks, record]
                        : current.tasks.map((task) =>
                            task.id === record.id ? record : task,
                          ),
                  }),
                );
                setSelected(null);
                setNotice("Review saved with its activity record.");
              } catch {
                setNotice(
                  "Unable to save. Check browser storage and try again.",
                );
              }
            }}
          >
            {(["title", "person", "owner"] as const).map((field) => (
              <label key={field} className="grid gap-2 text-sm capitalize">
                {field === "person" ? "Person / team" : field}
                <input
                  name={field}
                  className="workspace-field"
                  required
                  maxLength={200}
                  defaultValue={selected === "new" ? "" : selected[field]}
                />
              </label>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Area
                <select
                  name="area"
                  className="workspace-field"
                  defaultValue={
                    selected === "new"
                      ? "Participant safeguards"
                      : selected.area
                  }
                >
                  {[
                    "Participant safeguards",
                    "Worker screening",
                    "Workforce",
                    "Incidents",
                    "Complaints",
                    "Training",
                    "Regulatory review",
                    "Practice standards",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                Review date
                <input
                  name="due"
                  type="date"
                  className="workspace-field"
                  required
                  defaultValue={selected === "new" ? "" : selected.due}
                />
              </label>
              <label className="grid gap-2 text-sm">
                Priority
                <select
                  name="priority"
                  className="workspace-field"
                  defaultValue={
                    selected === "new" ? "Medium" : selected.priority
                  }
                >
                  {["High", "Medium", "Low"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                Status
                <select
                  name="status"
                  className="workspace-field"
                  defaultValue={selected === "new" ? "Open" : selected.status}
                >
                  {["Open", "In review", "Complete"].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="grid gap-2 text-sm">
              Evidence reference
              <input
                name="evidence"
                className="workspace-field"
                defaultValue={selected === "new" ? "" : selected.evidence}
                placeholder="Document reference, source URL or portal receipt"
                maxLength={1000}
              />
            </label>
            <label className="grid gap-2 text-sm">
              Review note
              <textarea
                name="note"
                className="workspace-field min-h-24 py-3"
                defaultValue={selected === "new" ? "" : selected.note}
                maxLength={3000}
              />
            </label>
            <p className="text-xs text-muted">
              Completion requires an evidence reference and a review note.
            </p>
            {notice && (
              <p role="status" className="text-sm text-warning">
                {notice}
              </p>
            )}
            <button className="primary-button">Save review</button>
          </form>
        </Modal>
      )}
    </section>
  );
}
