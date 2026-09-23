import { PageHeader } from "../../components/PageHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, BriefcaseBusiness, Building2, Calendar, Check, ChevronDown, Filter, Info, Mail, MapPin, Megaphone, MoreHorizontal, Plus, Search, SlidersHorizontal, Sparkles, UserRoundCheck, UserX, X } from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { api, ApiError } from "../../api";
import type { Candidate, CandidateStage } from "../../types";
import { recruitmentStages as stages } from "../../utils/content";
import { CandidateArchive } from "./components/CandidateArchive";
import { CandidateCard } from "./components/CandidateCard";
import { Dialog, Field, ModalActions } from "./components/FormComponents";
import { JobsScreen } from "./components/JobsScreen";

const ndisPositions = {
  "Support delivery": [
    "Disability Support Worker",
    "Senior Support Worker",
    "Community Support Worker",
    "Mental Health Support Worker",
    "Complex Care Support Worker",
    "Youth Support Worker",
    "Personal Care Worker",
    "Supported Independent Living Team Leader",
    "House Supervisor",
    "Service Delivery Manager",
    "Support Coordinator",
    "Specialist Support Coordinator",
    "Psychosocial Recovery Coach",
    "Participant Intake Coordinator",
    "Participant Liaison Officer",
  ],
  "Clinical and allied health": [
    "Registered Nurse",
    "Enrolled Nurse",
    "Clinical Nurse Consultant",
    "Occupational Therapist",
    "Physiotherapist",
    "Speech Pathologist",
    "Psychologist",
    "Positive Behaviour Support Practitioner",
    "Social Worker",
    "Counsellor",
    "Dietitian",
    "Exercise Physiologist",
    "Allied Health Assistant",
  ],
  "Quality and operations": [
    "Chief Executive Officer",
    "Chief Operating Officer",
    "Operations Manager",
    "Regional Manager",
    "Quality and Compliance Manager",
    "Quality Officer",
    "Risk and Incident Manager",
    "Safeguarding Officer",
    "Work Health and Safety Officer",
    "Rostering Coordinator",
    "Workforce Coordinator",
    "After-hours Coordinator",
    "Administration Officer",
    "Receptionist",
  ],
  "People and recruitment": [
    "People and Culture Manager",
    "Human Resources Advisor",
    "Recruitment Manager",
    "Recruitment Coordinator",
    "Talent Acquisition Specialist",
    "Learning and Development Coordinator",
    "Trainer and Assessor",
  ],
  "Finance and corporate": [
    "Chief Financial Officer",
    "Finance Manager",
    "Accountant",
    "Bookkeeper",
    "Payroll Officer",
    "NDIS Billing Officer",
    "Claims Officer",
    "Plan Manager",
    "Accounts Receivable Officer",
    "Accounts Payable Officer",
    "Business Development Manager",
    "Marketing and Communications Coordinator",
  ],
  "Technology and facilities": [
    "IT Manager",
    "IT Support Officer",
    "Systems Administrator",
    "CRM Administrator",
    "Data Analyst",
    "Cyber Security and Privacy Officer",
    "Cleaner",
    "Driver",
    "Maintenance Officer",
    "Other / Custom position",
  ],
};
const recruitmentChannels = ["All", "SEEK", "Indeed", "Provider careers page", "LinkedIn"];
const candidateChannel = (source: string) => source.toLowerCase() === "direct" || source.toLowerCase() === "referral" ? "Provider careers page" : source;

