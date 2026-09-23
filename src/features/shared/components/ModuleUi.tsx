import { PageHeader } from "../../../components/PageHeader";
import { AlertTriangle, ArrowUpRight, ChevronRight, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { avatarToneClass } from "../../../utils/tailwind";

export function ModuleHeader({ eyebrow, title, subtitle, action, onAction }: { eyebrow: string; title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return <PageHeader category={eyebrow} title={title} description={subtitle}>
    {action && onAction && <button className="primary-button" onClick={onAction}><Plus size={17} />{action}</button>}
  </PageHeader>;
}

export function Avatar({ initials, tone, large = false }: { initials: string; tone: string; large?: boolean }) {
  return <span className={`domain-avatar [flex:none] [width:37px] [height:37px] [border-radius:11px] [display:grid] [place-items:center] [font-size:11px] [font-weight:800] [&.large]:[width:58px] [&.large]:[height:58px] [&.large]:[border-radius:16px] [&.large]:[font-size:15px] ${avatarToneClass(tone)} ${large ? "large" : ""}`}>{initials}</span>;
}

export function SummaryStat({ icon, value, label, detail }: { icon: ReactNode; value: string; label: string; detail: string; tone?: string }) {
  return <div className="summary-card"><div className="flex items-center justify-between gap-3 text-muted"><p className="text-xs">{label}</p><span className="[&_svg]:size-[18px]">{icon}</span></div><strong className="my-4 block text-[30px] font-medium leading-none tracking-[-.04em] text-ink">{value}</strong><p className="text-xs leading-5 text-muted">{detail}</p></div>;
}

export function FinanceKpi({ icon, label, value, trend, detail, positive = false }: { icon: ReactNode; label: string; value: string; trend?: string; detail?: string; positive?: boolean }) {
  return <article className="summary-card"><div className="flex items-center justify-between gap-3 text-muted"><p className="text-xs">{label}</p><span className="[&_svg]:size-[18px]">{icon}</span></div><strong className="my-4 block text-[30px] font-medium leading-none tracking-[-.04em] text-ink">{value}</strong><p className={`text-xs leading-5 ${positive ? 'text-positive' : 'text-muted'}`}>{trend && <span>{trend} · </span>}{detail ?? 'Compared with the previous period'}</p></article>;
}

export function ActionRow({ tone, title, meta, onAction }: { tone: string; title: string; meta: string; onAction?: () => void }) {
  const content = <><span className={tone}><AlertTriangle size={15} /></span><span><strong>{title}</strong><small>{meta}</small></span>{onAction && <ChevronRight size={15} />}</>;
  const className = "action-row w-full border-0 border-t border-[#dddfd7] bg-white py-3 text-left grid grid-cols-[29px_1fr_15px] items-center gap-2 [&>span:first-child]:grid [&>span:first-child]:size-[29px] [&>span:first-child]:place-items-center [&>span:first-child]:rounded-lg [&>span.rose]:bg-danger/10 [&>span.rose]:text-danger [&>span.amber]:bg-warning/10 [&>span.amber]:text-warning [&>span.violet]:bg-brand-50 [&>span.violet]:text-brand-700 [&_strong]:block [&_strong]:text-[13px] [&_small]:mt-1 [&_small]:block [&_small]:text-[12px] [&_small]:text-muted";
  return onAction ? <button className={className} onClick={onAction}>{content}</button> : <div className={className}>{content}</div>;
}
