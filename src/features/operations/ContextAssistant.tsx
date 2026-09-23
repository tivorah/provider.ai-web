import { useState } from "react";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { isMockMode } from "../../api";
import { guidance, guidanceChecked } from "./guidance";
import { useOperations, updateOperations } from "./store";
import { money, total } from "./model";
import { Modal, Badge } from "./Ui";

export function ContextAssistant({
  section,
  onClose,
}: {
  section: string;
  onClose?: () => void;
}) {
  const state = useOperations();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [allSources, setAllSources] = useState(false);
  const [answerSource, setAnswerSource] = useState<
    (typeof guidance)[number] | null
  >(null);
  const relevant = guidance.filter((item) => item.sections.includes(section));
  const sources = relevant.length ? relevant : guidance;
  const respond = (text: string) => {
    setQuestion("");
    const words = text.toLowerCase();
    const matches = sources.filter((source) =>
      `${source.title} ${source.summary} ${source.agency}`
        .toLowerCase()
        .split(/\W+/)
        .some((word) => word.length > 3 && words.includes(word)),
    );
    const keywordSource = /gst|tax code/.test(words)
      ? "gst"
      : /fair work|award|schads|allowance/.test(words)
        ? "schads"
        : /stp|withhold/.test(words)
          ? "stp"
          : /incident|reportab/.test(words)
            ? "incidents"
            : /abn|registry/.test(words)
              ? "abn"
              : /pricing|price limit/.test(words)
                ? "pricing"
                : null;
    const source = keywordSource
      ? guidance.find((item) => item.id === keywordSource)
      : matches[0];
    setAnswerSource(source ?? null);
    const context = !isMockMode
      ? "Live organisation records are not connected to this assistant. "
      : section === "finance"
        ? `Your demo workspace has ${state.invoices.filter((row) => row.status === "Draft").length} draft invoices, ${money(state.invoices.filter((row) => row.status === "Approved").reduce((sum, row) => sum + total(row) - row.paid, 0))} outstanding and ${state.workers.filter((row) => !row.reviewed).length} payroll reviews. `
        : `There are ${state.tasks.filter((row) => row.status !== "Complete").length} open demo compliance actions. `;
    setAnswer(
      `${context}${source ? `${source.summary} Suggested next step: ${source.action}` : "I can summarise the displayed official guidance and demo review queue. Choose a source below to review its requirements. Free-form AI analysis and live regulatory monitoring are not connected."}`,
    );
  };
  const content = (
    <div className="space-y-5">
      <div className="rounded-xl bg-brand-50 p-4">
        <Badge>AI assistant · guided preview</Badge>
        <p className="mt-3 text-sm leading-6">
          Guidance for <strong className="capitalize">{section}</strong>, with
          the source behind each recommendation.
        </p>
        <p className="mt-2 text-xs leading-5 text-muted">
          Curated guidance checked {guidanceChecked}. Responses use local
          templates, not a connected AI model. No live government monitoring.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "What needs my attention?",
          section === "finance"
            ? "What should I check for GST?"
            : "What compliance checks apply?",
          "What does Fair Work say?",
        ].map((prompt) => (
          <button
            key={prompt}
            className="secondary-button"
            onClick={() => respond(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      {answer && (
        <div
          role="status"
          className="rounded-xl border border-brand-200 p-4 text-sm leading-7"
        >
          {answer}
          {answerSource && (
            <a
              className="mt-3 block text-xs text-brand-800 underline"
              href={answerSource.url}
              target="_blank"
              rel="noreferrer"
            >
              Source: {answerSource.agency} · {answerSource.title}
            </a>
          )}
        </div>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (question.trim()) respond(question.trim());
        }}
        className="flex gap-2"
      >
        <input
          aria-label="Ask the section assistant"
          className="workspace-field min-w-0"
          placeholder="Ask about this section…"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={1000}
        />
        <button
          className="primary-button"
          aria-label="Ask assistant"
          disabled={!question.trim()}
        >
          <Send size={16} />
        </button>
      </form>
      <p className="text-xs text-muted">
        Review the official guidance and your circumstances before taking
        action.
      </p>
      {(allSources || onClose ? sources : sources.slice(0, 1)).map((source) => (
        <article key={source.id} className="rounded-xl border border-line p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-brand-700">
              {source.agency}
            </span>
            <span className="text-[11px] text-muted">Reference guidance</span>
          </div>
          <h3 className="mt-3 text-sm font-medium">{source.title}</h3>
          <p className="mt-2 text-xs leading-6 text-muted">{source.summary}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <a
              className="inline-flex min-h-10 items-center gap-1 text-xs text-brand-800 underline"
              href={source.url}
              target="_blank"
              rel="noreferrer"
            >
              Official source
              <ArrowUpRight size={14} />
            </a>
            {isMockMode && (
              <button
                className="secondary-button"
                onClick={() => {
                  if (
                    state.tasks.some((task) => task.id === `GUIDE-${source.id}`)
                  ) {
                    setNotice("This review is already in Compliance.");
                    return;
                  }
                  try {
                    updateOperations(
                      `Added ${source.agency} guidance review`,
                      (current) => ({
                        ...current,
                        tasks: [
                          ...current.tasks,
                          {
                            id: `GUIDE-${source.id}`,
                            title: source.title,
                            area: "Regulatory review",
                            person: "Organisation",
                            owner: "Olivia Williams",
                            due: new Date().toISOString().slice(0, 10),
                            priority: "Medium",
                            status: "Open",
                            evidence: source.url,
                            note: source.action,
                          },
                        ],
                      }),
                    );
                    setNotice(
                      "Added to Compliance. Review the due date with the action owner.",
                    );
                  } catch {
                    setNotice(
                      "Unable to save. Check browser storage and try again.",
                    );
                  }
                }}
              >
                Create review task
              </button>
            )}
          </div>
        </article>
      ))}
      {!onClose && sources.length > 1 && (
        <button
          className="secondary-button"
          onClick={() => setAllSources(!allSources)}
        >
          {allSources
            ? "Show fewer sources"
            : `Show all ${sources.length} sources`}
        </button>
      )}
      {notice && (
        <p role="status" className="text-sm text-brand-800">
          {notice}
        </p>
      )}
    </div>
  );
  return onClose ? (
    <Modal title="Provider assistant" onClose={onClose}>
      {content}
    </Modal>
  ) : (
    content
  );
}
export function AssistantButton({ section }: { section: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="secondary-button min-h-11"
        onClick={() => setOpen(true)}
      >
        <Sparkles size={16} />
        Section assistant
      </button>
      {open && (
        <ContextAssistant section={section} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
