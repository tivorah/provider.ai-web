import { Check, ChevronRight, Link2, ShieldCheck, X } from "lucide-react";
import { mailboxProviders, type MailboxProviderContent } from "../../../utils/content";

export function ConnectMailboxModal({ onClose, onConnect }: { onClose: () => void; onConnect: (provider: MailboxProviderContent) => void }) {
  return (
    <div className="fixed inset-0 z-[120] bg-[#18202c]/35 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col border-l border-[#dddfd7] bg-white shadow-[-18px_0_50px_rgba(16,24,40,.14)]">
        <header className="flex items-start justify-between border-b border-[#e5e9ee] px-6 py-5">
          <div>
            <span className="mb-3 grid size-10 place-items-center rounded-[9px] bg-[#edf4fc] text-[#3978bd]"><Link2 className="size-[18px]" /></span>
            <h2 className="m-0 text-xl font-semibold tracking-[-0.02em] text-[#182230]">Connect a mailbox</h2>
            <p className="mb-0 mt-1.5 max-w-[390px] text-[13px] leading-5 text-[#667085]">Bring a provider email account into the shared inbox using its secure sign-in method.</p>
          </div>
          <button type="button" className="grid size-9 shrink-0 place-items-center rounded-[7px] border border-[#dddfd7] bg-white text-[#667085] hover:bg-[#f5f7f9]" onClick={onClose} aria-label="Close connect mailbox drawer"><X className="size-4" /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <p className="mb-3 mt-0 text-xs font-medium text-[#475467]">Choose an email provider</p>
          <div className="grid gap-2.5">
          {mailboxProviders.map((provider) => (
            <button className="grid grid-cols-[42px_1fr_18px] items-center gap-3 rounded-[10px] border border-[#dddfd7] bg-white p-3.5 text-left transition hover:border-[#9fc0e4] hover:bg-[#f8fbfe]" key={provider.name} onClick={() => onConnect(provider)}>
              <span className="grid size-[42px] place-items-center rounded-[9px] text-sm font-semibold text-white" style={{ background: provider.colour }}>{provider.mark}</span>
              <div><strong className="block text-[13px] font-medium text-[#182230]">{provider.name}</strong><small className="mt-1 block text-[11px] leading-4 text-[#667085]">{provider.mark === "@" ? "Secure server settings and OAuth/app password" : "Connect securely with OAuth 2.0"}</small></div>
              <ChevronRight className="size-4 text-[#98a2b3]" />
            </button>
          ))}
          </div>

          <div className="mt-5 flex gap-3 rounded-[10px] border border-[#cfe0f2] bg-[#f4f8fd] p-4 text-[#344054]">
            <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-[#3978bd]" />
            <div><strong className="block text-xs font-medium">Secure by default</strong><span className="mt-1 block text-[11px] leading-[1.55] text-[#667085]">Credentials are encrypted, access is permission-scoped and mailbox activity is recorded in the audit log.</span></div>
          </div>
        </div>

        <footer className="flex items-center gap-2 border-t border-[#e5e9ee] px-6 py-4 text-[11px] text-[#667085]"><Check className="size-4 text-[#247f5f]" /> Native OAuth is used where available.</footer>
      </aside>
    </div>
  );
}
