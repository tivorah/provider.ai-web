import {
  Archive,
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Inbox,
  Mail,
  MoreHorizontal,
  Paperclip,
  PenLine,
  Plus,
  RefreshCcw,
  Reply,
  Search,
  Send,
  Settings2,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createMockImapAccount,
  initialAccounts,
  initialMessages,
  type Message,
} from "../../mocks/inbox";
import { ComposeWindow } from "./components/ComposeWindow";
import { ConnectMailboxModal } from "./components/ConnectMailboxModal";

export function InboxPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [messages, setMessages] = useState(initialMessages);
  const [folder, setFolder] = useState("Inbox");
  const [account, setAccount] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [compose, setCompose] = useState(false);
  const [connect, setConnect] = useState(false);
  const [mailboxPicker, setMailboxPicker] = useState(false);
  const [mailFilter, setMailFilter] = useState<"all" | "unread">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [notice, setNotice] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [tone, setTone] = useState("Professional");
  const [refining, setRefining] = useState(false);
  const [refined, setRefined] = useState(false);
  useEffect(() => {
    const changeFolder = (event: Event) => {
      setFolder((event as CustomEvent<string>).detail);
      setSelectedId("");
    };
    window.addEventListener("provider-inbox-folder", changeFolder);
    return () =>
      window.removeEventListener("provider-inbox-folder", changeFolder);
  }, []);
  const visible = useMemo(
    () =>
      messages.filter(
        (message) =>
          (folder === "Starred"
            ? message.starred
            : message.folder === folder) &&
          (account === "all" || message.account === account) &&
          `${message.from} ${message.email} ${message.subject} ${message.preview} ${message.body} ${message.category}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [messages, folder, account, query],
  );
  const selected = messages.find((message) => message.id === selectedId);
  const filteredVisible =
    mailFilter === "unread"
      ? visible.filter((message) => message.unread)
      : visible;
  const modernVisible =
    sortOrder === "newest" ? filteredVisible : [...filteredVisible].reverse();
  const selectedAccount = accounts.find(
    (item) => item.id === selected?.account,
  );
  const update = (id: string, changes: Partial<Message>) =>
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...changes } : message,
      ),
    );
  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCompose(false);
    setDraftBody("");
    setRefined(false);
    setNotice("Message sent from the selected connected mailbox.");
    window.setTimeout(() => setNotice(""), 2500);
  };
  const refineDraft = () => {
    if (!draftBody.trim()) {
      setNotice("Write a draft first, then Provider.ai can refine it.");
      window.setTimeout(() => setNotice(""), 2200);
      return;
    }
    setRefining(true);
    window.setTimeout(() => {
      const clean = draftBody
        .trim()
        .replace(/\s+/g, " ")
        .replace(
          /(^|[.!?]\s+)([a-z])/g,
          (_, start, letter) => `${start}${letter.toUpperCase()}`,
        )
        .replace(/\bi\b/g, "I");
      const greeting =
        tone === "Warm"
          ? "Hi there,\n\n"
          : tone === "Concise"
            ? "Hi,\n\n"
            : "Hello,\n\n";
      const closing =
        tone === "Warm"
          ? "\n\nWarm regards,\nHarbour Care team"
          : tone === "Concise"
            ? "\n\nRegards,\nHarbour Care"
            : "\n\nKind regards,\nHarbour Care team";
      setDraftBody(
        `${greeting}${clean}${/[.!?]$/.test(clean) ? "" : "."}${closing}`,
      );
      setRefining(false);
      setRefined(true);
    }, 650);
  };
  return (
    <section className="page module-page unified-inbox-page w-full max-w-none px-[clamp(16px,2vw,30px)] pb-8 pt-7 text-[13px]">
      <div className="mb-6 flex items-end justify-between gap-6 max-[640px]:items-start max-[640px]:flex-col">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-[.09em] text-[#667085] uppercase">
            <span className="size-1.5 rounded-full bg-[#22a06b]" />
            Communications
          </div>
          <h1 className="text-[34px] leading-[1.1] tracking-[-.035em]">
            Shared inbox
          </h1>
          <p className="mt-2 max-w-[620px] text-[14px] leading-relaxed text-muted">
            One secure team inbox across every connected provider email account.
          </p>
        </div>
        <div className="heading-actions max-[570px]:[width:100%] max-[570px]:[&_button]:[flex:1] max-[570px]:[&_button]:[justify-content:center]">
          <span className="mr-1 hidden items-center gap-2 text-[11px] text-[#667085] xl:flex">
            <i className="size-2 rounded-full bg-[#22a06b]" />
            {accounts.length} mailboxes connected
          </span>
          <button
            className="secondary-button text-[13px]"
            onClick={() => setConnect(true)}
          >
            <Plus />
            Connect mailbox
          </button>
          <button
            className="primary-button text-[13px]"
            onClick={() => {
              setMailboxPicker(false);
              setCompose(true);
            }}
          >
            <PenLine />
            Compose
          </button>
        </div>
      </div>
      <div className="relative mb-3 flex items-center justify-between rounded-[9px] border border-[#e1e5ea] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(16,24,40,.025)]">
        <button
          type="button"
          title="Select connected mailbox"
          aria-label="Select connected mailbox"
          aria-expanded={mailboxPicker}
          onClick={() => setMailboxPicker((open) => !open)}
          className="flex items-center gap-2 rounded-[7px] border-0 bg-[#f5f7f9] px-3 py-2 text-[12px] font-medium text-[#344054] hover:bg-[#eef2f6]"
        >
          <Mail size={16} />
          {account === "all"
            ? "All mailboxes"
            : accounts.find((item) => item.id === account)?.address}
          <ChevronDown size={14} />
        </button>
        <button
          title="Sync connected mailboxes"
          aria-label="Sync connected mailboxes"
          className="grid size-8 place-items-center rounded-[7px] border-0 bg-transparent text-[#1d4ed8] hover:bg-[#eff6ff]"
          onClick={() => {
            setNotice("All mailboxes are up to date.");
            window.setTimeout(() => setNotice(""), 2200);
          }}
        >
          <RefreshCcw size={15} />
        </button>
        {mailboxPicker && !compose && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-[320px] rounded-xl border border-line bg-white p-2 shadow-[0_16px_45px_rgba(32,29,55,.16)]">
            <button
              className={`flex w-full items-center gap-3 rounded-lg border-0 px-3 py-2.5 text-left text-[12px] ${account === "all" ? "bg-brand-50 text-brand-700" : "bg-white hover:bg-[#f5f8fc]"}`}
              onClick={() => {
                setAccount("all");
                setMailboxPicker(false);
              }}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-[11px] font-bold text-white">
                All
              </span>
              <span>
                <strong className="block">All mailboxes</strong>
                <small className="text-[11px] text-muted">
                  {accounts.length} connected accounts
                </small>
              </span>
            </button>
            {accounts.map((item) => (
              <button
                key={item.id}
                className={`mt-1 flex w-full items-center gap-3 rounded-lg border-0 px-3 py-2.5 text-left text-[12px] ${account === item.id ? "bg-brand-50 text-brand-700" : "bg-white hover:bg-[#f5f8fc]"}`}
                onClick={() => {
                  setAccount(item.id);
                  setMailboxPicker(false);
                }}
              >
                <span
                  className="grid size-8 place-items-center rounded-lg text-[11px] font-bold text-white"
                  style={{ background: item.colour }}
                >
                  {item.provider[0]}
                </span>
                <span>
                  <strong className="block">{item.address}</strong>
                  <small className="text-[11px] text-muted">
                    {item.provider}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      {!selected && (
        <section
          className="inbox-modern-list"
          aria-label={`${folder} conversations`}
        >
          <header>
            <div>
              <h2>{folder}</h2>
              <p>
                {visible.length} conversations <span>·</span>{" "}
                {visible.filter((message) => message.unread).length} unread
              </p>
            </div>
            <div className="inbox-modern-search">
              <Search aria-hidden="true" />
              <input
                aria-label="Search messages"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search sender, subject or message"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X />
                </button>
              )}
            </div>
            <div className="inbox-modern-filters">
              <button
                type="button"
                className={mailFilter === "all" ? "active" : ""}
                onClick={() => setMailFilter("all")}
              >
                All mail
              </button>
              <button
                type="button"
                className={mailFilter === "unread" ? "active" : ""}
                onClick={() => setMailFilter("unread")}
              >
                Unread
              </button>
              <button
                type="button"
                className="inbox-modern-sort"
                onClick={() =>
                  setSortOrder((current) =>
                    current === "newest" ? "oldest" : "newest",
                  )
                }
              >
                {sortOrder === "newest" ? "Newest" : "Oldest"} <ChevronDown />
              </button>
            </div>
          </header>
          <div className="inbox-modern-columns" aria-hidden="true">
            <span />
            <span>Sender</span>
            <span>Message</span>
            <span>Type</span>
            <span>Received</span>
          </div>
          <div className="inbox-modern-rows">
            {modernVisible.length ? (
              modernVisible.map((message) => {
                const source = accounts.find(
                  (item) => item.id === message.account,
                )!;
                return (
                  <button
                    type="button"
                    className={`inbox-modern-row ${message.unread ? "is-unread" : ""}`}
                    onClick={() => {
                      setSelectedId(message.id);
                      update(message.id, { unread: false });
                    }}
                    key={message.id}
                  >
                    <span className="inbox-modern-avatar">
                      {message.from
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="inbox-modern-sender">
                      <strong>{message.from}</strong>
                      <small>{source.address}</small>
                    </span>
                    <span className="inbox-modern-copy">
                      <b>{message.subject}</b>
                      <small>{message.preview}</small>
                    </span>
                    <span className="inbox-modern-category">
                      <i style={{ background: source.colour }} />
                      <em>{message.category}</em>
                    </span>
                    <span className="inbox-modern-state">
                      <time>{message.time}</time>
                      {message.starred && <Star />}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="inbox-modern-empty">
                <Inbox />
                <strong>
                  {query ? `No results for “${query}”` : "No messages here"}
                </strong>
                <small>
                  {query
                    ? "Try a sender, subject, category or phrase."
                    : "Try another mailbox or folder."}
                </small>
                {query && (
                  <button type="button" onClick={() => setQuery("")}>
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}
      {selected && (
        <div
          className="unified-mail-shell mail-detail-screen"
        >
          <>
            <section className="mail-list [border-right:1px_solid_var(--border)] [overflow-y:auto] [&>header]:[height:56px] [&>header]:[padding:0_12px] [&>header]:[border-bottom:1px_solid_var(--border)] [&>header]:[display:flex] [&>header]:[align-items:center] [&>header]:[gap:7px] [&>header]:[position:sticky] [&>header]:[top:0] [&>header]:[z-index:2] [&>header]:[background:white] [&>header_label]:[height:38px] [&>header_label]:[flex:1] [&>header_label]:[padding:0_10px] [&>header_label]:[border:1px_solid_var(--border)] [&>header_label]:[border-radius:9px] [&>header_label]:[display:flex] [&>header_label]:[align-items:center] [&>header_label]:[gap:7px] [&>header_svg]:[width:16px] [&>header_svg]:[color:#9292a1] [&>header_input]:[min-width:0] [&>header_input]:[flex:1] [&>header_input]:[border:0] [&>header_input]:[outline:0] [&>header_input]:[font-size:12px] [&>header>button]:[border:0] [&>header>button]:[background:transparent] max-[1150px]:[min-width:0] max-[850px]:[height:430px] min-w-0">
              <header className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3">
                  <Search />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search all connected mailboxes"
                  />
                </label>
                <button>
                  <Settings2 />
                </button>
              </header>
              <div className="mail-list-title flex items-center justify-between border-b border-line px-5 py-4">
                <div className="inbox-title-copy">
                  <div>
                    <h2>{folder}</h2>
                    <span>{visible.length} conversations</span>
                  </div>
                </div>
                <button type="button" aria-label="Sort conversations">
                  Newest <ChevronDown />
                </button>
              </div>
              <div className="conversation-list" role="list">
                {visible.length ? (
                  visible.map((message) => {
                    const source = accounts.find(
                      (item) => item.id === message.account,
                    )!;
                    return (
                      <button
                        className={`mail-list-item grid w-full grid-cols-[42px_minmax(0,1fr)_20px] gap-3 text-left ${message.unread ? "unread" : ""}`}
                        aria-current={
                          selectedId === message.id ? "true" : undefined
                        }
                        role="listitem"
                        onClick={() => {
                          setSelectedId(message.id);
                          update(message.id, { unread: false });
                        }}
                        key={message.id}
                      >
                        <span className="sender-avatar grid size-10 place-items-center rounded-full">
                          {message.from
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <span className="mail-copy min-w-0">
                          <span className="conversation-sender">
                            <strong>{message.from}</strong>
                            <time>{message.time}</time>
                          </span>
                          <b className="conversation-subject">
                            {message.subject}
                          </b>
                          <small className="conversation-preview">
                            {message.preview}
                          </small>
                          <span className="mail-tags">
                            <i style={{ background: source.colour }} />
                            {source.address}
                            <em>{message.category}</em>
                          </span>
                        </span>
                        {message.starred && (
                          <Star className="starred [color:#e4a33e] [fill:#ffd36b]" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="mail-empty [min-height:240px] [display:grid] [place-content:center] [justify-items:center] [gap:8px] [color:#72756d] [&_strong]:[color:#555466]">
                    <Inbox />
                    <strong>No messages here</strong>
                    <small>Try another mailbox or folder.</small>
                  </div>
                )}
              </div>
            </section>
          </>
          {selected && (
            <article className="mail-reader [min-width:0] [display:flex] [flex-direction:column] [background:white] [&>header]:[height:56px] [&>header]:[padding:0_17px] [&>header]:[border-bottom:1px_solid_var(--border)] [&>header]:[display:flex] [&>header]:[align-items:center] [&>header]:[justify-content:space-between] [&>header>div]:[display:flex] [&>header>div]:[gap:5px] [&>header_button]:[width:34px] [&>header_button]:[height:34px] [&>header_button]:[border:1px_solid_var(--border)] [&>header_button]:[border-radius:8px] [&>header_button]:[background:white] [&>header_button]:[display:grid] [&>header_button]:[place-items:center] [&>header_svg]:[width:16px] max-[1150px]:[min-width:0] max-[850px]:[min-height:620px] mail-reader-full [&_.mail-reader-back]:[width:auto] [&_.mail-reader-back]:[padding:0_12px] [&_.mail-reader-back]:[margin-right:8px] [&_.mail-reader-back]:[border-right:1px_solid_#e2e4ea] [&_.mail-reader-back]:[border-radius:8px] [&_.mail-reader-back]:[display:flex] [&_.mail-reader-back]:[align-items:center] [&_.mail-reader-back]:[gap:7px] [&_.mail-reader-back]:[color:#4a86ca] [&_.mail-reader-back]:[font-size:12px] [&_.mail-reader-back]:[font-weight:750] [min-height:650px] [width:100%] [background:#fff] [&>header]:[height:58px] [&>header]:[padding:0_20px] [&>header]:[border-bottom:1px_solid_#e5e7ed] [&_.mail-reader-back_svg]:[width:17px] [&_.reader-content]:[width:min(920px,calc(100%_-_48px))] [&_.reader-content]:[margin:0_auto] [&_.reader-content]:[padding:30px_0_90px] [&_.reader-content>h2]:[font-size:27px] [&_.reader-content>h2]:[line-height:1.25] [&_.reader-content>h2]:[margin:22px_0] [&_.reader-mailbox_strong]:[font-size:13px] [&_.reader-mailbox_small]:[font-size:11px] [&_.reader-sender_strong]:[font-size:14px] [&_.reader-sender_small]:[font-size:11px] [&_.reader-sender_time]:[font-size:11px] [&_.reader-body]:[font-size:14px] [&_.reader-body]:[line-height:1.75] [&_.reader-body_p]:[font-size:14px] [&_.reader-reply]:[position:sticky] [&_.reader-reply]:[bottom:0] [&_.reader-reply]:[padding:13px_24px] [&_.reader-reply]:[background:rgba(255,255,255,.96)] [&_.reader-reply]:[backdrop-filter:blur(10px)] [&_.reader-reply]:[border-top:1px_solid_#e4e6ed] [&_.reader-reply_button]:[font-size:12px] [&_.reader-reply_span]:[font-size:11px] max-[760px]:[&_.reader-content]:[width:calc(100%_-_30px)] max-[760px]:[&_.reader-content]:[padding-top:20px] max-[760px]:[&_.mail-reader-back_span]:[display:none] min-h-[650px] w-full bg-white">
              <>
                <header className="flex h-14 items-center justify-between border-b border-line px-5">
                  <div>
                    <button
                      className="mail-reader-back mr-2 inline-flex h-9 items-center gap-2 rounded-lg border-0 border-r border-line bg-transparent px-3 text-xs font-bold text-brand-700"
                      title="Back to inbox"
                      onClick={() => setSelectedId("")}
                    >
                      <ArrowLeft /> <span>Back to {folder}</span>
                    </button>
                    <button
                      title="Archive"
                      onClick={() => update(selected.id, { folder: "Archive" })}
                    >
                      <Archive />
                    </button>
                    <button
                      title="Follow up"
                      onClick={() =>
                        update(selected.id, { folder: "Follow up" })
                      }
                    >
                      <Clock3 />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => update(selected.id, { folder: "Trash" })}
                    >
                      <Trash2 />
                    </button>
                  </div>
                  <div>
                    <button
                      title="Star"
                      onClick={() =>
                        update(selected.id, { starred: !selected.starred })
                      }
                    >
                      <Star
                        className={
                          selected.starred
                            ? "starred [color:#e4a33e] [fill:#ffd36b]"
                            : ""
                        }
                      />
                    </button>
                    <button>
                      <MoreHorizontal />
                    </button>
                  </div>
                </header>
                <div className="reader-content [padding:24px_28px] [overflow-y:auto] [&>h2]:[margin:24px_0] [&>h2]:[font:700_24px/1.3_var(--font-sans)] mx-auto w-[calc(100%_-_48px)] max-w-[920px] py-8 pb-24">
                  <div className="reader-mailbox [display:flex] [align-items:center] [gap:8px] [&>span]:[width:28px] [&>span]:[height:28px] [&>span]:[border-radius:7px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:white] [&>span]:[font-weight:800] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px]">
                    <span style={{ background: selectedAccount?.colour }}>
                      {selectedAccount?.provider[0]}
                    </span>
                    <div>
                      <strong>{selectedAccount?.address}</strong>
                      <small>via {selectedAccount?.provider}</small>
                    </div>
                  </div>
                  <h2 className="my-5 text-[27px] leading-tight">
                    {selected.subject}
                  </h2>
                  <div className="reader-sender [display:grid] [grid-template-columns:38px_1fr_auto] [gap:10px] [align-items:center] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:13px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&_time]:[color:#9292a1] [&_time]:[font-size:11px]">
                    <span className="sender-avatar [width:38px] [height:38px] [border-radius:10px] [display:grid] [place-items:center] [color:#4a86ca] [background:#e7f2ff] [font-size:11px] [font-weight:800]">
                      {selected.from
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <div>
                      <strong>{selected.from}</strong>
                      <small>
                        {selected.email} · to {selectedAccount?.address}
                      </small>
                    </div>
                    <time>{selected.time}</time>
                  </div>
                  <div className="reader-body [padding:23px_0] [color:#555466] [font-size:14px] [line-height:1.75] text-sm leading-7">
                    <p>Hi team,</p>
                    <p>{selected.body}</p>
                    <p>
                      Kind regards,
                      <br />
                      <strong>{selected.from}</strong>
                    </p>
                    {selected.attachment && (
                      <button className="mail-attachment [width:min(430px,100%)] [padding:11px] [border:1px_solid_var(--border)] [border-radius:10px] [background:#f7f7f4] [display:grid] [grid-template-columns:34px_1fr_20px] [gap:9px] [align-items:center] [text-align:left] [&>svg:first-child]:[padding:7px] [&>svg:first-child]:[border-radius:8px] [&>svg:first-child]:[background:#ffe9ed] [&>svg:first-child]:[color:#b54c61] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px]">
                        <FileText />
                        <span>
                          <strong>{selected.attachment}</strong>
                          <small>PDF attachment · Virus scan complete</small>
                        </span>
                        <ArrowLeft />
                      </button>
                    )}
                  </div>
                </div>
                <div className="reader-reply [margin-top:auto] [padding:14px_20px] [border-top:1px_solid_var(--border)] [display:flex] [align-items:center] [gap:7px] [&_button]:[padding:9px_12px] [&_button]:[border:1px_solid_var(--border)] [&_button]:[border-radius:8px] [&_button]:[background:white] [&_button]:[display:flex] [&_button]:[gap:6px] [&_button]:[align-items:center] [&_button]:[font-size:12px] [&_svg]:[width:15px] [&_span]:[margin-left:auto] [&_span]:[color:#9292a1] [&_span]:[font-size:11px] sticky bottom-0 flex items-center gap-2 border-t border-line bg-white/95 px-6 py-3 backdrop-blur-lg">
                  <button onClick={() => setCompose(true)}>
                    <Reply />
                    Reply
                  </button>
                  <button onClick={() => setCompose(true)}>Forward</button>
                  <span>
                    Linked to <strong>{selected.category}</strong>
                  </span>
                </div>
              </>
            </article>
          )}
        </div>
      )}
      {notice && (
        <div className="action-toast [position:fixed] [right:28px] [bottom:28px] [z-index:110] [padding:13px_16px] [border-radius:10px] [background:#212a37] [color:white] [display:flex] [align-items:center] [gap:9px] [font-size:11px] [box-shadow:0_15px_45px_rgba(25,22,40,.25)] [&_svg]:[width:17px] [&_svg]:[color:#68d1a9] [&.error]:[background:#9f3045] [&.error_svg]:[color:#ffd7de]">
          <Check />
          {notice}
        </div>
      )}
      {compose && (
        <ComposeWindow
          accounts={accounts}
          selected={selected}
          tone={tone}
          refining={refining}
          refined={refined}
          draftBody={draftBody}
          onToneChange={setTone}
          onDraftChange={(draft) => {
            setDraftBody(draft);
            setRefined(false);
          }}
          onRefine={refineDraft}
          onClose={() => setCompose(false)}
          onSubmit={sendMessage}
        />
      )}
      {connect && (
        <ConnectMailboxModal
          onClose={() => setConnect(false)}
          onConnect={(provider) => {
            if (provider.mark === "@") {
              setAccounts((current) =>
                current.some((item) => item.id === "imap")
                  ? current
                  : [...current, createMockImapAccount(provider.colour)],
              );
            }
            setConnect(false);
            setNotice(`${provider.name} connection simulated successfully.`);
          }}
        />
      )}
    </section>
  );
}
