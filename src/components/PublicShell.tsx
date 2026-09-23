import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";

export type PublicDestination = "home" | "about" | "ndis" | "ai" | "security" | "contact";
export const marketingWidth = "mx-auto w-full max-w-[1240px] px-6 sm:px-10";
export const marketingAction = "inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-brand-700";
export const marketingHeading = "text-[clamp(32px,4vw,48px)] font-medium leading-[1.12] tracking-[-.045em] text-ink";

export function Brand({ onClick }: { onClick?: () => void }) {
  return <button onClick={onClick} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[21px] font-semibold tracking-[-.06em] text-ink" aria-label="Provider.ai home"><img src="/brand/provider-ai-mark-black-256.png" alt="" className="size-8 object-contain" />Provider.ai</button>;
}

export function PublicShell({ children, page = "home", onNavigate, onGetStarted, onSignIn }: {
  children: ReactNode; page?: PublicDestination; onNavigate: (page: PublicDestination) => void; onGetStarted: () => void; onSignIn: () => void;
}) {
  const [open, setOpen] = useState(false);
  const go = (destination: PublicDestination) => { setOpen(false); onNavigate(destination); };
  return <div className="min-h-screen bg-canvas font-sans text-ink selection:bg-brand-200">
    <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white p-4 focus:not-sr-only">Skip to content</a>
    <header className={`${marketingWidth} relative z-30`}><div className="flex h-24 items-center justify-between gap-5 border-b border-line">
      <Brand onClick={() => go("home")} />
      <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
        {([["Product", "ai"], ["For NDIS providers", "ndis"], ["Our story", "about"], ["Security", "security"]] as const).map(([label, destination]) => <button key={destination} aria-current={page === destination ? "page" : undefined} onClick={() => go(destination)} className={`min-h-11 text-sm transition-colors hover:text-ink ${page === destination ? "text-ink" : "text-muted"}`}>{label}</button>)}
      </nav>
      <div className="hidden items-center gap-5 lg:flex"><button onClick={onSignIn} className="min-h-11 text-sm">Sign in</button><button onClick={onGetStarted} className={marketingAction}>Explore Provider.ai <ArrowUpRight size={16} /></button></div>
      <button className="grid size-11 place-items-center rounded-full border border-line lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="public-menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    </div>{open && <nav id="public-menu" aria-label="Mobile navigation" className="absolute inset-x-6 top-24 grid gap-1 rounded-xl border border-line bg-white p-5 shadow-float lg:hidden">{([["Product", "ai"], ["For NDIS providers", "ndis"], ["Our story", "about"], ["Security", "security"]] as const).map(([label, destination]) => <button onClick={() => go(destination)} key={destination} className="min-h-11 px-3 text-left text-sm">{label}</button>)}<button onClick={onSignIn} className="min-h-11 px-3 text-left text-sm">Sign in</button><button onClick={onGetStarted} className={`${marketingAction} mt-2`}>Explore Provider.ai <ArrowUpRight size={16} /></button></nav>}</header>
    <main id="main-content">{children}</main>
    <footer className={`${marketingWidth} pb-7 pt-16`}><div className="grid gap-10 pb-14 sm:grid-cols-[2fr_1fr_1fr]"><div><Brand onClick={() => go("home")} /><p className="mt-4 max-w-[290px] text-sm leading-7 text-muted">One workspace to run your NDIS business.<br />Built for small and medium providers.</p></div><div className="grid content-start text-sm"><h2 className="mb-3 text-sm font-medium text-ink">The product</h2><button onClick={() => go("ai")} className="min-h-11 text-left text-muted">What’s included</button><button onClick={() => go("ndis")} className="min-h-11 text-left text-muted">For NDIS providers</button><button onClick={onSignIn} className="min-h-11 text-left text-muted">Sign in</button></div><div className="grid content-start text-sm"><h2 className="mb-3 text-sm font-medium text-ink">Provider.ai</h2><button onClick={() => go("about")} className="min-h-11 text-left text-muted">Our story</button><button onClick={() => go("security")} className="min-h-11 text-left text-muted">Trust & security</button><button onClick={() => go("contact")} className="min-h-11 text-left text-muted">Contact</button></div></div><div className="flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-xs text-muted"><p>© {new Date().getFullYear()} Provider.ai</p><p>Built around Australian care.</p></div></footer>
  </div>;
}
