import { ArrowRight, Check, ChevronRight, Plus, Rocket, Target, Trophy } from "lucide-react";

const goals = [
  { title: "Complete positive behaviour support training", category: "Development", progress: 72, due: "30 Sep 2026", update: "Course modules 1–5 complete" },
  { title: "Improve shift-note completion time", category: "Performance", progress: 84, due: "31 Aug 2026", update: "Average completion is now 18 minutes" },
  { title: "Build community participation capability", category: "Service quality", progress: 55, due: "15 Nov 2026", update: "Two supported activities observed" },
];

export function PerformanceGoals() {
  const notify = (message: string) => window.dispatchEvent(new CustomEvent("provider-notice", { detail: message }));
  return (
    <section className="employee-goals-page min-h-[calc(100vh-64px)] bg-[#f7f8fa] px-[clamp(22px,4vw,58px)] py-9 max-md:px-5 max-md:py-6">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-7 flex items-end justify-between gap-5 max-sm:items-start max-sm:flex-col">
          <div>
            <span className="text-[10px] font-medium tracking-[.08em] text-[#1d4ed8] uppercase">My performance</span>
            <h1 className="mb-0 mt-2 text-[32px] font-semibold">Goals</h1>
            <p className="mb-0 mt-2 text-sm text-[#667085]">Set meaningful outcomes, record progress and prepare for your next check-in.</p>
          </div>
          <button className="primary-button" onClick={() => notify("New goal setup started.")}><Plus className="size-4" />Create goal</button>
        </header>

        <section className="mb-5 grid grid-cols-3 gap-3 max-md:grid-cols-1">
          <article className="rounded-[10px] border border-[#dfe3e8] bg-white p-4">
            <small className="text-[10px] text-[#667085]">Active goals</small>
            <strong className="mt-2 block text-[27px] font-semibold">3</strong>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#16815e]"><Check className="size-3" />All goals have updates</span>
          </article>
          <article className="rounded-[10px] border border-[#dfe3e8] bg-white p-4">
            <small className="text-[10px] text-[#667085]">Overall progress</small>
            <strong className="mt-2 block text-[27px] font-semibold">70%</strong>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e9edf2]"><i className="block h-full w-[70%] rounded-full bg-brand-600" /></div>
          </article>
          <article className="rounded-[10px] border border-[#dfe3e8] bg-white p-4">
            <small className="text-[10px] text-[#667085]">Next check-in</small>
            <strong className="mt-2 block text-[18px] font-semibold">28 August</strong>
            <span className="mt-2 block text-[10px] text-[#667085]">With Maya Singh · 10:00 am</span>
          </article>
        </section>

        <section className="overflow-hidden rounded-[10px] border border-[#dfe3e8] bg-white">
          <header className="flex items-center justify-between border-b border-[#e4e7eb] px-5 py-4">
            <div><h2 className="m-0 text-[16px] font-semibold">Current goals</h2><p className="mb-0 mt-1 text-xs text-[#667085]">Your goals for the current performance cycle.</p></div>
            <button className="border-0 bg-transparent text-xs text-[#1d4ed8]" onClick={() => notify("Goal history opened.")}>View history</button>
          </header>
          <div className="divide-y divide-[#edf0f3]">
            {goals.map((goal) => (
              <article className="grid grid-cols-[42px_minmax(0,1fr)_150px_20px] items-center gap-3 px-5 py-4 hover:bg-[#f9fbfd] max-sm:grid-cols-[38px_1fr_18px]" key={goal.title}>
                <span className="grid size-10 place-items-center rounded-[8px] bg-[#eaf2ff] text-[#1d4ed8]"><Target className="size-[18px]" /></span>
                <div><small className="text-[9px] font-medium tracking-[.05em] text-[#667085] uppercase">{goal.category}</small><strong className="mt-1 block text-[13px] font-medium">{goal.title}</strong><small className="mt-1 block text-[10px] text-[#667085]">{goal.update} · Due {goal.due}</small></div>
                <div className="max-sm:hidden"><span className="mb-1.5 flex justify-between text-[10px] text-[#667085]"><span>Progress</span><strong>{goal.progress}%</strong></span><div className="h-1.5 overflow-hidden rounded-full bg-[#e9edf2]"><i className="block h-full rounded-full bg-brand-600" style={{ width:`${goal.progress}%` }} /></div></div>
                <ChevronRight className="size-4 text-[#98a2b3]" />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-[1.4fr_.8fr] gap-4 max-md:grid-cols-1">
          <article className="rounded-[10px] border border-[#dfe3e8] bg-white p-5">
            <div className="flex items-start justify-between"><div><h2 className="m-0 text-[15px] font-semibold">Prepare for your check-in</h2><p className="mb-0 mt-1 text-xs text-[#667085]">Add a reflection while your progress is fresh.</p></div><Trophy className="size-5 text-[#d97706]" /></div>
            <button className="mt-5 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-xs text-[#1d4ed8]" onClick={() => notify("Reflection draft started.")}>Start reflection <ArrowRight className="size-3.5" /></button>
          </article>
          <article className="rounded-[10px] border border-[#dbe7f5] bg-[#f4f8fd] p-5">
            <Rocket className="size-5 text-[#1d4ed8]" /><h2 className="mb-0 mt-3 text-[15px] font-semibold">Need support?</h2><p className="mb-0 mt-1 text-xs leading-relaxed text-[#667085]">Ask your manager for feedback or help removing a blocker.</p>
          </article>
        </section>
      </div>
    </section>
  );
}
