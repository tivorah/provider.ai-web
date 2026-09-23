import type { DashboardWidgetModel, WidgetLayout } from "../features/dashboard/types";
import type { DashboardData } from "../types";

const sourceItems: Record<string,string[]> = {
  Roster:["Tue 09:00 · Lucas Brown · Open shift","Wed 13:00 · Ethan Carter · Ava Williams","Fri 08:00 · Grace Martin · Jack Harris","Sat 09:00 · Weekend support · Confirmed"],
  People:["Oliver Moore · Onboarding in progress","Liam Smith · Screening renewal due","Amelia Taylor · Availability updated","Jack Harris · Supervision due"],
  Participants:["Isla Wilson · Plan review required","Ethan Carter · Spending on track","Grace Martin · Agreement renewal due","Lucas Brown · Goal progress improving"],
  Finance:["NDIA managed · $99,500 · 54%","Plan managed · $57,100 · 31%","Self managed · $27,660 · 15%","Claim exceptions · $2,960 · Review"],
  Compliance:["Worker screening · 96% · 2 actions","Incident management · 92% · 1 action","Risk management · 87% · 3 actions","Governance · 94% · 2 actions"],
  "Shared inbox":["Maya Singh · Support schedule updated","Plan Partners · Remittance received","Oliver Moore · Onboarding completed","NDIS Commission · Portal notice"],
  Recruitment:["Amelia Scott · Interview Tuesday","Noah Wilson · Screening complete","Mia Brown · Offer awaiting response","Luca Chen · Application received"]
};

const baseData:Array<[string,string,string,string,string,string]> = [
  ["open-shifts","Open shifts","Roster","4","Shifts requiring a worker","amber"],
  ["coverage","Roster coverage","Roster","94%","Confirmed coverage this week","mint"],
  ["credentials","Credential expiries","People","5","Due in the next 30 days","rose"],
  ["onboarding","Onboarding progress","People","3","Employees still onboarding","indigo"],
  ["plans","Plans needing review","Participants","4","Participant plans requiring attention","amber"],
  ["utilisation","Plan utilisation","Participants","68%","Average current plan utilisation","indigo"],
  ["claims","Claim exceptions","Finance","3","Claims requiring correction","rose"],
  ["revenue","Monthly revenue","Finance","$184k","Revenue recorded this month","mint"],
  ["compliance","Compliance actions","Compliance","12","Open quality and safeguard actions","amber"],
  ["inbox","Unread messages","Shared inbox","8","Across connected shared mailboxes","indigo"],
  ["candidates","Active candidates","Recruitment","5","Currently in recruitment","indigo"],
  ["incidents","Incident follow-ups","Compliance","2","Corrective actions still open","rose"]
];

const base:DashboardWidgetModel[] = baseData.map(([id,title,source,value,detail,tone])=>({id:`template-${id}`,title,source,value,detail,tone}));

