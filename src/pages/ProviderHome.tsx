import {
  ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCheck,
  CircleDollarSign, ClipboardCheck, FileText, Menu, Minus,
  Plus, ShieldCheck, UsersRound, X, type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { PublicShell, marketingWidth, marketingHeading, marketingAction } from "../components/PublicShell";

type Destination = "about" | "ndis" | "ai" | "security" | "contact";
const wrap = marketingWidth;
const primary = marketingAction;
const heading = marketingHeading;

const journey: { label: string; title: string; description: string; icon: LucideIcon; records: string[]; next: string }[] = [
  { label: "Onboarding", title: "Set your provider up from the start.", description: "Bring your organisation, services and team into one workspace. Set up access and the initial records your team needs before the first shift.", icon: ClipboardCheck, records: ["Organisation & services", "Team invitations & access", "Initial participant records"], next: "Bring your people into the workspace" },
  { label: "Participant", title: "Start with the person.", description: "Bring the participant’s plan, goals, support needs and agreement into one record.", icon: UsersRound, records: ["Participant profile", "Plan & support goals", "Service agreement"], next: "Plan the right support" },
  { label: "Roster", title: "Put support in place.", description: "See the participant, assigned worker and shift details together so your team can review the plan.", icon: CalendarDays, records: ["Participant & location", "Worker availability", "Scheduled support"], next: "Review the shift" },
  { label: "Delivery", title: "Keep the detail with the day.", description: "Bring notes and delivered support into the same operational picture for your team to review.", icon: ClipboardCheck, records: ["Shift details", "Support notes", "Timesheet review"], next: "Review the delivery record" },
  { label: "Finance", title: "Make the work visible.", description: "Review timesheets, invoices and claims alongside the service information your team needs.", icon: CircleDollarSign, records: ["Timesheet approval", "Invoice details", "Export & reconciliation"], next: "Open the finance workspace" },
  { label: "Evidence", title: "Know where the record lives.", description: "Give your team a clearer place to review documents, exceptions and the evidence behind their work.", icon: ShieldCheck, records: ["Supporting documents", "Quality review", "Activity history"], next: "Review the evidence" },
];
const modules: { number: string; title: string; icon: LucideIcon; description: string; details: string }[] = [
  { number: "01", title: "Provider onboarding", icon: ClipboardCheck, description: "Start with a properly organised workspace.", details: "Bring your organisation, services, team access and initial records together before the first shift." },
  { number: "02", title: "Participants", icon: UsersRound, description: "Keep every participant’s information together.", details: "Profiles, plans, goals, service agreements and support needs, without searching across separate records." },
  { number: "03", title: "Workforce & roster", icon: CalendarDays, description: "Get your people ready for the day.", details: "Worker records, credentials, availability, recruitment and your daily service schedule." },
  { number: "04", title: "Finance", icon: CircleDollarSign, description: "Keep delivery, billing and payroll in view.", details: "Review timesheets, prepare payroll, track invoices and manage claim work alongside your services." },
  { number: "05", title: "Quality & evidence", icon: ShieldCheck, description: "See what needs attention before it gets lost.", details: "Incidents, compliance tasks, supporting documents and evidence behind everyday work." },
  { number: "06", title: "Reports & administration", icon: FileText, description: "Understand and manage your operation.", details: "Operational reports, organisation settings, roles and access, with a clearer view of the details." },
];
const questions = [
  { question: "What does Provider.ai actually do?", answer: "Provider.ai brings participant records, workforce, rostering, finance and quality work into a shared workspace for NDIS providers. It helps your team find the context behind everyday work without jumping between separate spreadsheets and tools." },
  { question: "Who is it designed for?", answer: "Small and medium Australian NDIS providers, especially community participation and in-home support teams. Owners, service managers, roster coordinators, administrators and finance teams each have a role in the workspace." },
  { question: "Does it replace our accounting or payroll software?", answer: "Provider.ai is the operational workspace. Accounting and certified payroll systems remain responsible for their specialist work. Connection availability depends on what is configured and supported for your organisation." },
  { question: "What role does AI play?", answer: "The product direction is contextual help grounded in the records your team can access. People remain responsible for reviewing suggestions and decisions. The demonstration workspace contains illustrative AI behaviour; it is not a production decision-making service." },
  { question: "Can I try it before using it with my team?", answer: "You can explore the current workspace and its available workflows. Demo environments use fictional records and are clearly labelled. A production rollout requires the relevant data, permissions and operational controls to be configured." },
];

export function ProviderHome({ onGetStarted, onSignIn, onNavigate }: {
  onGetStarted: () => void;
  onSignIn: () => void;
  onNavigate: (page: Destination) => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [question, setQuestion] = useState<number | null>(0);
  const step = journey[activeStep];
  const navigate = onNavigate;

  return <PublicShell onGetStarted={onGetStarted} onSignIn={onSignIn} onNavigate={page => page === "home" ? window.scrollTo({ top: 0, behavior: "smooth" }) : onNavigate(page)}>
      <section className={`${wrap} pb-16 pt-14 text-center sm:pt-20`}>
        <p className="mx-auto mb-7 flex w-fit items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-xs text-muted"><span className="size-1.5 rounded-full bg-brand-600" /> For small & medium NDIS providers</p>
        <h1 className="mx-auto max-w-[1000px] text-[clamp(42px,6.2vw,78px)] font-medium leading-[1.04] tracking-[-.065em] text-ink">Run your NDIS business.<br /><span className="text-brand-700">From one place.</span></h1>
        <p className="mx-auto mt-7 max-w-[620px] text-[16px] leading-7 text-muted sm:text-[18px] sm:leading-8">Participants. Staff. Rosters. Compliance. Billing.<br className="hidden sm:block" /> Provider.ai brings your everyday operations together, so you can spend less time managing admin and more time delivering care.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4"><button onClick={onGetStarted} className={`${primary} px-7`}>Explore the platform <ArrowUpRight size={17} /></button><a href="#product" className="inline-flex min-h-12 items-center gap-3 rounded-full border border-line bg-white px-6 text-sm">See what’s included <ArrowDown size={15} /></a></div>
        <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted">{["One connected workspace", "Built around NDIS operations", "Room for your team to grow"].map(item => <span key={item} className="inline-flex items-center gap-1.5"><Check size={13} className="text-brand-700" />{item}</span>)}</div>
        <div className="relative mt-12 overflow-hidden rounded-[20px] border border-brand-200 bg-brand-100 p-3 pb-0 text-left sm:mt-14 sm:p-6 sm:pb-0">
          <div className="mb-4 flex items-center justify-between gap-3 px-1"><span className="flex items-center gap-2 text-xs font-medium text-brand-900"><span className="size-2 rounded-full bg-brand-600" /> Meet your new working day</span><span className="text-[10px] text-brand-800">Actual product · Demo data</span></div>
          <div className="max-h-[540px] overflow-hidden rounded-t-xl border border-line bg-white"><img src="/product/workspace.png" alt="The Provider.ai workspace: today's shifts, workforce readiness, claims, roster and attention items in one dashboard." width="1440" height="1000" className="block h-auto w-full min-w-[650px] origin-top-left max-sm:min-w-0" /></div>
        </div>
      </section>
      <section className={wrap}>
        <div className="grid gap-6 border-y border-line py-7 sm:grid-cols-[1fr_2fr]"><p className="max-w-[200px] text-sm leading-6 text-muted">Built for your day-to-day.<br /><span className="text-ink">Not another tool to work around.</span></p><div className="grid grid-cols-2 items-center gap-x-8 gap-y-4 sm:grid-cols-4">{[[UsersRound, "Participant context"], [CalendarDays, "Daily operations"], [CircleDollarSign, "Finance reviews"], [ShieldCheck, "Connected evidence"]].map(([Icon, label]) => <span key={String(label)} className="flex items-center gap-2 text-xs">{typeof Icon !== "string" && <Icon size={17} strokeWidth={1.4} />}{String(label)}</span>)}</div></div>
      </section>

      <section id="product" className={`${wrap} scroll-mt-8 py-20 sm:py-24`}>
        <div className="mb-10 grid items-end gap-6 md:grid-cols-[1.2fr_1fr]"><div><p className="mb-4 text-xs text-muted">Meet Provider.ai</p><h2 className={heading}>Everything you need.<br />Without the everyday juggling.</h2></div><p className="max-w-[360px] text-sm leading-7 text-muted md:justify-self-end">From your first participant to a growing team, manage the work that keeps your provider running. Start with a clear overview, then open the detail when you need it.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{modules.map(item => <article key={item.number} className="rounded-xl border border-line bg-white p-7 sm:p-8"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-canvas"><item.icon size={21} strokeWidth={1.4} /></span><span className="text-xs text-muted">{item.number}</span></div><h3 className="mb-3 mt-7 text-xl font-normal tracking-[-.03em] text-ink">{item.title}</h3><p className="text-sm text-ink">{item.description}</p><p className="mt-2 max-w-[360px] text-xs leading-6 text-muted">{item.details}</p></article>)}</div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 bg-white py-20 sm:py-24"><div className={wrap}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-4 text-xs text-muted">Follow the work</p><h2 className={heading}>One journey. A clearer view.</h2></div><p className="max-w-[290px] text-xs leading-6 text-muted">From onboarding to everyday operations.<br />Follow the product journey with example records.</p></div>
        <div role="tablist" aria-label="Care workflow" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{journey.map((item, index) => <button role="tab" tabIndex={activeStep === index ? 0 : -1} onKeyDown={event => {
          const next = event.key === "ArrowRight" ? (index + 1) % journey.length : event.key === "ArrowLeft" ? (index + journey.length - 1) % journey.length : event.key === "Home" ? 0 : event.key === "End" ? journey.length - 1 : null;
          if (next !== null) { event.preventDefault(); setActiveStep(next); document.getElementById(`workflow-tab-${next}`)?.focus(); }
        }} key={item.label} id={`workflow-tab-${index}`} aria-selected={activeStep === index} aria-controls="workflow-panel" onClick={() => setActiveStep(index)} className={`flex min-h-14 items-center gap-3 rounded-lg border px-4 py-3 text-left text-xs transition-colors ${activeStep === index ? "border-brand-600 bg-brand-50 text-brand-800" : "border-line bg-white text-muted hover:bg-canvas"}`}><span className="text-[10px] opacity-70">0{index + 1}</span>{item.label}</button>)}</div>
        <div id="workflow-panel" role="tabpanel" aria-labelledby={`workflow-tab-${activeStep}`} className="mt-5 grid gap-8 rounded-xl bg-canvas p-7 sm:p-10 md:grid-cols-[1fr_1fr] md:gap-16"><div><span className="mb-6 grid size-12 place-items-center rounded-full bg-white"><step.icon size={21} strokeWidth={1.4} /></span><h3 className="text-[30px] font-normal leading-tight tracking-[-.035em] text-ink">{step.title}</h3><p className="mt-4 max-w-[350px] text-sm leading-7 text-muted">{step.description}</p><button onClick={onGetStarted} className="mt-6 inline-flex min-h-11 items-center gap-3 text-xs font-medium text-brand-700">Explore the workspace <ArrowUpRight size={16} /></button></div><div className="self-center rounded-xl border border-line bg-white p-6"><div className="mb-5 flex items-center justify-between border-b border-line pb-4"><span className="text-xs font-medium">{step.label} workspace</span><FileText size={16} className="text-muted" /></div>{step.records.map((record, index) => <div key={record} className="flex min-h-12 items-center gap-3 text-xs"><span className="grid size-6 place-items-center rounded-full border border-line text-[10px] text-muted">{index + 1}</span>{record}</div>)}<div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">{step.next}<ArrowRight size={15} /></div></div></div>
      </div></section>

      <section className={`${wrap} grid gap-10 py-20 sm:py-24 md:grid-cols-2 md:gap-16`}>
        <div><p className="mb-4 text-xs text-muted">Thoughtfully built around care</p><h2 className={heading}>Your team’s judgment.<br />Always at the centre.</h2><p className="mt-6 max-w-[400px] text-sm leading-7 text-muted">Clear records and useful context help people make better-informed decisions. Provider.ai keeps the everyday work visible, with assistance that supports your team.</p><button onClick={() => navigate("security")} className="mt-6 inline-flex min-h-11 items-center gap-3 text-xs font-medium text-brand-700">Our approach to trust & security <ArrowUpRight size={16} /></button></div>
        <div className="divide-y divide-line">{[[UsersRound, "A workspace for your role", "Keep the navigation focused on the work your team members are permitted to access."], [CheckCheck, "People review the important details", "Bring exceptions and approvals into view, so your team can review the source before acting."], [ShieldCheck, "Evidence has a place", "Keep records and operational context together, instead of reconstructing the story later."]].map(([Icon, title, copy]) => <div key={String(title)} className="flex gap-4 py-6 first:pt-0"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">{typeof Icon !== "string" && <Icon size={18} strokeWidth={1.4} />}</span><div><h3 className="text-sm font-medium text-ink">{String(title)}</h3><p className="mt-2 text-xs leading-6 text-muted">{String(copy)}</p></div></div>)}</div>
      </section>

      <section className={`${wrap} pb-20`}><div className="grid gap-9 border-t border-line pt-16 md:grid-cols-[.7fr_1.3fr]"><div><p className="mb-4 text-xs text-muted">Before you get started</p><h2 className={heading}>A little more<br />clarity.</h2><button onClick={() => navigate("contact")} className="mt-6 inline-flex min-h-11 items-center gap-3 text-xs underline underline-offset-4">Get in touch <ArrowUpRight size={15} /></button></div><div className="space-y-2">{questions.map((item, index) => <div className="rounded-xl bg-white" key={item.question}><h3><button id={`question-${index}`} aria-expanded={question === index} aria-controls={`answer-${index}`} onClick={() => setQuestion(question === index ? null : index)} className="flex min-h-16 w-full items-center justify-between gap-5 px-6 py-5 text-left text-sm font-normal text-ink">{item.question}{question === index ? <Minus className="size-4 shrink-0" /> : <Plus className="size-4 shrink-0" />}</button></h3><div id={`answer-${index}`} role="region" aria-labelledby={`question-${index}`} hidden={question !== index} className="px-6 pb-6 text-xs leading-7 text-muted">{item.answer}</div></div>)}</div></div></section>

      <section className="bg-brand-100 py-16 sm:py-20"><div className={`${wrap} flex flex-wrap items-center justify-between gap-8`}><div><p className="mb-4 text-xs text-brand-800">Less scattered work. More connected care.</p><h2 className={heading}>See your day differently.</h2><p className="mt-4 max-w-[480px] text-sm leading-7 text-muted">Explore how your people, services and everyday operations can come together in Provider.ai.</p></div><button onClick={onGetStarted} className={primary}>Explore the workspace <ArrowUpRight size={17} /></button></div></section>
    </PublicShell>;
}
