import { Calendar, Mail, MapPin, Sparkles, UserRoundCheck, UserX } from "lucide-react";
import type { Candidate } from "../../../types";

interface CandidateCardProps {
  candidate: Candidate;
  jobTitle?: string;
  onHire: () => void;
  onRemove: () => void;
}

export function CandidateCard({ candidate, jobTitle, onHire, onRemove }: CandidateCardProps) {
  const initials = `${candidate.firstName[0] ?? ""}${candidate.lastName[0] ?? ""}`;
  const avatarVariant = candidate.id.charCodeAt(0) % 5;
  const avatarColour =
    avatarVariant === 2 || avatarVariant === 5
      ? "bg-[#e5f5ef] text-[#267c60]"
      : avatarVariant === 3
        ? "bg-[#fff0df] text-[#a86427]"
        : "bg-[#e7f2ff] text-[#4a86ca]";
  return (
    <article className="candidate-card [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [background:white] [border:1px_solid_#d8e5f4] [border-radius:11px] [padding:13px] [box-shadow:none] [cursor:grab] [&:active]:[cursor:grabbing] [&_>_p]:[display:flex] [&_>_p]:[gap:5px] [&_>_p]:[align-items:center] [&_>_p]:[margin:12px_0] [&_>_p]:[color:#8d8d9c] [&_>_p]:[font-size:11px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [&_strong]:[font-size:12px] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" draggable onDragStart={(event) => event.dataTransfer.setData("candidate-id", candidate.id)}>
      <div className="candidate-top [display:grid] [grid-template-columns:34px_1fr_17px] [gap:8px] [align-items:center] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[color:#9696a6] [&_small]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small]:[max-width:135px]">
        <span className={`candidate-avatar grid size-[34px] place-items-center rounded-full text-[11px] font-bold ${avatarColour}`}>{initials}</span>
        <div><strong>{candidate.firstName} {candidate.lastName}</strong><small>{jobTitle ?? "General candidate"}</small></div>
        <button onClick={onRemove} aria-label={`Remove ${candidate.firstName} from active recruitment`} title="Reject and archive"><UserX size={16} /></button>
      </div>
      <p><MapPin size={14} />{candidate.location}</p>
      <span className="candidate-source mb-2 inline-block bg-transparent p-0 text-[11px] font-normal capitalize leading-none text-[#667085]">Applied via {candidate.source}</span>
      <div className="candidate-footer [border-top:1px_solid_#dddfd7] [padding-top:10px] [display:flex] [align-items:center] [justify-content:space-between] [&_>_div]:[display:flex]">
        <span className={`flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-bold ${candidate.score >= 90 ? "bg-[#e8f6f1] text-[#27785f]" : "bg-[#fff4e5] text-[#8c6b37]"}`}><Sparkles size={13} />{candidate.score ? `${candidate.score}% match` : "Awaiting score"}</span>
        <div><button aria-label={`Email ${candidate.firstName}`}><Mail size={15} /></button><button aria-label={`Schedule with ${candidate.firstName}`}><Calendar size={15} /></button></div>
      </div>
      {candidate.stage === "offer" && <button className="accept-offer [color:#247f5f] [background:#e8f7f1]" onClick={onHire}><UserRoundCheck size={14} />Offer accepted · start onboarding</button>}
    </article>
  );
}