const extras:Array<[string,string,string,string,string,string]> = [
  ["cancelled-shifts","Cancelled shifts","Roster","3","Cancelled services this week","rose"],["overtime-risk","Overtime risk","Roster","2","Workers approaching overtime","amber"],["late-notes","Late shift notes","Roster","6","Notes not submitted on time","amber"],["worker-utilisation","Worker utilisation","Roster","83%","Available workforce capacity used","indigo"],["service-continuity","Service continuity","Roster","92%","Services delivered by a familiar worker","mint"],["travel-time","Travel time","Roster","38h","Projected worker travel this week","indigo"],
  ["active-people","Active employees","People","42","Current active workforce","mint"],["leave-requests","Leave requests","People","4","Requests awaiting approval","amber"],["training-due","Training due","People","7","Training items due this month","rose"],["supervision-due","Supervision due","People","5","Employee supervisions requiring booking","amber"],["availability-gaps","Availability gaps","People","8","Employees missing current availability","rose"],["birthdays","Team milestones","People","3","Birthdays and work anniversaries this month","indigo"],
  ["active-participants","Active participants","Participants","38","Participants receiving current services","mint"],["plan-renewals","Upcoming plan renewals","Participants","6","Plans renewing in the next 60 days","amber"],["unspent-funding","Unspent funding risk","Participants","$92k","Available funding at risk of underspend","amber"],["goals-progress","Goal progress","Participants","74%","Average recorded outcome progress","mint"],["service-agreements","Service agreements","Participants","4","Agreements requiring renewal","rose"],["participant-birthdays","Participant milestones","Participants","2","Important dates this month","indigo"],
  ["outstanding-invoices","Outstanding invoices","Finance","$32.8k","Current accounts receivable","amber"],["paid-invoices","Paid invoices","Finance","$146k","Payments received this month","mint"],["payroll-cost","Payroll cost","Finance","$18.9k","Current fortnight projection","indigo"],["gross-margin","Gross margin","Finance","34.8%","Projected service delivery margin","mint"],["revenue-leakage","Revenue leakage","Finance","1.3%","Delivered value not yet billable","rose"],["ndia-rejections","NDIA rejections","Finance","2","Claims rejected by the portal","rose"],
  ["audit-readiness","Audit readiness","Compliance","94%","Evidence readiness across standards","mint"],["policy-reviews","Policy reviews","Compliance","5","Policies due for scheduled review","amber"],["incidents-open","Open incidents","Compliance","3","Incidents awaiting closure","rose"],["complaints-open","Open complaints","Compliance","2","Complaints with active actions","amber"],["risk-reviews","Risk reviews","Compliance","4","Risk assessments requiring review","rose"],["evidence-missing","Missing evidence","Compliance","8","Practice-standard evidence gaps","rose"],
  ["unread-care-mail","Unread care email","Shared inbox","5","Unread participant and care messages","indigo"],["follow-up-mail","Email follow-ups","Shared inbox","4","Messages marked for follow-up","amber"],["draft-emails","Draft emails","Shared inbox","2","Unsent team drafts","indigo"],["interviews","Upcoming interviews","Recruitment","3","Interviews scheduled this week","mint"],["offers","Offers awaiting response","Recruitment","2","Candidate offers still open","amber"],["time-to-hire","Average time to hire","Recruitment","18d","Average recruitment cycle","indigo"]
];

const layoutFor=(source:string,id:string):WidgetLayout=>source==="Finance"?(/revenue|margin|paid|payroll|leakage/.test(id)?"chart":"breakdown"):source==="Roster"?(/coverage|utilisation|continuity/.test(id)?"progress":/open|cancelled|late/.test(id)?"schedule":"list"):source==="Participants"?(/utilisation|goals|funding/.test(id)?"progress":"list"):source==="Compliance"?(/readiness|compliance/.test(id)?"progress":"list"):source==="Recruitment"&&/time-to-hire/.test(id)?"chart":"list";
const enrich=(widget:DashboardWidgetModel):DashboardWidgetModel=>{
  const layout=widget.layout??layoutFor(widget.source??"",widget.id);
  return {...widget,size:widget.size??(layout==="metric"?"compact":"wide"),items:sourceItems[widget.source??""]??[],layout};
};

const extraWidgets: DashboardWidgetModel[] = extras.map(([id,title,source,value,detail,tone])=>({id:`template-${id}`,title,source,value,detail,tone}));
const detailedWidgets: DashboardWidgetModel[] = [
  {id:"template-people-list",title:"People needing attention",value:"5",detail:"Team members with onboarding or credential actions",tone:"amber",source:"People",layout:"list",size:"wide",items:["Oliver Moore · onboarding 65%","Liam Smith · 2 credentials expiring","Amelia Taylor · WWCC renewal","Sophie Nguyen · contract awaiting signature","Jack Harris · supervision due"]},
  {id:"template-payroll-update",title:"Payroll update",value:"Ready",detail:"Fortnight ending 9 August",tone:"mint",source:"Finance",layout:"status",size:"wide",items:["42 employees included","1,124 approved hours","$18,936 projected gross pay","2 timesheets need review"]},
];

