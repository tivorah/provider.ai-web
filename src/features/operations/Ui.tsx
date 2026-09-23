import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export function Badge({
  children,
  warn = false,
}: {
  children: ReactNode;
  warn?: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs ${warn ? "bg-warning/10 text-warning" : "bg-brand-50 text-brand-800"}`}
    >
      {children}
    </span>
  );
}
export function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
        <div>
          <h2 className="text-base font-medium text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
          )}
        </div>
        {action}
      </header>
      {children}
    </article>
  );
}
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className="my-4 text-3xl tracking-tight text-ink">{value}</p>
      <p className="text-xs text-muted">{detail}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white p-0 text-ink shadow-float backdrop:bg-ink/40"
    >
      <div>
        <header className="flex items-center justify-between gap-4 border-b border-line p-5">
          <h2 id={titleId} className="text-xl font-medium">{title}</h2>
          <button
            aria-label="Close dialog"
            className="grid size-11 place-items-center rounded-lg hover:bg-canvas"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <div className="p-6">{children}</div>
      </div>
    </dialog>
  );
}
export const cell = "px-5 py-4 text-left text-sm";
export const head = "px-5 py-3 text-left text-xs font-medium text-muted";