export function Recruitment() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<"job" | "candidate" | null>(null);
  const [formError, setFormError] = useState("");
  const [pipelineView,setPipelineView]=useState<"active"|"hired"|"archive">("active");
  const [publishChannels,setPublishChannels]=useState<string[]>(["SEEK","Indeed","Provider careers page"]);
  const [distributionNotice,setDistributionNotice]=useState("");
  const [advertisingOpen, setAdvertisingOpen] = useState(false);
  const [jobsScreenOpen, setJobsScreenOpen] = useState(false);
  const [advertisingChannel, setAdvertisingChannel] = useState("All");
  const { data = [], isLoading } = useQuery({ queryKey: ["candidates"], queryFn: api.candidates });
  const { data: jobs = [] } = useQuery({ queryKey: ["jobs"], queryFn: api.jobs });
  const refresh = () => { queryClient.invalidateQueries({ queryKey: ["candidates"] }); queryClient.invalidateQueries({ queryKey: ["jobs"] }); };
  const move = useMutation({ mutationFn: ({ id, stage }: { id: string; stage: CandidateStage }) => api.moveCandidate(id, stage), onSuccess: refresh });
  const createCandidate = useMutation({ mutationFn: api.createCandidate, onSuccess: () => { refresh(); setDialog(null); }, onError: (error) => setFormError(error instanceof ApiError ? error.message : "Unable to add candidate") });
  const createJob = useMutation({ mutationFn: api.createJob, onSuccess: () => { refresh(); setDialog(null); }, onError: (error) => setFormError(error instanceof ApiError ? error.message : "Unable to create job") });
  const convert = useMutation({ mutationFn: api.convertCandidate, onSuccess: refresh });
  const visible = useMemo(() => data.filter((candidate) => `${candidate.firstName} ${candidate.lastName} ${candidate.email}`.toLowerCase().includes(query.toLowerCase())), [data, query]);
  const active = visible.filter((candidate) => !["hired", "rejected", "withdrawn"].includes(candidate.stage));
  const publishedJobs = jobs.filter((job) => job.status === "open");
  const channelsForJob = (job: (typeof jobs)[number]) => job.channels?.length ? job.channels : job.status === "open" ? ["SEEK", "Indeed", "Provider careers page"] : [];
  const advertisingJobs = publishedJobs.filter((job) => advertisingChannel === "All" || channelsForJob(job).includes(advertisingChannel));
  const applicationsFor = (jobId: string, channel?: string) => data.filter((candidate) => candidate.jobId === jobId && (!channel || channel === "All" || candidateChannel(candidate.source).toLowerCase() === channel.toLowerCase())).length;

  const submitCandidate = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormError(""); const values = Object.fromEntries(new FormData(event.currentTarget).entries()); const position = values.position?.toString() ?? ""; const matchedJob = jobs.find((job) => job.id === position); const enteredNotes = values.notes?.toString().trim(); createCandidate.mutate({ jobId: matchedJob?.id, firstName: values.firstName.toString(), lastName: values.lastName.toString(), email: values.email.toString(), phone: values.phone?.toString() || undefined, location: values.location.toString(), score: 0, source: values.source.toString(), notes: [matchedJob ? "" : position ? `Position interest: ${position}` : "", enteredNotes].filter(Boolean).join("\n") || undefined }); };
  const submitJob = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormError(""); const values = Object.fromEntries(new FormData(event.currentTarget).entries()); setDistributionNotice(values.status==="open"&&publishChannels.length?`Publishing requested for ${publishChannels.join(", ")}. Applications will arrive in Applied with their source recorded.`:"Position saved as a Provider.ai draft."); createJob.mutate({ title: values.title.toString(), location: values.location.toString(), employmentType: values.employmentType.toString(), description: values.description.toString(), status: values.status as "draft" | "open", channels: values.status === "open" ? publishChannels : [] }); };

  if (jobsScreenOpen) return <JobsScreen jobs={jobs} candidates={data} onBack={() => setJobsScreenOpen(false)} />;

  return <section className="page w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[15px] leading-normal recruitment-page [font-size:12px] [font-size:15px] [line-height:1.5]">
    <PageHeader category="Your team" title="Recruitment" description="Manage open roles, review candidates and move new starters into onboarding."><button className="primary-button min-h-11" onClick={() => { setFormError(""); setDialog("job"); }}><Plus className="size-4" />New job</button></PageHeader>
    <div className="recruitment-stats mb-5 flex items-center gap-7 border-b border-line pb-4 max-[570px]:gap-4 [&>div]:flex [&>div]:items-baseline [&>div]:gap-2 [&_strong]:text-[20px] [&_strong]:leading-none [&_small]:text-[11px] [&_small]:text-muted">