const generalWidgets: DashboardWidgetModel[] = [
  {id:"template-digital-clock",title:"Digital clock",value:"",detail:"Local time and date",tone:"indigo",source:"General",layout:"digital-clock",size:"compact"},
  {id:"template-analog-clock",title:"Round clock",value:"",detail:"Local time",tone:"violet",source:"General",layout:"analog-clock",size:"compact"},
  {id:"template-calendar",title:"Calendar",value:"",detail:"Current month at a glance",tone:"mint",source:"General",layout:"calendar",size:"wide"},
  {id:"template-fair-work-updates",title:"Fair Work information",value:"Updates",detail:"Workplace rights, awards and employer guidance",tone:"amber",source:"Fair Work",layout:"list",size:"wide",items:["Minimum pay and awards · Check current classifications and rates","Leave and public holidays · Review employee entitlements","Record keeping · Maintain required employment records","Workplace changes · Follow consultation obligations"]},
  {id:"template-ndis-news",title:"Important NDIS updates",value:"Latest",detail:"Operational news and scheme information",tone:"indigo",source:"NDIS updates",layout:"list",size:"wide",items:["Commission updates · Provider obligations and guidance","Pricing updates · Current pricing arrangements and limits","Portal notices · Service availability and changes","Policy news · Changes affecting providers and participants"]},
  {id:"template-quick-links",title:"Quick links",value:"Links",detail:"Frequently used provider resources",tone:"mint",source:"General",layout:"list",size:"wide",items:["NDIS Commission · Provider portal","Fair Work Ombudsman · Employer guidance","PRODA · Government services","Provider.ai · Workspace settings"]},
];

export const widgetTemplates:DashboardWidgetModel[]=[...generalWidgets,...base,...extraWidgets,...detailedWidgets].map(enrich);

export const defaultOperationalWidgets=(roster:Array<{time:string;participant:string;worker:string;status:string}>,attention:Array<{title:string;detail:string}>):DashboardWidgetModel[]=>[
  {id:"today-roster",title:"Today’s roster",value:"24",detail:"Saturday, 1 August · 24 shifts",tone:"indigo",source:"Roster",layout:"schedule",size:"wide",items:roster.map(shift=>`${shift.time} · ${shift.participant} · ${shift.worker} · ${shift.status}`)},
  {id:"needs-attention",title:"Needs attention",value:String(attention.length),detail:"Prioritised operational actions",tone:"rose",source:"Operations",layout:"list",size:"wide",items:attention.map(item=>`${item.title} · ${item.detail}`)},
  {id:"morning-briefing",title:"Morning briefing",value:"AI",detail:"Coverage is strong; one afternoon shift may affect continuity.",tone:"indigo",source:"Provider intelligence",layout:"status",size:"compact",items:["Coverage is strong today","One open afternoon shift","No critical incidents"]}
];

export const widgetAudiences = [
  "Administrators",
  "Managers",
  "People team",
  "Finance team",
  "Roster coordinators",
  "Entire team",
] as const;

export const widgetTrendBars = [42, 57, 49, 68, 62, 78, 74, 88, 82, 94];

export function createDashboardWidgetSet(data: DashboardData): DashboardWidgetModel[] {
  const summaryWidgets: DashboardWidgetModel[] = [
    ...data.widgets,
    { id:"plan-utilisation", title:"Participant plan utilisation", value:"68%", detail:"4 plans need review", tone:"indigo" },
    { id:"credential-expiry", title:"Credential expiries", value:"5", detail:"Due in the next 30 days", tone:"amber" },
    { id:"revenue-margin", title:"Revenue and margin", value:"34.8%", detail:"$184,260 this month", tone:"mint" },
  ];
  return [...summaryWidgets, ...defaultOperationalWidgets(data.roster, data.attention)];
}

export function createDefaultDashboardWidgetIds(data: DashboardData): string[] {
  return [
    ...data.widgets.map((widget) => widget.id),
    "today-roster",
    "needs-attention",
    "morning-briefing",
  ];
}
