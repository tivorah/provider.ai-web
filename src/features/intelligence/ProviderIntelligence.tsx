import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  FileText,
  LockKeyhole,
  Maximize2,
  Minimize2,
  ExternalLink,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  getMockIntelligenceAnswer,
  intelligenceStarterCards,
  intelligenceSuggestions,
  type IntelligenceIcon,
  type MockInsightCard,
} from "../../mocks/mockProviderIntelligence";
import type { Page } from "../../types";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  cards?: MockInsightCard[];
};

const iconFor = (icon: IntelligenceIcon) =>
  icon === "roster" ? (
    <CalendarDays />
  ) : icon === "finance" ? (
    <CircleDollarSign />
  ) : icon === "document" ? (
    <FileText />
  ) : icon === "compliance" ? (
    <ShieldCheck />
  ) : (
    <UsersRound />
  );

const cardTone: Record<string, string> = {
  amber: "bg-[#fff1df] text-[#a86729]",
  rose: "bg-[#ffe9ed] text-[#b54c61]",
  mint: "bg-[#e8f7f1] text-[#247f5f]",
  violet: "bg-brand-100 text-brand-700",
};

export function ProviderIntelligence({
  onClose,
  onNavigate,
  mode,
  onToggleMode,
  onOpenNewTab,
}: {
  onClose: () => void;
  onNavigate: (page: Page) => void;
  mode: "drawer" | "full";
  onToggleMode: () => void;
  onOpenNewTab: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("provider-ai-intelligence-chat") || "[]",
      ) as ChatMessage[];
      return saved.filter((message) => !message.id.startsWith("welcome"));
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(
      "provider-ai-intelligence-chat",
      JSON.stringify(messages),
    );
    requestAnimationFrame(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
  }, [messages, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const ask = (question: string) => {
    if (!question.trim() || thinking) return;
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: "user", text: question.trim() },
    ]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      const answer = getMockIntelligenceAnswer(question);
      setMessages((current) => [
        ...current,
        { id: `a-${Date.now()}`, role: "assistant", ...answer },
      ]);
      setThinking(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }, 650);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    ask(input);
  };

  return (
    <div
      className={`fixed inset-0 z-[150] flex ${mode === "drawer" ? "justify-end bg-[#18202c]/20" : "bg-white"}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={`flex h-dvh w-full flex-col overflow-hidden bg-white ${mode === "drawer" ? "max-w-[560px] border-l border-[#d9dee5] shadow-[-18px_0_50px_rgba(16,24,40,.16)]" : "max-w-none"}`}>
        <header className="flex min-h-[82px] shrink-0 items-center gap-3.5 border-b border-[#e4e7eb] bg-white px-6 max-sm:px-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-[9px] border border-brand-200 bg-brand-50 text-brand-700">
            <Sparkles className="size-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="m-0 font-display text-[17px] font-semibold tracking-[-.02em] text-ink">
              Provider intelligence
            </h2>
            <p className="m-0 mt-1 text-xs leading-snug text-muted">
              Operational answers across your Provider.ai workspace
            </p>
          </div>
          <button className="grid size-9 shrink-0 place-items-center rounded-[7px] border border-[#d9dee5] bg-white text-muted hover:bg-brand-50 hover:text-brand-700" onClick={onOpenNewTab} aria-label="Open Provider intelligence in a new tab" title="Open in new tab"><ExternalLink className="size-[17px]" /></button>
          <button className="grid size-9 shrink-0 place-items-center rounded-[7px] border border-[#d9dee5] bg-white text-muted hover:bg-brand-50 hover:text-brand-700" onClick={onToggleMode} aria-label={mode === "drawer" ? "Open full screen" : "Return to side panel"} title={mode === "drawer" ? "Open full screen" : "Return to side panel"}>{mode === "drawer" ? <Maximize2 className="size-[17px]" /> : <Minimize2 className="size-[17px]" />}</button>
          <button
            className="grid size-9 shrink-0 place-items-center rounded-[7px] border border-[#d9dee5] bg-white text-muted transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            onClick={onClose}
            aria-label="Close Provider intelligence"
          >
            <X className="size-[18px]" />
          </button>
        </header>

        <main className="flex min-h-0 flex-1 flex-col bg-[#f3f3ef]">
          <div
            className="min-h-0 flex-1 overflow-y-auto px-7 py-7 max-sm:px-4"
            ref={chatRef}
          >
            {messages.length === 0 && !thinking && (
              <div className="mx-auto max-w-[700px]">
                <div className="mb-6 max-w-[560px]">
                  <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.06em] text-brand-700">
                    Workspace briefing
                  </span>
                  <h3 className="m-0 text-[24px] font-semibold leading-tight tracking-[-.03em] text-ink">
                    What would you like to understand?
                  </h3>
                  <p className="mb-0 mt-2 text-[13px] leading-relaxed text-muted">
                    Ask a question across rostering, people, compliance, participants and finance. Answers respect your workspace permissions.
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-3">
                  {intelligenceStarterCards.map((card) => (
                    <button
                      className="group rounded-[10px] border border-[#e1e5ea] bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(16,24,40,.025)] transition hover:-translate-y-px hover:border-brand-300 hover:shadow-[0_6px_18px_rgba(16,24,40,.06)]"
                      onClick={() => {
                        onNavigate(card.page);
                        onClose();
                      }}
                      key={card.title}
                    >
                      <span className={`mb-3 grid size-8 place-items-center rounded-[7px] ${cardTone[card.tone] ?? cardTone.violet}`}>
                        {iconFor(card.icon)}
                      </span>
                      <small className="block text-[11px] font-medium text-muted">{card.title}</small>
                      <strong className="mt-0.5 block text-lg font-semibold tracking-[-.02em] text-ink">{card.value}</strong>
                      <small className="mt-1 block text-[11px] leading-snug text-muted">{card.detail}</small>
                    </button>
                  ))}
                </div>

                <div className="mt-6 border-t border-[#e4e7eb] pt-5">
                  <small className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[.06em] text-[#7b8493]">Suggested questions</small>
                  <div className="flex flex-wrap gap-2">
                    {intelligenceSuggestions.slice(0, 5).map((suggestion) => (
                      <button className="rounded-full border border-[#d9dee5] bg-white px-3 py-2 text-xs font-medium text-[#4b5565] transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700" onClick={() => ask(suggestion)} key={suggestion}>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                className={`mb-6 flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                key={message.id}
              >
                {message.role === "assistant" && (
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-white">
                    <Sparkles className="size-4" />
                  </span>
                )}
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[75%] rounded-[12px] rounded-br-[4px] bg-brand-700 px-4 py-3 text-white shadow-[0_2px_6px_rgba(29,78,216,.12)]"
                      : "min-w-0 max-w-[640px] flex-1"
                  }
                >
                  <p className="m-0 text-sm leading-relaxed">{message.text}</p>
                  {message.cards && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {message.cards.map((card, index) => (
                        <button
                          className="grid grid-cols-[34px_1fr_16px] items-center gap-2.5 rounded-[9px] border border-line bg-white p-3 text-left transition hover:border-brand-300 hover:shadow-[0_4px_14px_rgba(16,24,40,.06)]"
                          onClick={() => {
                            onNavigate(card.page);
                            onClose();
                          }}
                          key={`${card.title}-${index}`}
                        >
                          <span
                            className={`grid size-[34px] place-items-center rounded-lg ${cardTone[card.tone] ?? cardTone.violet}`}
                          >
                            {iconFor(card.icon)}
                          </span>
                          <span className="min-w-0">
                            <small className="block text-[11px] text-muted">
                              {card.title}
                            </small>
                            <strong className="mt-0.5 block font-display text-sm">
                              {card.value}
                            </strong>
                            <small className="mt-0.5 block truncate text-[11px] text-muted">
                              {card.detail}
                            </small>
                          </span>
                          <ArrowRight className="size-4 text-muted" />
                        </button>
                      ))}
                    </div>
                  )}
                  {message.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-muted">
                      <Check className="size-3 text-positive" />
                      Review workspace information before acting
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">
                  <Sparkles className="size-4" />
                </span>
                <div className="thinking-dots flex h-8 items-center gap-1.5">
                  <i className="size-1.5 rounded-full bg-brand-500" />
                  <i className="size-1.5 rounded-full bg-brand-500 [animation-delay:.15s]" />
                  <i className="size-1.5 rounded-full bg-brand-500 [animation-delay:.3s]" />
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-[#e4e7eb] bg-white px-6 pb-3 pt-4 max-sm:px-3">
            <form
              className="rounded-[10px] border border-[#d9dee5] bg-white p-2.5 shadow-[0_1px_3px_rgba(16,24,40,.04)] transition focus-within:border-brand-400 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,.08)]"
              onSubmit={submit}
            >
              <textarea
                className="block min-h-14 w-full resize-none border-0 bg-transparent px-1 text-sm leading-relaxed text-ink outline-none placeholder:text-[#9a9aa8]"
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    ask(input);
                  }
                }}
                placeholder="Ask about participants, workforce, shifts, compliance or financial performance…"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-1.5 truncate text-[11px] text-muted">
                  <LockKeyhole className="size-3.5 shrink-0" />
                  Permission-aware · Shift+Enter for a new line
                </span>
                <button
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[7px] bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!input.trim() || thinking}
                >
                  Ask <Send className="size-3.5" />
                </button>
              </div>
            </form>
            <p className="mb-0 mt-2 text-center text-[11px] text-muted">
              Confirm decisions involving safety, compliance, employment, or payments.
            </p>
          </div>
        </main>
      </section>
    </div>
  );
}