<div>
<strong>{jobs.filter((job) => job.status === "open").length}</strong>
<small>Open positions</small>
</div>
<div>
<strong>{active.length}</strong>
<small>Active candidates</small>
</div>
<div>
<strong>{data.filter((candidate) => candidate.stage === "interview").length}</strong>
<small>Interview stage</small>
</div>
</div>
    {distributionNotice&&<div className="distribution-notice [margin-bottom:14px] [padding:12px_14px] [border-radius:11px] [color:#247f5f] [background:#e8f7f1] [display:flex] [align-items:center] [gap:10px] [&_span]:[flex:1] [&_strong]:[display:block] [&_small]:[display:block] [&_small]:[margin-top:3px] [&_small]:[font-size:11px] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:inherit]">
<Check/>
<span>
<strong>Job distribution updated</strong>
<small>{distributionNotice}</small>
</span>
<button onClick={()=>setDistributionNotice("")}>
<X/>
</button>
</div>}
    <article className="job-distribution mb-3 rounded-lg border border-line bg-white">
<div className="distribution-heading flex items-center justify-between gap-4 px-3 py-2.5 [&_strong]:block [&_strong]:text-[12px] [&_small]:mt-0.5 [&_small]:block [&_small]:text-[11px] [&_small]:text-muted">
<div>
<strong>Job advertising</strong>
<small>Provider.ai distributes ads for your organisation and receives applications into this pipeline.</small>
</div>
<div className="flex items-center gap-3">
<button onClick={() => setJobsScreenOpen(true)} className="border-0 bg-transparent p-0 text-[11px] font-bold text-[#555566] hover:text-brand-700">View all jobs</button>
<button onClick={()=>setDialog("job")} className="border-0 bg-transparent p-0 text-[11px] font-bold text-brand-700 hover:text-brand-800">Create and publish</button>
<button onClick={() => setAdvertisingOpen((open) => !open)} className="flex items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-semibold text-muted hover:text-ink">{advertisingOpen ? "Hide channels" : "View channels"}<ChevronDown className={`size-3 transition ${advertisingOpen ? "rotate-180" : ""}`} /></button>
</div>
</div>
{advertisingOpen && (
<div className="border-t border-line px-3 pb-3 pt-2.5">
<div className="mb-2.5 flex gap-1 overflow-x-auto rounded-lg bg-[#eef4fa] p-1">
{recruitmentChannels.map((channel) => {
  const channelJobs = channel === "All" ? publishedJobs : publishedJobs.filter((job) => channelsForJob(job).includes(channel));
  const applicationCount = channelJobs.reduce((total, job) => total + applicationsFor(job.id, channel), 0);
  return <button key={channel} onClick={() => setAdvertisingChannel(channel)} className={`flex min-w-max items-center gap-2 rounded-md border-0 px-3 py-2 text-[11px] font-bold ${advertisingChannel === channel ? "bg-white text-brand-700 shadow-sm" : "bg-transparent text-muted"}`}>{channel}<span className="rounded bg-black/5 px-1.5 py-0.5 text-[11px]">{channelJobs.length} jobs · {applicationCount}</span></button>;
})}
</div>
<div className="divide-y divide-line rounded-lg border border-line bg-white">
{advertisingJobs.length ? advertisingJobs.map((job) => <button key={job.id} onClick={() => setJobsScreenOpen(true)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-0 bg-white px-3 py-2.5 text-left hover:bg-brand-50"><span><strong className="block text-[11px]">{job.title}</strong><small className="mt-0.5 block text-[11px] text-muted">{job.location} · {channelsForJob(job).join(" · ")}</small></span><span className="text-right"><b className="block text-[13px] text-ink">{applicationsFor(job.id, advertisingChannel)}</b><small className="text-[11px] text-muted">applications</small></span></button>) : <div className="px-3 py-6 text-center text-[11px] text-muted">No active jobs on this channel.</div>}
</div>
</div>
)}
</article>
    <div className="board-tools mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-2.5 shadow-sm">
<div className="pipeline-tabs flex shrink-0 gap-1 rounded-lg bg-[#eef4fa] p-1 [&_button]:flex [&_button]:items-center [&_button]:gap-2 [&_button]:rounded-md [&_button]:border-0 [&_button]:px-3 [&_button]:py-2 [&_button]:text-[12px] [&_button]:font-bold [&_button]:text-[#757584] [&_button.active]:bg-white [&_button.active]:text-brand-700 [&_button.active]:shadow-sm [&_em]:rounded-md [&_em]:bg-black/5 [&_em]:px-1.5 [&_em]:py-0.5 [&_em]:text-[11px] [&_em]:font-bold [&_em]:not-italic [&_button.active_em]:bg-brand-100">
<button className={pipelineView==="active"?"active":""} onClick={()=>setPipelineView("active")}>Active pipeline <em>{active.length}</em>
</button>
<button className={pipelineView==="hired"?"active":""} onClick={()=>setPipelineView("hired")}>Hired <em>{data.filter((candidate)=>candidate.stage==="hired").length}</em>
</button>
<button className={pipelineView==="archive"?"active":""} onClick={()=>setPipelineView("archive")}>Archive <em>{data.filter((candidate)=>["rejected","withdrawn"].includes(candidate.stage)).length}</em>
</button>
</div>
<label className="flex h-10 min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-line bg-white px-3 text-muted focus-within:border-brand-300 focus-within:ring-3 focus-within:ring-brand-100">
<Search className="size-4 shrink-0" />
<input className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-ink outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates…" />
</label>
<div className="ml-auto flex shrink-0 items-center gap-2">
<button className="filter-button flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-[12px] font-semibold text-[#555566] hover:bg-[#f6f9fd]">
<Filter size={17} /> All jobs <ChevronDown size={15} />
</button>
<button className="filter-button flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-[12px] font-semibold text-[#555566] hover:bg-[#f6f9fd]">
<SlidersHorizontal size={17} /> Filter</button>
</div>
</div>
    {isLoading ? <div className="board-loading">Loading your talent pipeline…</div> : pipelineView==="active"?<div className="kanban-board [display:grid] [grid-template-columns:repeat(4,minmax(220px,1fr))] [gap:13px] [align-items:start] [overflow-x:auto] [padding-bottom:10px] max-[1100px]:[grid-template-columns:repeat(4,260px)] max-[570px]:[grid-template-columns:repeat(4,250px)]">{stages.map((stage) => <section className="kanban-column [&_header_button]:[border:0] [&_header_button]:[background:transparent] [&_header_button]:[cursor:pointer] [&_header_button]:[color:#aaaab8] [min-height:420px] [padding:12px] [border:1px_solid_#e1ebf6] [border-radius:14px] [background:#f1f2f7] [&_header]:[height:32px] [&_header]:[display:flex] [&_header]:[align-items:center] [&_header]:[gap:7px] [&_header]:[padding:0_3px_10px] [&_header_h2]:[margin:0] [&_header_h2]:[font:700_11px_var(--font-sans)] [&_header_em]:[background:#dae6f4] [&_header_em]:[border-radius:6px] [&_header_em]:[padding:3px_6px] [&_header_em]:[color:#777788] [&_header_em]:[font-size:11px] [&_header_em]:[font-style:normal] [&_header_button]:[margin-left:auto] [&_header_h2]:[font-size:13px] [&_header_em]:[font-size:13px]" key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const id = event.dataTransfer.getData("candidate-id"); if (id) move.mutate({ id, stage: stage.id }); }}>
<header>
<span className={`stage-dot [width:7px] [height:7px] [border-radius:50%] [background:#398ed5] [&.amber]:[background:#e69a42] [&.violet]:[background:#68a4e9] [&.green]:[background:#2da57d] ${stage.colour}`} />
<h2>{stage.label}</h2>
<em>{active.filter((candidate) => candidate.stage === stage.id).length}</em>
<button aria-label={`More ${stage.label} options`}>
<MoreHorizontal size={18} />
</button>
</header>
<div className="candidate-list [display:grid] [gap:9px]">{active.filter((candidate) => candidate.stage === stage.id).map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} jobTitle={jobs.find((job) => job.id === candidate.jobId)?.title} onHire={() => convert.mutate(candidate.id)} onRemove={()=>move.mutate({id:candidate.id,stage:"rejected"})} />)}</div>
<button className="add-candidate [width:100%] [border:0] [background:transparent] [color:#888898] [display:flex] [justify-content:center] [align-items:center] [gap:5px] [padding:14px_5px_4px] [font-size:11px] [cursor:pointer] [font-size:13px]" onClick={() => { setFormError(""); setDialog("candidate"); }}>
<Plus size={15} /> Add candidate</button>
</section>)}</div>:<CandidateArchive candidates={visible.filter((candidate)=>pipelineView==="hired"?candidate.stage==="hired":["rejected","withdrawn"].includes(candidate.stage))} jobs={jobs}/>}
    {dialog === "candidate" && <Dialog title="Add candidate" subtitle="Add a person to your recruitment pipeline." onClose={() => setDialog(null)}>
<form className="modal-form [display:grid] [gap:15px] [&_label]:[display:grid] [&_label]:[gap:7px] [&_label]:[color:#555567] [&_label]:[font-size:11px] [&_label]:[font-weight:700] [&_input]:[width:100%] [&_input]:[border:1px_solid_#dddfd7] [&_input]:[border-radius:10px] [&_input]:[padding:11px_12px] [&_input]:[background:white] [&_input]:[color:var(--ink)] [&_input]:[outline:0] [&_input]:[font-size:12px] [&_input]:[font-weight:400] [&_input]:[transition:border_.15s,box-shadow_.15s] [&_select]:[width:100%] [&_select]:[border:1px_solid_#dddfd7] [&_select]:[border-radius:10px] [&_select]:[padding:11px_12px] [&_select]:[background:white] [&_select]:[color:var(--ink)] [&_select]:[outline:0] [&_select]:[font-size:12px] [&_select]:[font-weight:400] [&_select]:[transition:border_.15s,box-shadow_.15s] [&_textarea]:[width:100%] [&_textarea]:[border:1px_solid_#dddfd7] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:11px_12px] [&_textarea]:[background:white] [&_textarea]:[color:var(--ink)] [&_textarea]:[outline:0] [&_textarea]:[font-size:12px] [&_textarea]:[font-weight:400] [&_textarea]:[transition:border_.15s,box-shadow_.15s] [&_input:focus]:[border-color:#70a9eb] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_select:focus]:[border-color:#70a9eb] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea:focus]:[border-color:#70a9eb] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea]:[resize:vertical] [&_textarea]:[font-family:inherit]" onSubmit={submitCandidate}>
<div className="form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:12px]">
<Field label="First name" name="firstName" required />
<Field label="Last name" name="lastName" required />
</div>
<Field label="Email" name="email" type="email" required />
<div className="form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:12px]">
<Field label="Phone" name="phone" />
<Field label="Location" name="location" required />
</div>
<label>Position<select name="position" defaultValue="">
<option value="">No position selected</option>
{jobs.length > 0 && <optgroup label="Current open positions">{jobs.map((job) => <option value={job.id} key={job.id}>{job.title}</option>)}</optgroup>}
{Object.entries(ndisPositions).map(([group, positions]) => (
  <optgroup label={group} key={group}>
    {positions.map((position) => <option value={position} key={position}>{position}</option>)}
  </optgroup>
))}
</select>
</label>
<label>Source<select name="source" defaultValue="direct">
<option value="direct">Direct application</option>
<option value="referral">Employee referral</option>
<option value="seek">SEEK</option>
<option value="indeed">Indeed</option>
<option value="careers">Provider careers page</option>
<option value="linkedin">LinkedIn</option>
</select>
</label>
<label>Notes<textarea name="notes" rows={3} placeholder="Relevant experience or initial observations" />
</label>{formError && <div className="form-error [padding:10px_12px] [border-radius:9px] [color:#a93c51] [background:#fff0f2] [font-size:11px] [line-height:1.4]">{formError}</div>}<ModalActions busy={createCandidate.isPending} label="Add candidate" onCancel={() => setDialog(null)} />
</form>
</Dialog>}
    {dialog === "job" && <Dialog title="Create and advertise a position" subtitle="Create the role once, then distribute it under your organisation’s employer identity." onClose={() => setDialog(null)}>
<form className="modal-form [display:grid] [gap:15px] [&_label]:[display:grid] [&_label]:[gap:7px] [&_label]:[color:#555567] [&_label]:[font-size:11px] [&_label]:[font-weight:700] [&_input]:[width:100%] [&_input]:[border:1px_solid_#dddfd7] [&_input]:[border-radius:10px] [&_input]:[padding:11px_12px] [&_input]:[background:white] [&_input]:[color:var(--ink)] [&_input]:[outline:0] [&_input]:[font-size:12px] [&_input]:[font-weight:400] [&_input]:[transition:border_.15s,box-shadow_.15s] [&_select]:[width:100%] [&_select]:[border:1px_solid_#dddfd7] [&_select]:[border-radius:10px] [&_select]:[padding:11px_12px] [&_select]:[background:white] [&_select]:[color:var(--ink)] [&_select]:[outline:0] [&_select]:[font-size:12px] [&_select]:[font-weight:400] [&_select]:[transition:border_.15s,box-shadow_.15s] [&_textarea]:[width:100%] [&_textarea]:[border:1px_solid_#dddfd7] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:11px_12px] [&_textarea]:[background:white] [&_textarea]:[color:var(--ink)] [&_textarea]:[outline:0] [&_textarea]:[font-size:12px] [&_textarea]:[font-weight:400] [&_textarea]:[transition:border_.15s,box-shadow_.15s] [&_input:focus]:[border-color:#70a9eb] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_select:focus]:[border-color:#70a9eb] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea:focus]:[border-color:#70a9eb] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea]:[resize:vertical] [&_textarea]:[font-family:inherit]" onSubmit={submitJob}>
<label>Position
<select name="title" defaultValue="Disability Support Worker" required>
{Object.entries(ndisPositions).map(([group, positions]) => (
  <optgroup label={group} key={group}>
    {positions.map((position) => <option value={position} key={position}>{position}</option>)}
  </optgroup>
))}
</select>
</label>
<div className="form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:12px]">
<Field label="Location" name="location" required placeholder="Parramatta, NSW" />
<label>Employment type<select name="employmentType" defaultValue="casual">
<option value="casual">Casual</option>
<option value="part-time">Part-time</option>
<option value="full-time">Full-time</option>
<option value="contract">Contract</option>
</select>
</label>
</div>
<label>Description<textarea name="description" rows={5} required minLength={10} placeholder="Describe the role, responsibilities and ideal candidate…" />
</label>
<div className="publishing-options [display:grid] [gap:7px] [padding:13px] [border:1px_solid_var(--border)] [border-radius:10px] [background:#f7f7f4] [&>strong]:[display:block] [&>small]:[display:block] [&>strong]:[font-size:11px] [&>small]:[color:#72756d] [&>small]:[font-size:11px] [&>small]:[line-height:1.45] [&_label]:[padding:9px] [&_label]:[border-radius:8px] [&_label]:[background:white] [&_label]:[display:grid] [&_label]:[grid-template-columns:18px_1fr_auto] [&_label]:[align-items:center] [&_label]:[gap:8px] [&_label]:[text-transform:none] [&_label]:[letter-spacing:0] [&_input]:[accent-color:#599ce8] [&_span]:[font-size:11px] [&_span]:[font-weight:700] [&_em]:[color:#9292a1] [&_em]:[font-size:11px] [&_em]:[font-style:normal]">
<strong>Advertise on</strong>
<small>The provider remains the named employer. Provider.ai is the recruitment software and distribution partner.</small>{["SEEK","Indeed","Provider careers page"].map((channel)=>
<label key={channel}>
<input type="checkbox" checked={publishChannels.includes(channel)} onChange={()=>setPublishChannels((current)=>current.includes(channel)?current.filter((item)=>item!==channel):[...current,channel])}/>
<span>{channel}</span>
<em>{channel==="Provider careers page"?"Included":"Partner connection"}</em>
</label>)}</div>
<label>Status<select name="status" defaultValue="open">
<option value="open">Publish selected channels</option>
<option value="draft">Save as draft</option>
</select>
</label>{formError && <div className="form-error [padding:10px_12px] [border-radius:9px] [color:#a93c51] [background:#fff0f2] [font-size:11px] [line-height:1.4]">{formError}</div>}<ModalActions busy={createJob.isPending} label="Create and publish" onCancel={() => setDialog(null)} />
</form>
</Dialog>}
  </section>;
}
