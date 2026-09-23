import { useHookstate } from "@hookstate/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Archive,
  Bell,
  BriefcaseBusiness,
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Inbox,
  FileText,
  LayoutDashboard,
  Menu,
  Plug,
  Rocket,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  X,
} from "lucide-react";
import { Dashboard } from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import { Recruitment } from "./pages/Recruitment";
import { AnalyticsPage } from "./pages/Analytics";
import { CompliancePage } from "./pages/Compliance";
import { FinancePage } from "./pages/Finance";
import { IntegrationsPage } from "./pages/Integrations";
import { PeoplePage } from "./pages/People";
import { RosterPage } from "./pages/Roster";
import { ParticipantDirectory } from "./pages/ParticipantDirectory";
import { AccessManagement } from "./pages/AccessManagement";
import { InboxPage } from "./pages/UnifiedInbox";
import { ProviderIntelligence } from "./pages/ProviderIntelligence";
import { PerformanceGoals } from "./pages/PerformanceGoals";
import { ProviderHome } from "./pages/ProviderHome";
import { PublicPage, type PublicPageId } from "./pages/PublicPage";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { api, isMockMode } from "./api";
import type { Page } from "./types";
import { primaryNavigation } from "./utils/content";
import { canAccessPage } from "./config/product";

export function App() {
  const queryClient = useQueryClient();
  const session = useQuery({
    queryKey: ["me"],
    queryFn: api.me,
    retry: false,
    staleTime: 60_000,
  });
  const page = useHookstate<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("provider-ai-sidebar-collapsed") === "true",
  );
  const [commandOpen, setCommandOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(() => new URLSearchParams(window.location.search).get("assistant") === "full");
  const [assistantMode, setAssistantMode] = useState<"drawer" | "full">(() => new URLSearchParams(window.location.search).get("assistant") === "full" ? "full" : "drawer");
  const [rosterCreateRequest, setRosterCreateRequest] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [inboxNavOpen, setInboxNavOpen] = useState(false);
  const [inboxFolder, setInboxFolder] = useState("Inbox");
  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("provider-ai-font-size-v2") || "comfortable",
  );
  const publicPages = [
    "home",
    "auth",
    "about",
    "ndis",
    "ai",
    "security",
    "contact",
  ] as const;
  type PublicView = (typeof publicPages)[number];
  const readPublicView = (): PublicView => {
    const hash = window.location.hash.replace(/^#\/?/, "") as PublicView;
    return publicPages.includes(hash) ? hash : "home";
  };
  const [publicView, setPublicView] = useState<PublicView>(readPublicView);
  const navigatePublic = (next: PublicView) => {
    window.location.hash = next === "home" ? "/" : `/${next}`;
    setPublicView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
    localStorage.setItem("provider-ai-font-size-v2", fontSize);
  }, [fontSize]);
  useEffect(() => {
    localStorage.setItem(
      "provider-ai-sidebar-collapsed",
      String(sidebarCollapsed),
    );
  }, [sidebarCollapsed]);
  useEffect(() => {
    const navigate = (event: Event) => {
      const detail = (event as CustomEvent<Page | { page: Page; action?: string }>).detail;
      const next = typeof detail === "string" ? detail : detail.page;
      if (
        !primaryNavigation
          .flatMap((group) => group.items)
          .some((item) => item.id === next)
        || !canAccessPage(session.data?.role, next)
      )
        return;
      page.set(next);
      if (typeof detail !== "string" && detail.action === "create-shift") setRosterCreateRequest((value) => value + 1);
      setMobileOpen(false);
    };
    const announce = (event: Event) =>
      setNotice((event as CustomEvent<string>).detail);
    const assistant = () => { setAssistantMode("drawer"); setAssistantOpen(true); };
    window.addEventListener("provider-navigate", navigate);
    window.addEventListener("provider-notice", announce);
    window.addEventListener("provider-assistant", assistant);
    return () => {
      window.removeEventListener("provider-navigate", navigate);
      window.removeEventListener("provider-notice", announce);
      window.removeEventListener("provider-assistant", assistant);
    };
  }, [page, session.data?.role]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  useEffect(() => {
    const syncPublicRoute = () => setPublicView(readPublicView());
    window.addEventListener("hashchange", syncPublicRoute);
    return () => window.removeEventListener("hashchange", syncPublicRoute);
  });

  if (session.isLoading)
    return (
      <div className="app-loading [min-height:100vh] [display:grid] [place-content:center] [justify-items:center] [gap:10px] [background:#f3f3ef] [&_strong]:[font:700_18px_var(--font-sans)] [&_small]:[color:var(--muted)] grid min-h-dvh place-content-center justify-items-center gap-2.5 bg-[#f3f3ef]">
        <span className="grid size-9 place-items-center">
          <img
            className="size-8 object-contain"
            src="/brand/provider-ai-mark.png"
            alt=""
          />
        </span>
        <strong>Provider.ai</strong>
        <small>Preparing your workspace…</small>
      </div>
    );
  if (!session.data) {
    return publicView === "home" ? (
      <ProviderHome
        onGetStarted={() => { setAuthMode("register"); navigatePublic("auth"); }}
        onSignIn={() => { setAuthMode("login"); navigatePublic("auth"); }}
        onNavigate={navigatePublic}
      />
    ) : publicView === "auth" ? (
      <Auth initialMode={authMode} onBack={() => navigatePublic("home")} />
    ) : (
      <PublicPage
        page={publicView as PublicPageId}
        onNavigate={navigatePublic}
        onGetStarted={() => { setAuthMode("register"); navigatePublic("auth"); }}
        onSignIn={() => { setAuthMode("login"); navigatePublic("auth"); }}
      />
    );
  }
  const principal = session.data;
  const visibleNavigation = primaryNavigation
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPage(principal.role, item.id)),
    }))
    .filter((group) => group.items.length > 0);
  const initials = `${principal.firstName[0] ?? ""}${principal.lastName[0] ?? ""}`;

  const selectPage = (next: Page) => {
    if (!canAccessPage(principal.role, next)) {
      setNotice("You do not have access to that workspace.");
      return;
    }
    page.set(next);
    if (next === "inbox") {
      setInboxNavOpen(true);
      setSidebarCollapsed(false);
    }
    setMobileOpen(false);
  };
  return (
    <div
      className={`app-shell grid min-h-dvh bg-canvas text-[14px] transition-[grid-template-columns] duration-200 max-[820px]:block ${sidebarCollapsed ? "app-shell--collapsed min-[821px]:grid-cols-[82px_minmax(0,1fr)]" : "min-[821px]:grid-cols-[272px_minmax(0,1fr)]"}`}
    >
      <aside
        data-provider-shell
        className={`sidebar min-[821px]:[position:fixed] min-[821px]:[left:0] min-[821px]:[top:0] min-[821px]:[bottom:0] min-[821px]:[height:auto] min-[821px]:[min-height:0] min-[821px]:[padding-bottom:0] min-[821px]:[&_.profile-row]:[margin-bottom:0] min-[821px]:[&_.profile-row]:[padding-bottom:14px] [&_nav]:[min-height:0] [&_nav]:[overflow:auto] [&_nav]:[margin-right:-5px] [&_nav]:[padding-right:5px] max-[820px]:[position:fixed] max-[820px]:[left:0] max-[820px]:[transform:translateX(-105%)] max-[820px]:[transition:transform_.22s_ease] max-[820px]:[width:270px] max-[820px]:[box-shadow:10px_0_30px_rgba(22,20,42,.13)] fixed inset-y-0 left-0 z-30 flex h-dvh flex-col overflow-hidden border-r border-white/10 bg-[#fafaf8] py-[22px] shadow-none transition-all duration-200 min-[821px]:[translate:0] ${sidebarCollapsed ? "sidebar--collapsed w-[82px] px-3" : "w-[272px] px-[15px]"} ${mobileOpen ? "sidebar--open max-[820px]:[transform:translateX(0)]" : ""}`}
      >
        <div
          className={`brand flex min-h-10 items-center px-1 pb-4 font-display text-[17px] font-bold tracking-[-.04em] ${sidebarCollapsed ? "justify-between gap-1" : "gap-2.5"}`}
        >
          <span className={`grid shrink-0 place-items-center ${sidebarCollapsed ? "size-7" : "size-9"}`}>
            <img
              className={`${sidebarCollapsed ? "size-7" : "size-8"} object-contain`}
              src="/brand/provider-ai-mark-black-256.png"
              alt=""
            />
          </span>
          <span className={`brand-name ${sidebarCollapsed ? "hidden" : ""}`}>
            Provider<span className="text-brand-600">.ai</span>
          </span>
          <button
            className={`desktop-sidebar-toggle hidden place-items-center rounded-lg border-0 bg-canvas text-muted transition-colors hover:bg-brand-100 hover:text-ink lg:grid ${sidebarCollapsed ? "size-7" : "ml-auto size-8"}`}
            onClick={() => setSidebarCollapsed((value) => !value)}
            aria-label={
              sidebarCollapsed ? "Expand navigation" : "Collapse navigation"
            }
            title={
              sidebarCollapsed ? "Expand navigation" : "Collapse navigation"
            }
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <button
          className="mobile-close [display:none] max-[820px]:[display:grid] max-[820px]:[position:absolute] max-[820px]:[right:13px] max-[820px]:[top:15px] max-[820px]:[border:0] max-[820px]:[background:transparent] max-[820px]:[place-items:center] absolute right-3 top-4 grid size-9 place-items-center border-0 bg-transparent lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X />
        </button>
        <div
          className={`workspace-card grid min-h-14 shrink-0 items-center gap-2.5 rounded-xl border-0 bg-white/[.045] p-2.5 shadow-none ${sidebarCollapsed ? "grid-cols-1 place-items-center" : "grid-cols-[38px_1fr_auto]"}`}
        >
          <span className="workspace-avatar grid size-[38px] place-items-center rounded-lg bg-brand-100 text-[11px] font-medium tracking-[.03em] text-brand-800">
            {principal.organisation.name
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </span>
          <span className={`min-w-0 ${sidebarCollapsed ? "hidden" : ""}`}>
            <strong className="block truncate text-[13px] font-semibold tracking-[-.01em]">
              {principal.organisation.name}
            </strong>
            <small className="mt-0.5 block text-[11px] text-muted">
              Provider workspace
            </small>
          </span>
          <ChevronDown className={sidebarCollapsed ? "hidden" : ""} size={16} />
        </div>
        {page.value === "inbox" && inboxNavOpen ? (
          <nav
            className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"
            aria-label="Shared inbox navigation"
          >
            <div className="mb-5 flex items-center gap-2 border-b border-line px-1 pb-4">
              <button
                className="sidebar-back grid size-8 place-items-center rounded-[7px] border"
                onClick={() => setInboxNavOpen(false)}
                aria-label="Back to main navigation"
              >
                <ArrowLeft className="size-4" />
              </button>
              <strong className="min-w-0 flex-1 text-[14px] font-semibold">
                Shared inbox
              </strong>
            </div>
            <p className="mb-1.5 px-2 text-[9px] font-medium tracking-[.08em] text-[#7b8493] uppercase">
              Folders
            </p>
            <div className="grid gap-1">
              {[
                { label: "Inbox", icon: Inbox, count: "3" },
                { label: "Starred", icon: Star },
                { label: "Follow up", icon: Clock3, count: "2" },
                { label: "Drafts", icon: FileText, count: "1" },
                { label: "Sent", icon: Send },
                { label: "Archive", icon: Archive },
              ].map((item) => (
                <button
                  onClick={() => {
                    setInboxFolder(item.label);
                    window.dispatchEvent(
                      new CustomEvent("provider-inbox-folder", {
                        detail: item.label,
                      }),
                    );
                  }}
                  className={`flex min-h-10 w-full items-center gap-2.5 rounded-[7px] border-0 px-2.5 text-left text-xs ${item.label === inboxFolder ? "active" : ""}`}
                  key={item.label}
                >
                  <item.icon className="size-[17px]" />
                  <span>{item.label}</span>
                  {item.count && (
                    <em className="ml-auto grid min-h-5 min-w-5 place-items-center rounded-full bg-brand-100 px-1 text-[9px] text-brand-700 not-italic">
                      {item.count}
                    </em>
                  )}
                </button>
              ))}
            </div>
            <div className="inbox-info-card mt-7 rounded-[9px] border p-3">
              <strong className="block text-xs font-medium">
                Connected mailboxes
              </strong>
              <small className="mt-1 block text-[10px] leading-relaxed text-[#72756d]">
                Three accounts are secure and up to date.
              </small>
            </div>
          </nav>
        ) : (
          <nav
            className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1"
            aria-label="Primary navigation"
          >
            {visibleNavigation.map((group) => (
              <div
                className="nav-group [&+.nav-group]:[margin-top:18px] [&_.nav-label]:[margin-top:0] mt-4 first:mt-0"
                key={group.label}
              >
                <p
                  className={`nav-label mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[.09em] text-[#8b8b9d] ${sidebarCollapsed ? "hidden" : ""}`}
                >
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`my-0.5 flex min-h-10 w-full items-center gap-2.5 rounded-lg border-0 px-2.5 text-left text-xs font-medium transition-colors ${page.value === item.id ? "active" : ""}`}
                    onClick={() => selectPage(item.id)}
                  >
                    <item.icon size={18} />
                    <span className={sidebarCollapsed ? "hidden" : ""}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <em
                        className={`ml-auto grid min-h-4 min-w-4 place-items-center rounded-full bg-brand-100 px-1 text-[8px] text-brand-700 not-italic ${sidebarCollapsed ? "hidden" : ""}`}
                      >
                        {item.badge}
                      </em>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        )}
        <div
          className="hidden!"
        >
          <span className="float-left mr-1.5 text-brand-700">
            <Sparkles size={17} />
          </span>
          <strong className="font-display text-[11px] font-bold">
            Provider intelligence
          </strong>
          <p className="clear-both my-2.5 text-[10px] leading-relaxed text-[#79748f]">
            Ask about participants, rosters, compliance or business performance.
          </p>
          <button
            className="w-full rounded-lg border-0 bg-white p-2 text-[10px] font-bold text-brand-700 shadow-sm"
            onClick={() => setAssistantOpen(true)}
          >
            Open assistant
          </button>
        </div>
        <button
          className={`profile-row mt-3 grid w-full shrink-0 items-center gap-2 border-0 border-t border-line bg-transparent px-2 pb-3 pt-3 text-left ${sidebarCollapsed ? "grid-cols-1 place-items-center" : "grid-cols-[34px_1fr_auto]"}`}
          onClick={() => logout.mutate()}
          title="Sign out"
        >
          <span className="profile-avatar grid size-8 place-items-center rounded-full bg-[#222a36] text-[10px] font-bold text-white">
            {initials}
          </span>
          <span className={sidebarCollapsed ? "hidden" : ""}>
            <strong className="block text-[11px] font-semibold">
              {principal.firstName} {principal.lastName}
            </strong>
            <small className="mt-0.5 block text-[9px] capitalize text-[#9292a2]">
              {principal.role.replaceAll("_", " ")}
            </small>
          </span>
          <ChevronDown className={sidebarCollapsed ? "hidden" : ""} size={16} />
        </button>
      </aside>
      {mobileOpen && (
        <button
          className="scrim [display:none] max-[820px]:[display:block] max-[820px]:[position:fixed] max-[820px]:[inset:0] max-[820px]:[z-index:15] max-[820px]:[border:0] max-[820px]:[background:rgba(25,23,40,.32)] max-[820px]:[backdrop-filter:blur(2px)] fixed inset-0 z-20 border-0 bg-[#171e28]/35 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <main className="min-w-0 min-[821px]:col-start-2">
        {isMockMode && <div role="status" className="border-b border-line bg-brand-50 px-5 py-2 text-center text-xs leading-5 text-brand-800">Demo workspace · Fictional people and activity. Changes stay in this browser.</div>}
        <header className="topbar max-[820px]:[padding:0_18px] max-[570px]:[&_.search]:[width:auto] max-[570px]:[&_.search]:[flex:1] sticky top-0 z-10 flex h-[73px] items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur-xl lg:px-8">
          <button
            className="mobile-menu [display:none] max-[820px]:[display:grid] grid size-10 place-items-center rounded-lg border border-line bg-white lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <button
            className="search max-[820px]:[margin-left:10px] max-[820px]:[&_kbd]:[display:none] [&_input]:[font-size:14px] global-search [border:0] [background:transparent] [text-align:left] [cursor:pointer] [&_span]:[flex:1] [&_span]:[color:#9292a2] [&_span]:[font-size:12.5px] flex h-10 w-full max-w-[430px] items-center gap-2 border-0 bg-transparent text-left text-[#9292a2]"
            onClick={() => setCommandOpen(true)}
          >
            <Search size={18} />
            <span className="flex-1 text-sm">
              Search participants, people, shifts or actions…
            </span>
            <kbd className="rounded-md border border-line bg-[#fafbfd] px-1.5 py-1 text-[10px]">
              ⌘ K
            </kbd>
          </button>
          <div className="topbar-actions max-[570px]:[&_.icon-button]:[display:none] flex items-center gap-2.5">
            <button
              className="icon-button grid size-10 place-items-center rounded-lg border border-line bg-white"
              onClick={() => setSettingsOpen(true)}
              aria-label="Display settings"
            >
              <Settings2 size={19} />
            </button>
            <button
              className="icon-button relative grid size-10 place-items-center rounded-lg border border-line bg-white"
              aria-label="Notifications"
              onClick={() =>
                setNotice(
                  "You’re all caught up. No new critical notifications.",
                )
              }
            >
              <Bell size={20} />
              <i className="absolute right-2 top-2 size-1.5 rounded-full border-2 border-white bg-[#f05d69] box-content" />
            </button>
          </div>
        </header>
        <PageContent page={page.value} role={principal.role} onNavigate={selectPage} rosterCreateRequest={rosterCreateRequest} />
      </main>
      {commandOpen && (
        <CommandPalette
          navigation={visibleNavigation}
          onClose={() => setCommandOpen(false)}
          onSelect={(next) => {
            selectPage(next);
            setCommandOpen(false);
          }}
        />
      )}
      {assistantOpen && (
        <ProviderIntelligence
          onClose={() => setAssistantOpen(false)}
          onNavigate={selectPage}
          mode={assistantMode}
          onToggleMode={() => setAssistantMode((value) => value === "drawer" ? "full" : "drawer")}
          onOpenNewTab={() => window.open(`${window.location.origin}${window.location.pathname}?assistant=full`, "_blank", "noopener,noreferrer")}
        />
      )}
      {notice && (
        <div className="action-toast" role="status">
          <Check className="size-4 text-[#70dfb1]" />
          {notice}
        </div>
      )}
      {settingsOpen && (
        <div
          className="modal-backdrop [position:fixed] [inset:0] [z-index:50] [padding:24px] [display:grid] [place-items:center] [background:rgba(28,26,43,.48)] [backdrop-filter:blur(5px)]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false);
          }}
        >
          <section className="modal-card [width:min(100%,560px)] [max-height:calc(100vh_-_48px)] [overflow:auto] [position:relative] [padding:27px] [border-radius:17px] [background:white] [box-shadow:0_24px_70px_rgba(24,22,39,.24)] [&_h2]:[margin:0] [&_h2]:[font:700_20px_var(--font-sans)] [&_>_p]:[margin:6px_0_23px] [&_>_p]:[color:#8d8d9c] [&_>_p]:[font-size:10.5px] w-[min(560px,calc(100%_-_30px))]">
            <button
              className="modal-close [position:absolute] [right:18px] [top:18px] [width:34px] [height:34px] [display:grid] [place-items:center] [border:1px_solid_var(--border)] [border-radius:9px] [background:white] [cursor:pointer]"
              onClick={() => setSettingsOpen(false)}
            >
              <X />
            </button>
            <span className="grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-700">
              <Settings2 />
            </span>
            <h2 className="mt-[15px] font-display text-[22px] font-bold">
              Display and accessibility
            </h2>
            <p className="text-sm leading-relaxed">
              Choose the interface size that is most comfortable for you. This
              preference is saved on this device.
            </p>
            <div className="my-5 grid gap-2">
              {[
                {
                  id: "compact",
                  title: "Small",
                  sample: "Aa",
                  detail: "Smaller interface with more content visible",
                },
                {
                  id: "comfortable",
                  title: "Comfortable",
                  sample: "Aa",
                  detail: "Recommended readable size",
                },
                {
                  id: "large",
                  title: "Large",
                  sample: "Aa",
                  detail: "10% larger interface",
                },
                {
                  id: "extra-large",
                  title: "Extra large",
                  sample: "Aa",
                  detail: "20% larger interface",
                },
              ].map((option) => (
                <button
                  className={`grid grid-cols-[48px_1fr_22px] items-center gap-3 rounded-xl border p-3 text-left ${fontSize === option.id ? "border-brand-400 bg-brand-50" : "border-line bg-white"}`}
                  onClick={() => setFontSize(option.id)}
                  key={option.id}
                >
                  <span
                    className={`grid size-12 place-items-center rounded-[10px] bg-brand-100 font-display font-bold text-brand-700 ${option.id === "compact" ? "text-base" : option.id === "comfortable" ? "text-lg" : option.id === "large" ? "text-[21px]" : "text-2xl"}`}
                  >
                    {option.sample}
                  </span>
                  <div>
                    <strong className="block text-[15px]">
                      {option.title}
                    </strong>
                    <small className="mt-1 block text-xs text-[#858594]">
                      {option.detail}
                    </small>
                  </div>
                  {fontSize === option.id && (
                    <Check className="text-brand-600" />
                  )}
                </button>
              ))}
            </div>
            <button
              className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] ml-auto"
              onClick={() => setSettingsOpen(false)}
            >
              Save display preference
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function PageContent({ page, role, onNavigate, rosterCreateRequest }: { page: Page; role: string; onNavigate: (page: Page) => void; rosterCreateRequest: number }) {
  switch (page) {
    case "dashboard":
      return <Dashboard />;
    case "participants":
      return <ParticipantDirectory />;
    case "roster":
      return <RosterPage createRequest={rosterCreateRequest} />;
    case "people":
      return <PeoplePage />;
    case "recruitment":
      return <Recruitment />;
    case "goals":
      return <PerformanceGoals />;
    case "compliance":
      return <CompliancePage />;
    case "finance":
      return <FinancePage />;
    case "analytics":
      return <AnalyticsPage />;
    case "reports":
      return <Reports />;
    case "inbox":
      return <InboxPage />;
    case "integrations":
      return <IntegrationsPage />;
    case "access":
      return <AccessManagement />;
    case "settings":
      return <Settings role={role} onOpenRoles={() => onNavigate("access")} />;
  }
}
function CommandPalette({
  onClose,
  onSelect,
  navigation,
}: {
  onClose: () => void;
  onSelect: (page: Page) => void;
  navigation: typeof primaryNavigation;
}) {
  const [query, setQuery] = useState("");
  const actions = navigation
    .flatMap((group) => group.items)
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center bg-[#191f28]/45 pt-[12vh] backdrop-blur-[5px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="h-max w-[min(590px,calc(100%_-_32px))] overflow-hidden rounded-2xl border border-white/30 bg-white shadow-[0_30px_90px_rgba(20,18,36,.3)]">
        <label className="flex h-[57px] items-center gap-2.5 border-b border-line px-[17px] text-[#898998]">
          <Search size={19} />
          <input
            className="flex-1 border-0 text-xs outline-none"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Provider.ai…"
          />
          <kbd className="rounded-md border border-line bg-[#fafbfd] px-1.5 py-1 text-[10px]">
            ESC
          </kbd>
        </label>
        <p className="mx-[17px] mb-1.5 mt-3 text-[7px] font-extrabold uppercase tracking-[.8px] text-[#aaaab6]">
          Navigate
        </p>
        {actions.map((item) => (
          <button
            className="mx-2 my-0.5 grid w-[calc(100%_-_16px)] grid-cols-[31px_1fr_auto_20px] items-center gap-2 rounded-lg border-0 bg-white p-2 text-left hover:bg-brand-50"
            key={item.id}
            onClick={() => onSelect(item.id)}
          >
            <span className="grid size-[31px] place-items-center rounded-lg bg-brand-100 text-brand-700">
              <item.icon size={17} />
            </span>
            <strong className="text-[9px]">{item.label}</strong>
            <small className="text-[7.5px] text-[#9999a7]">
              Open workspace
            </small>
            <em className="text-[8px] not-italic text-[#aaaab6]">↵</em>
          </button>
        ))}
        <div className="mt-2.5 flex items-center gap-2 border-t border-line bg-[#f9fcff] px-[17px] py-3 text-[8px] text-[#7a758c]">
          <Sparkles className="text-brand-700" size={15} />
          Try “show open shifts” or “which credentials expire soon?”
        </div>
      </div>
    </div>
  );
}
