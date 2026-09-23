import { Brand } from "../../components/PublicShell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  UsersRound,
  ClipboardCheck,
  LoaderCircle,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { api, isMockMode } from "../../api";

export function Auth({ onBack, initialMode = "login" }: { onBack?: () => void; initialMode?: "register" | "login" }) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const mutation = useMutation({
    mutationFn: (values: Record<string, string>) =>
      mode === "register"
        ? api.register({
            organisationName: values.organisationName,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          })
        : api.login({ email: values.email, password: values.password }),
    onSuccess: (principal) => queryClient.setQueryData(["me"], principal),
    onError: (problem) =>
      setError(
        problem instanceof Error
          ? problem.message
          : "Unable to continue. Please try again.",
      ),
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    ) as Record<string, string>;
    mutation.mutate(data);
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1.1fr]">
      <section className="flex min-w-0 flex-col px-6 py-6 sm:px-12 lg:px-14 lg:py-8 xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <Brand onClick={onBack} />
          {onBack && <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 text-xs text-muted transition-colors hover:text-ink"><ArrowLeft size={15} /><span>Back to home</span></button>}
        </header>

        <div className="mx-auto my-auto w-full max-w-[400px] py-12 sm:py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-copy">
            <span className="size-1.5 rounded-full bg-brand-600" />Your care. Connected.
          </div>
          <h1 className="text-[38px] font-medium leading-[1.12] tracking-[-.045em] sm:text-[44px]">{mode === "login" ? "Good to have you back." : "Make room for better care."}</h1>
          <p className="mb-8 mt-4 max-w-[350px] text-sm leading-6 text-muted">{mode === "login" ? "Sign in to your workspace. Your people, plans and day ahead are all here." : "Create a workspace that brings your team and NDIS operations together."}</p>

          <form key={mode} onSubmit={submit} className="grid gap-5" aria-label={mode === "login" ? "Sign in" : "Create workspace"} aria-busy={mutation.isPending}>
            <fieldset disabled={mutation.isPending} className="grid min-w-0 gap-5 disabled:opacity-70">
              {mode === "register" && <>
                <label className="grid gap-2 text-sm font-medium">Organisation name<input className="workspace-field min-h-12" name="organisationName" required minLength={2} autoComplete="organization" placeholder="Your organisation" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">First name<input className="workspace-field min-h-12" name="firstName" required autoComplete="given-name" placeholder="First name" /></label>
                  <label className="grid gap-2 text-sm font-medium">Last name<input className="workspace-field min-h-12" name="lastName" required autoComplete="family-name" placeholder="Last name" /></label>
                </div>
              </>}
              <label className="grid gap-2 text-sm font-medium">Work email
                <span className="relative"><Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><input className="workspace-field min-h-12 pl-11" name="email" type="email" required autoComplete={mode === "login" ? "username" : "email"} placeholder="you@yourprovider.com.au" value={email} onChange={event => setEmail(event.target.value)} /></span>
              </label>
              <label className="grid gap-2 text-sm font-medium">Password
                <span className="relative"><input className="workspace-field min-h-12 pr-14" name="password" aria-label="Password" type={showPassword ? "text" : "password"} required minLength={mode === "register" ? 12 : 1} autoComplete={mode === "register" ? "new-password" : "current-password"} placeholder={mode === "register" ? "Create a password" : "Enter your password"} value={password} onChange={event => setPassword(event.target.value)} aria-describedby={mode === "register" ? "password-hint" : undefined} /><button type="button" className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
                {mode === "register" && <span id="password-hint" className="text-xs font-normal text-muted">Use at least 12 characters.</span>}
              </label>
              {error && <p role="alert" className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
              <button type="submit" className="primary-button mt-1 min-h-[52px] w-full">{mutation.isPending ? <><LoaderCircle size={18} className="motion-safe:animate-spin" />Please wait…</> : <>{mode === "register" ? "Create your workspace" : "Sign in to workspace"}<ArrowRight size={17} /></>}</button>
            </fieldset>
          </form>

          <p className="mt-6 text-center text-sm text-muted">{mode === "login" ? "New to Provider.ai? " : "Already have a workspace? "}<button type="button" disabled={mutation.isPending} onClick={switchMode} className="min-h-11 font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{mode === "login" ? "Create a workspace" : "Sign in"}</button></p>

          {isMockMode && mode === "login" && <div className="mt-7 rounded-2xl border border-line bg-canvas p-4">
            <div className="flex items-center gap-2 text-sm font-medium"><Sparkles size={16} className="text-brand-700" />Just having a look?</div>
            <p className="mt-1.5 text-xs leading-5 text-muted">Explore the dashboard with sample data. No account needed.</p>
            <button type="button" disabled={mutation.isPending} onClick={() => { setEmail("demo@provider.ai"); setPassword("Provider123!"); setShowPassword(false); setError(""); }} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-800 hover:underline">Use demo login<ArrowRight size={15} /></button>
          </div>}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted"><span>© {new Date().getFullYear()} Provider.ai</span><span>Built around Australian care.</span></footer>
      </section>

      <aside className="relative m-4 ml-0 hidden min-w-0 flex-col justify-between overflow-hidden rounded-[28px] bg-brand-100 px-10 py-10 lg:flex xl:px-14 xl:py-12">
        <div className="pointer-events-none absolute -right-44 -top-48 size-[600px] rounded-full border border-brand-200" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-28 -top-32 size-[470px] rounded-full border border-brand-200" aria-hidden="true" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[.16em] text-brand-800">A clearer day starts here</p>
          <h2 className="mt-10 max-w-[490px] text-[clamp(38px,3.8vw,58px)] font-medium leading-[1.08] tracking-[-.055em] text-ink">Behind every<br />great day of care,<br /><span className="text-brand-700">a connected team.</span></h2>
          <p className="mt-6 max-w-[390px] text-sm leading-7 text-brand-800">Know who needs you, see what’s next and give your team the context to move forward.</p>
        </div>

        <div className="relative my-10 rounded-2xl border border-white bg-white p-6 shadow-float xl:p-8">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-5">
            <div><p className="text-xs text-muted">Your day, connected</p><h3 className="mt-1.5 text-lg font-medium tracking-tight">The little things. All together.</h3></div>
            <span className="rounded-full bg-canvas px-2.5 py-1 text-[11px] text-muted">Preview</span>
          </div>
          <div className="relative mt-6 grid gap-6">
            <div className="absolute bottom-6 left-5 top-5 w-px bg-line" aria-hidden="true" />
            {[
              { icon: CalendarDays, time: "Start with a plan", title: "The right people, in the right place", detail: "See upcoming shifts and where coverage needs a hand." },
              { icon: UsersRound, time: "Keep care personal", title: "A person behind every plan", detail: "Keep support needs and participant context close by." },
              { icon: ClipboardCheck, time: "Finish with clarity", title: "Know what needs your attention", detail: "Bring team readiness and everyday follow-ups into view." },
            ].map(({ icon: Icon, time, title, detail }) => <div key={time} className="relative flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand-100 bg-brand-50 text-brand-800"><Icon size={18} strokeWidth={1.5} /></span>
              <div className="pt-0.5"><p className="text-[11px] font-medium text-brand-700">{time}</p><h4 className="mt-1 text-sm font-medium text-ink">{title}</h4><p className="mt-1.5 max-w-[310px] text-xs leading-5 text-muted">{detail}</p></div>
            </div>)}
          </div>
        </div>

        <div className="relative border-t border-brand-200 pt-6">
          <p className="text-sm font-medium text-ink">More clarity for your team. More time for care.</p>
          <p className="mt-2 text-xs leading-6 text-brand-800">Thoughtfully built for Australian NDIS providers.</p>
        </div>
      </aside>
    </main>
  );
}
