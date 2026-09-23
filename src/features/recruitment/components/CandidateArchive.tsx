import { Archive, MoreHorizontal } from "lucide-react";
import type { Candidate } from "../../../types";

export function CandidateArchive({ candidates, jobs }: { candidates: Candidate[]; jobs: Array<{ id: string; title: string }> }) {
  return (
    <article className="table-panel [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden] [box-shadow:none] max-[760px]:[overflow-x:auto] candidate-archive [&_.data-row]:[grid-template-columns:1.25fr_1fr_.7fr_.65fr_28px]">
      <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px] data-head [min-height:37px] [background:#f7f7f4] [color:#72756d] [text-transform:uppercase] [letter-spacing:.5px] [font-size:11px] [font-weight:700] [font-size:14px]"><span>Candidate</span><span>Position</span><span>Outcome</span><span>Date</span><span /></div>
      {candidates.length ? candidates.map((candidate) => (
        <div className="data-row [display:grid] [align-items:center] [min-height:60px] [padding:8px_15px] [border-top:1px_solid_#dddfd7] [font-size:11px] [&:first-child]:[border-top:0] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9696a5] [&_small]:[font-size:11px] [font-size:11px] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_small]:[line-height:1.45] [font-size:11.5px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [font-size:14px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={candidate.id}>
          <span className="person-cell [display:flex] [align-items:center] [gap:9px] [&_strong]:[font-size:11.5px] [&_small]:[font-size:11px] [&_strong]:[font-size:12px] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]"><span className="candidate-avatar [width:34px] [height:34px] [border-radius:50%] [display:grid] [place-items:center] [background:#e7f2ff] [color:#4a86ca] [font-size:11px] [font-weight:700]">{candidate.firstName[0]}{candidate.lastName[0]}</span><span><strong>{candidate.firstName} {candidate.lastName}</strong><small>{candidate.email}</small></span></span>
          <span>{jobs.find((job) => job.id === candidate.jobId)?.title ?? "General application"}</span>
          <span><span className={`archive-status [padding:5px_8px] [border-radius:7px] [background:#dddfd7] [text-transform:capitalize] [font-size:11px] [font-weight:700] [&.hired]:[color:#247f5f] [&.hired]:[background:#e8f7f1] [&.rejected]:[color:#b54c61] [&.rejected]:[background:#ffe9ed] [font-size:12px] ${candidate.stage}`}>{candidate.stage === "hired" ? "Moved to People" : candidate.stage}</span></span>
          <span>{new Date(candidate.createdAt).toLocaleDateString("en-AU")}</span>
          <span><button className="row-menu [border:0] [background:transparent] [color:#9999a6]"><MoreHorizontal /></button></span>
        </div>
      )) : <div className="archive-empty [padding:60px] [display:grid] [place-items:center] [gap:8px] [color:#72756d] [&_svg]:[color:#599ce8] [&_strong]:[color:#3c434d]"><Archive /><strong>No candidates here yet</strong><small>Completed recruitment outcomes will appear here.</small></div>}
    </article>
  );
}
