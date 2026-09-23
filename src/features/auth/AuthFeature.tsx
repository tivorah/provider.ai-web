import { Brand } from "../../components/PublicShell";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "../../api";

export function Auth({ onBack, initialMode = "register" }: { onBack?: () => void; initialMode?: "register" | "login" }) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
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

  return <main className="grid min-h-dvh bg-canvas lg:grid-cols-2">
    <section className="flex flex-col px-6 py-8 sm:px-12 lg:px-16">
      <Brand onClick={onBack} />
      <div className="mx-auto my-auto w-full max-w-[430px] py-12">
        {onBack && <button type="button" onClick={onBack} className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft size={16} />Back to home</button>}
        <div className="mb-8 flex gap-1 rounded-xl border border-line bg-white p-1" aria-label="Account access">
          {([['register', 'Create workspace'], ['login', 'Sign in']] as const).map(([value, label]) => <button type="button" key={value} disabled={mutation.isPending} onClick={() => { setMode(value); setError(''); }} className={`min-h-11 flex-1 rounded-lg text-sm ${mode === value ? 'bg-ink text-white' : 'text-muted hover:bg-canvas'}`}>{label}</button>)}
        </div>
        <h1 className="text-[34px] font-medium leading-tight tracking-[-.04em] text-ink">{mode === 'register' ? 'Your next chapter starts here.' : 'Welcome back.'}</h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-muted">{mode === 'register' ? 'Create one workspace for your team and your NDIS operations.' : 'Sign in to your Provider.ai workspace.'}</p>
        <form key={mode} onSubmit={submit} className="grid gap-5">
          {mode === 'register' && <><label className="grid gap-2 text-sm">Organisation name<input className="workspace-field" name="organisationName" required minLength={2} autoComplete="organization" placeholder="Your organisation" /></label><div className="grid grid-cols-2 gap-4"><label className="grid gap-2 text-sm">First name<input className="workspace-field" name="firstName" required autoComplete="given-name" /></label><label className="grid gap-2 text-sm">Last name<input className="workspace-field" name="lastName" required autoComplete="family-name" /></label></div></>}
          <label className="grid gap-2 text-sm">Work email<input className="workspace-field" name="email" type="email" required autoComplete="email" placeholder="you@yourprovider.com.au" /></label>
          <label className="grid gap-2 text-sm">Password<span className="relative"><input className="workspace-field pr-14" name="password" type={showPassword ? 'text' : 'password'} required minLength={mode === 'register' ? 12 : 1} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder={mode === 'register' ? 'At least 12 characters' : 'Your password'} /><button type="button" className="absolute right-1 top-0.5 grid size-11 place-items-center rounded-lg text-muted" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
          {error && <p role="alert" className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
          <button type="submit" disabled={mutation.isPending} className="primary-button mt-2 min-h-12">{mutation.isPending ? 'Please wait…' : mode === 'register' ? 'Create workspace' : 'Sign in'}<ArrowRight size={17} /></button>
        </form>
      </div>
      <p className="text-xs text-muted">Provider.ai · Built around Australian care.</p>
    </section>
    <aside className="m-5 hidden flex-col justify-center rounded-[20px] bg-brand-100 p-10 lg:flex xl:p-14">
      <p className="mb-5 text-xs font-medium text-brand-800">For small & medium NDIS providers</p>
      <h2 className="max-w-[500px] text-[48px] font-medium leading-[1.08] tracking-[-.05em] text-ink">Your people.<br />Your operations.<br />One place.</h2>
      <p className="mb-9 mt-6 max-w-[380px] text-base leading-7 text-muted">Bring the work that matters together, from participant plans to your next roster and finance review.</p>
      <div className="grid gap-4">{['Participant records and support plans', 'Staff, credentials and rostering', 'Finance, quality and everyday evidence'].map(item => <p className="flex items-center gap-3 text-sm" key={item}><span className="grid size-6 place-items-center rounded-full bg-white"><Check size={13} /></span>{item}</p>)}</div>
      <div className="mt-10 overflow-hidden rounded-xl border border-line bg-white"><img src="/product/workspace.png" alt="Provider.ai overview using demonstration data" className="w-full" /></div>
    </aside>
  </main>;
}
