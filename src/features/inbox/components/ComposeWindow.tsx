import { Check, Paperclip, Send, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { MailAccount, Message } from "../../../mocks/inbox";
import { emailWritingTones } from "../../../utils/content";

interface ComposeWindowProps {
  accounts: MailAccount[];
  selected?: Message;
  tone: string;
  refining: boolean;
  refined: boolean;
  draftBody: string;
  onToneChange: (tone: string) => void;
  onDraftChange: (draft: string) => void;
  onRefine: () => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ComposeWindow(props: ComposeWindowProps) {
  const [attachment, setAttachment] = useState<File | null>(null);
  return (
    <div className="compose-window [position:fixed] [right:28px] [bottom:0] [z-index:125] [width:min(600px,calc(100%_-_35px))] [border:1px_solid_#d8dde2] [border-radius:14px_14px_0_0] [background:white] [box-shadow:0_20px_70px_rgba(25,23,40,.28)] [overflow:hidden] [&>header]:[padding:13px_16px] [&>header]:[color:white] [&>header]:[background:#282a26] [&>header]:[display:flex] [&>header]:[justify-content:space-between] [&>header_button]:[border:0] [&>header_button]:[background:transparent] [&>header_button]:[color:white] [&_form]:[padding:8px_16px_14px] [&_label]:[min-height:42px] [&_label]:[border-bottom:1px_solid_var(--border)] [&_label]:[display:grid] [&_label]:[grid-template-columns:58px_1fr] [&_label]:[align-items:center] [&_label]:[color:#72756d] [&_label]:[font-size:11px] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[background:white] [&_input]:[font-size:12px] [&_select]:[border:0] [&_select]:[outline:0] [&_select]:[background:white] [&_select]:[font-size:12px] [&_textarea]:[width:100%] [&_textarea]:[padding:14px_0] [&_textarea]:[border:0] [&_textarea]:[outline:0] [&_textarea]:[resize:none] [&_textarea]:[font:13px/1.6_Inter] [&_textarea]:[min-height:170px] max-[600px]:[right:0] max-[600px]:[width:100%]">
      <header><div><strong>New message</strong><small>Compose from a connected provider mailbox</small></div><button type="button" onClick={props.onClose} aria-label="Close composer"><X /></button></header>
      <form onSubmit={props.onSubmit}>
        <label>From<select>{props.accounts.map((account) => <option key={account.id}>{account.address} · {account.provider}</option>)}</select></label>
        <label>To<input type="email" required defaultValue={props.selected?.email ?? ""} placeholder="name@example.com" /></label>
        <label>Subject<input required defaultValue={props.selected ? `Re: ${props.selected.subject}` : ""} /></label>
        <div className="ai-writing-bar [margin:10px_0_0] [padding:11px] [border:1px_solid_#d7e8fb] [border-radius:11px] [background:linear-gradient(135deg,#f7fbff,#eff6ff)] [display:grid] [grid-template-columns:1fr_auto] [gap:10px] [align-items:center] [&>div:first-child]:[display:flex] [&>div:first-child]:[align-items:center] [&>div:first-child]:[gap:8px] [&>div:first-child>span]:[width:31px] [&>div:first-child>span]:[height:31px] [&>div:first-child>span]:[border-radius:8px] [&>div:first-child>span]:[display:grid] [&>div:first-child>span]:[place-items:center] [&>div:first-child>span]:[color:#386590] [&>div:first-child>span]:[background:white] [&_svg]:[width:15px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:12px] [&_small]:[margin-top:3px] [&_small]:[color:#77718e] [&_small]:[font-size:11px] [&_.refine-button]:[grid-column:1/-1] [&_.refine-button]:[width:max-content] [&_.refine-button]:[padding:8px_11px] [&_.refine-button]:[border:0] [&_.refine-button]:[border-radius:8px] [&_.refine-button]:[color:white] [&_.refine-button]:[background:#569ae8] [&_.refine-button]:[display:flex] [&_.refine-button]:[align-items:center] [&_.refine-button]:[gap:6px] [&_.refine-button]:[font-size:11px] [&_.refine-button]:[font-weight:700] [&_.refine-button:disabled]:[opacity:.65] max-[600px]:[grid-template-columns:1fr]">
          <div><span><Sparkles /></span><div><strong>Provider.ai writing assistant</strong><small>Improve grammar, clarity and tone while keeping your meaning.</small></div></div>
          <div className="tone-picker [display:flex] [padding:3px] [border-radius:8px] [background:white] [&_button]:[padding:6px_8px] [&_button]:[border:0] [&_button]:[border-radius:6px] [&_button]:[background:transparent] [&_button]:[color:#777486] [&_button]:[font-size:11px] [&_button.active]:[color:#4681c5] [&_button.active]:[background:#f0f5fa] [&_button.active]:[font-weight:700] max-[600px]:[overflow-x:auto]">{emailWritingTones.map((tone) => <button type="button" className={props.tone === tone ? "active" : ""} onClick={() => props.onToneChange(tone)} key={tone}>{tone}</button>)}</div>
          <button type="button" className="refine-button" onClick={props.onRefine} disabled={props.refining}><Sparkles />{props.refining ? "Refining…" : props.refined ? "Refine again" : "Refine with AI"}</button>
        </div>
        <textarea required rows={11} value={props.draftBody} onChange={(event) => props.onDraftChange(event.target.value)} placeholder="Write a rough message—Provider.ai can improve the grammar and tone…" />
        {attachment && <div className="compose-attachment mb-3 flex items-center gap-2 rounded-[8px] border border-[#dddfd7] bg-[#f3f3ef] px-3 py-2.5"><span className="grid size-8 place-items-center rounded-[7px] bg-white text-[#475467]"><Paperclip className="size-4" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium">{attachment.name}</strong><small className="mt-0.5 block text-[11px] text-[#667085]">{Math.max(1, Math.round(attachment.size / 1024))} KB · Ready to send</small></span><button type="button" className="grid size-7 place-items-center rounded-[6px] border-0 bg-transparent text-[#667085] hover:bg-[#eef2f6]" onClick={() => setAttachment(null)} aria-label="Remove attachment"><X className="size-3.5" /></button></div>}
        {props.refined && <div className="refined-confirmation [margin:0_0_10px] [padding:9px_11px] [border-radius:9px] [color:#247f5f] [background:#e8f7f1] [display:flex] [align-items:center] [gap:8px] [&_svg]:[width:16px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:2px] [&_small]:[font-size:11px]"><Check /><span><strong>Draft refined</strong><small>Review the wording before sending. You can continue editing or refine it again.</small></span></div>}
        <div className="compose-actions flex items-center gap-3 border-t border-[#e4e7eb] pt-3"><label className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#d9dee5] bg-white px-3 text-xs font-medium text-[#344054] hover:bg-[#f5f7f9]"><Paperclip className="size-4" />Attach<input className="sr-only" type="file" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} /></label><span className="ml-auto text-[11px] text-[#667085]">{props.draftBody ? "Draft saved" : "Start typing to save a draft"}</span><button className="primary-button">Send <Send className="size-4" /></button></div>
      </form>
    </div>
  );
}
