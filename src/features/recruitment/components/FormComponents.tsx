import { Check, X } from "lucide-react";
import type { ReactNode } from "react";

export function Dialog({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop [position:fixed] [inset:0] [z-index:50] [padding:24px] [display:grid] [place-items:center] [background:rgba(28,26,43,.48)] [backdrop-filter:blur(5px)]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal-card [width:min(100%,560px)] [max-height:calc(100vh_-_48px)] [overflow:auto] [position:relative] [padding:27px] [border-radius:17px] [background:white] [box-shadow:0_24px_70px_rgba(24,22,39,.24)] [&_h2]:[margin:0] [&_h2]:[font:700_20px_var(--font-sans)] [&_>_p]:[margin:6px_0_23px] [&_>_p]:[color:#8d8d9c] [&_>_p]:[font-size:11px]" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close [position:absolute] [right:18px] [top:18px] [width:34px] [height:34px] [display:grid] [place-items:center] [border:1px_solid_var(--border)] [border-radius:9px] [background:white] [cursor:pointer]" onClick={onClose} aria-label="Close"><X size={19} /></button><h2 id="modal-title">{title}</h2><p>{subtitle}</p>{children}</section></div>;
}

export function Field({ label, ...props }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return <label>{label}<input {...props} /></label>;
}

export function ModalActions({ busy, label, onCancel }: { busy: boolean; label: string; onCancel: () => void }) {
  return <div className="modal-actions [display:flex] [justify-content:flex-end] [gap:9px] [padding-top:5px]"><button type="button" className="secondary-button [display:flex] [align-items:center] [gap:7px] max-[570px]:[padding-inline:8px] " onClick={onCancel}>Cancel</button><button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] " disabled={busy}>{busy ? "Saving…" : label}<Check size={16} /></button></div>;
}
