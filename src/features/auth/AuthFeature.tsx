import { Brand } from "../../components/PublicShell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
          <p className="text-xs font-medium uppercase tracking-[.16em] text-brand-800">The care behind your care</p>
          <h2 className="mt-10 max-w-[490px] text-[clamp(38px,3.8vw,58px)] font-medium leading-[1.08] tracking-[-.055em] text-ink">Less to juggle.<br />More room for<br /><span className="text-brand-700">what matters.</span></h2>
          <p className="mt-6 max-w-[360px] text-sm leading-7 text-brand-800">One clear view of your people, your operations and the care you make possible.</p>
        </div>

        <figure className="relative my-10">
          <div className="overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-float">
            <div className="flex items-center gap-1.5 px-2 pb-2 pt-1" aria-hidden="true"><span className="size-1.5 rounded-full bg-line" /><span className="size-1.5 rounded-full bg-line" /><span className="size-1.5 rounded-full bg-line" /><span className="ml-3 text-[11px] text-muted">Your Provider.ai workspace</span></div>
            <img src="/product/workspace.png" alt="Provider.ai dashboard showing a daily overview of care operations" className="w-full rounded-lg border border-line" />
          </div>
          <figcaption className="mt-3 text-center text-xs text-brand-800">A little clarity for every day. · Demo workspace</figcaption>
        </figure>

        <div className="relative border-t border-brand-200 pt-6">
          <p className="mb-4 text-sm font-medium text-ink">Built for the way NDIS providers work.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-3">{["People & plans", "Teams & rosters", "Everyday operations"].map(item => <span key={item} className="inline-flex items-center gap-1.5 text-xs text-brand-800"><Check size={14} />{item}</span>)}</div>
        </div>
      </aside>
    </main>
  );
}
