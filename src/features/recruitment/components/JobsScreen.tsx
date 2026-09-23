import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BriefcaseBusiness, Edit3, MapPin, Trash2, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "../../../api";
import type { Candidate, Job } from "../../../types";
import { Dialog, Field, ModalActions } from "./FormComponents";

type JobTab = "active" | "draft" | "closed";
const sourceChannel = (source: string) => source.toLowerCase() === "direct" || source.toLowerCase() === "referral" ? "Provider careers page" : source;
const jobChannels = (job: Job) => job.channels?.length ? job.channels : job.status === "open" ? ["SEEK", "Indeed", "Provider careers page"] : [];

export function JobsScreen({ jobs, candidates, onBack }: { jobs: Job[]; candidates: Candidate[]; onBack: () => void }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<JobTab>("active");
  const [editing, setEditing] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Omit<Job, "id" | "createdAt"> }) => api.updateJob(id, input),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["jobs"] }); setEditing(null); },
    onError: () => setError("Unable to update this job."),
  });
  const visible = jobs.filter((job) => tab === "active" ? job.status === "open" : tab === "draft" ? ["draft", "paused"].includes(job.status) : job.status === "closed");
  const counts = {
    active: jobs.filter((job) => job.status === "open").length,
    draft: jobs.filter((job) => ["draft", "paused"].includes(job.status)).length,
    closed: jobs.filter((job) => job.status === "closed").length,
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    update.mutate({ id: editing.id, input: { title: values.title.toString(), location: values.location.toString(), employmentType: values.employmentType.toString(), description: values.description.toString(), status: values.status as Job["status"] } });
  };
  const closeJob = (job: Job) => update.mutate({ id: job.id, input: { title: job.title, location: job.location, employmentType: job.employmentType, description: job.description, status: "closed" } });

  return <section className="page w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-7">
    <button onClick={onBack} className="mb-5 flex items-center gap-2 border-0 bg-transparent p-0 text-[12px] font-bold text-brand-700"><ArrowLeft size={16} />Back to recruitment</button>
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-line pb-5">
      <div><span className="text-[11px] font-bold tracking-wide text-brand-700 uppercase">Recruitment</span><h1 className="mt-1">Job postings</h1><p className="mt-1 text-[13px] text-muted">Manage roles, publishing channels and applications in one place.</p></div>
      <div className="flex gap-6 text-right max-[650px]:hidden"><div><strong className="block text-xl">{counts.active}</strong><small className="text-[11px] text-muted">Active jobs</small></div><div><strong className="block text-xl">{candidates.length}</strong><small className="text-[11px] text-muted">Applications</small></div></div>
    </div>
    <div className="mb-4 flex w-fit gap-1 rounded-lg bg-[#ecf3fa] p-1">
      {(["active", "draft", "closed"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`flex items-center gap-2 rounded-md border-0 px-3 py-2 text-[12px] font-bold capitalize ${tab === item ? "bg-white text-brand-700 shadow-sm" : "bg-transparent text-muted"}`}>{item}<span className="rounded bg-black/5 px-1.5 py-0.5 text-[11px]">{counts[item]}</span></button>)}
    </div>
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {visible.length ? visible.map((job) => {
        const jobCandidates = candidates.filter((candidate) => candidate.jobId === job.id);
        const applications = jobCandidates.length;
        const channels = Array.from(new Set([...jobChannels(job), ...jobCandidates.map((candidate) => sourceChannel(candidate.source))]));
        return <article key={job.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-b border-line px-5 py-4 last:border-b-0 max-[650px]:grid-cols-1">
          <div className="min-w-0"><div className="flex items-center gap-2"><BriefcaseBusiness className="size-4 text-brand-600" /><strong className="truncate text-[14px]">{job.title}</strong><span className={`rounded-md px-2 py-1 text-[11px] font-bold capitalize ${job.status === "open" ? "bg-[#e5f6ef] text-[#23785c]" : "bg-[#dddfd7] text-muted"}`}>{job.status}</span></div><p className="mt-1.5 line-clamp-1 text-[11px] text-muted">{job.description}</p><div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted"><span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span><span className="capitalize">{job.employmentType}</span><span className="flex items-center gap-1"><Users size={12} />{applications} applications</span></div>{channels.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{channels.map((channel) => { const count = jobCandidates.filter((candidate) => sourceChannel(candidate.source).toLowerCase() === channel.toLowerCase()).length; return <span key={channel} className="rounded-md border border-line bg-[#f7f7f4] px-2 py-1 text-[11px] font-semibold text-[#626272]">{channel}<b className="ml-1.5 text-brand-700">{count}</b></span>; })}</div>}</div>
          <div className="flex items-center gap-2"><button onClick={() => { setError(""); setEditing(job); }} className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-[11px] font-semibold hover:bg-[#f6f9fd]"><Edit3 size={14} />Edit</button>{job.status !== "closed" && <button onClick={() => closeJob(job)} disabled={update.isPending} className="flex items-center gap-1.5 rounded-lg border border-[#f0d7dc] bg-white px-3 py-2 text-[11px] font-semibold text-[#a44758] hover:bg-[#fff4f5]"><Trash2 size={14} />Remove from board</button>}</div>
        </article>;
      }) : <div className="grid min-h-48 place-items-center text-[12px] text-muted">No {tab} jobs.</div>}
    </div>
    {editing && <Dialog title="Edit job details" subtitle="Update the role or change its publishing status." onClose={() => setEditing(null)}><form className="modal-form grid gap-4 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-[11px] [&_label]:font-bold [&_input]:rounded-lg [&_input]:border [&_input]:border-line [&_input]:px-3 [&_input]:py-2.5 [&_select]:rounded-lg [&_select]:border [&_select]:border-line [&_select]:px-3 [&_select]:py-2.5 [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-line [&_textarea]:px-3 [&_textarea]:py-2.5" onSubmit={save}><Field label="Position" name="title" required defaultValue={editing.title} /><Field label="Location" name="location" required defaultValue={editing.location} /><div className="grid grid-cols-2 gap-3"><label>Employment type<select name="employmentType" defaultValue={editing.employmentType}><option value="casual">Casual</option><option value="part-time">Part-time</option><option value="full-time">Full-time</option><option value="contract">Contract</option></select></label><label>Status<select name="status" defaultValue={editing.status}><option value="open">Active</option><option value="draft">Draft</option><option value="paused">Paused</option><option value="closed">Closed</option></select></label></div><label>Description<textarea name="description" rows={5} defaultValue={editing.description} required /></label>{error && <p className="text-[11px] text-[#a44758]">{error}</p>}<ModalActions busy={update.isPending} label="Save changes" onCancel={() => setEditing(null)} /></form></Dialog>}
  </section>;
}
