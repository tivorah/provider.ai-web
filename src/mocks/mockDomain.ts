export const participants = [
  { id:"p1", initials:"EC", name:"Ethan Carter", pronouns:"he/him", ndis:"4312 876 542", plan:"Agency managed", coordinator:"Maya Singh", location:"Parramatta", status:"Active", risk:"Low", budget:128400, used:71620, renewal:"18 Dec 2026", goals:4, nextShift:"Today, 8:00 am", colour:"violet" },
  { id:"p2", initials:"GM", name:"Grace Martin", pronouns:"she/her", ndis:"4308 145 991", plan:"Plan managed", coordinator:"Daniel Wu", location:"Ryde", status:"Active", risk:"Medium", budget:86400, used:60780, renewal:"2 Oct 2026", goals:3, nextShift:"Today, 10:30 am", colour:"mint" },
  { id:"p3", initials:"LB", name:"Lucas Brown", pronouns:"he/him", ndis:"4315 290 113", plan:"Plan managed", coordinator:"Maya Singh", location:"Penrith", status:"Active", risk:"Low", budget:154200, used:82310, renewal:"22 Feb 2027", goals:5, nextShift:"Today, 1:00 pm", colour:"amber" },
  { id:"p4", initials:"IW", name:"Isla Wilson", pronouns:"she/her", ndis:"4301 652 884", plan:"Self managed", coordinator:"Aisha Patel", location:"Liverpool", status:"Active", risk:"High", budget:211800, used:166120, renewal:"9 Sep 2026", goals:4, nextShift:"Today, 3:30 pm", colour:"rose" },
  { id:"p5", initials:"NS", name:"Noah Smith", pronouns:"they/them", ndis:"4310 882 417", plan:"Agency managed", coordinator:"Daniel Wu", location:"Blacktown", status:"Onboarding", risk:"Low", budget:97500, used:14200, renewal:"14 May 2027", goals:2, nextShift:"Mon, 9:00 am", colour:"blue" }
];

export const people = [
  { id:"w1", initials:"AW", name:"Ava Williams", role:"Disability Support Worker", type:"Part-time", location:"Parramatta", readiness:100, status:"Roster ready", hours:28, capacity:32, credentials:8, expiring:0, colour:"violet" },
  { id:"w2", initials:"JH", name:"Jack Harris", role:"Senior Support Worker", type:"Full-time", location:"Blacktown", readiness:100, status:"Roster ready", hours:34, capacity:38, credentials:10, expiring:0, colour:"mint" },
  { id:"w3", initials:"AT", name:"Amelia Taylor", role:"Disability Support Worker", type:"Casual", location:"Liverpool", readiness:92, status:"Action needed", hours:21, capacity:30, credentials:7, expiring:1, colour:"amber" },
  { id:"w4", initials:"LS", name:"Liam Smith", role:"Disability Support Worker", type:"Casual", location:"Penrith", readiness:78, status:"Expiring soon", hours:16, capacity:26, credentials:6, expiring:2, colour:"rose" },
  { id:"w5", initials:"ZK", name:"Zoe King", role:"Support Coordinator", type:"Full-time", location:"Sydney", readiness:100, status:"Roster ready", hours:36, capacity:38, credentials:5, expiring:0, colour:"blue" },
  { id:"w6", initials:"OM", name:"Oliver Moore", role:"Disability Support Worker", type:"Part-time", location:"Ryde", readiness:65, status:"Onboarding", hours:0, capacity:24, credentials:4, expiring:0, colour:"slate" }
];

export const weekDays = ["Mon 3", "Tue 4", "Wed 5", "Thu 6", "Fri 7", "Sat 8", "Sun 9"];
const baseRosterShifts = [
  { id:"s1", day:0, start:8, duration:3, participant:"Ethan Carter", worker:"Ava Williams", service:"Daily activities", status:"confirmed", margin:31, colour:"violet" },
  { id:"s2", day:0, start:12, duration:4, participant:"Grace Martin", worker:"Jack Harris", service:"Community access", status:"confirmed", margin:28, colour:"mint" },
  { id:"s3", day:1, start:9, duration:3, participant:"Lucas Brown", worker:"Open shift", service:"Social participation", status:"open", margin:24, colour:"amber" },
  { id:"s4", day:1, start:14, duration:3, participant:"Isla Wilson", worker:"Amelia Taylor", service:"Personal activities", status:"warning", margin:19, colour:"rose" },
  { id:"s5", day:2, start:7, duration:5, participant:"Ethan Carter", worker:"Liam Smith", service:"Daily activities", status:"confirmed", margin:29, colour:"blue" },
  { id:"s6", day:2, start:13, duration:4, participant:"Noah Smith", worker:"Ava Williams", service:"Community access", status:"confirmed", margin:33, colour:"violet" },
  { id:"s7", day:3, start:10, duration:5, participant:"Grace Martin", worker:"Jack Harris", service:"Capacity building", status:"confirmed", margin:26, colour:"mint" },
  { id:"s8", day:4, start:8, duration:4, participant:"Lucas Brown", worker:"Open shift", service:"Daily activities", status:"open", margin:22, colour:"amber" },
  { id:"s9", day:4, start:13, duration:4, participant:"Isla Wilson", worker:"Amelia Taylor", service:"Community access", status:"confirmed", margin:27, colour:"rose" },
  { id:"s10", day:5, start:9, duration:6, participant:"Ethan Carter", worker:"Ava Williams", service:"Weekend support", status:"confirmed", margin:21, colour:"violet" },
  { id:"s11", day:6, start:10, duration:5, participant:"Grace Martin", worker:"Liam Smith", service:"Weekend support", status:"warning", margin:18, colour:"blue" },
  { id:"s12", day:7, start:8, duration:4, participant:"Ethan Carter", worker:"Ava Williams", service:"Daily activities", status:"confirmed", margin:30, colour:"violet" },
  { id:"s13", day:7, start:13, duration:3, participant:"Noah Smith", worker:"Jack Harris", service:"Community access", status:"confirmed", margin:27, colour:"blue" },
  { id:"s14", day:8, start:7.5, duration:3.5, participant:"Grace Martin", worker:"Amelia Taylor", service:"Personal activities", status:"confirmed", margin:25, colour:"mint" },
  { id:"s15", day:8, start:13, duration:4, participant:"Lucas Brown", worker:"Open shift", service:"Social participation", status:"open", margin:23, colour:"amber" },
  { id:"s16", day:9, start:9, duration:5, participant:"Isla Wilson", worker:"Liam Smith", service:"Community access", status:"warning", margin:20, colour:"rose" },
  { id:"s17", day:9, start:15, duration:3, participant:"Ethan Carter", worker:"Ava Williams", service:"Daily activities", status:"confirmed", margin:32, colour:"violet" },
  { id:"s18", day:10, start:8, duration:4, participant:"Noah Smith", worker:"Jack Harris", service:"Capacity building", status:"confirmed", margin:29, colour:"blue" },
  { id:"s19", day:10, start:13, duration:5, participant:"Grace Martin", worker:"Amelia Taylor", service:"Community access", status:"confirmed", margin:26, colour:"mint" },
  { id:"s20", day:11, start:7, duration:5, participant:"Lucas Brown", worker:"Open shift", service:"Daily activities", status:"open", margin:22, colour:"amber" },
  { id:"s21", day:11, start:13, duration:4, participant:"Isla Wilson", worker:"Liam Smith", service:"Personal activities", status:"confirmed", margin:24, colour:"rose" },
  { id:"s22", day:12, start:9, duration:6, participant:"Ethan Carter", worker:"Ava Williams", service:"Weekend support", status:"confirmed", margin:21, colour:"violet" },
  { id:"s23", day:12, start:16, duration:3, participant:"Noah Smith", worker:"Jack Harris", service:"Community access", status:"confirmed", margin:28, colour:"blue" },
  { id:"s24", day:13, start:8, duration:5, participant:"Grace Martin", worker:"Amelia Taylor", service:"Weekend support", status:"confirmed", margin:23, colour:"mint" },
  { id:"s25", day:13, start:14, duration:4, participant:"Lucas Brown", worker:"Open shift", service:"Social participation", status:"open", margin:19, colour:"amber" },
  { id:"s26", day:2, start:9, duration:3, participant:"Grace Martin", worker:"Jack Harris", service:"Community access", status:"confirmed", margin:27, colour:"mint" },
  { id:"s27", day:7, start:9, duration:3, participant:"Lucas Brown", worker:"Liam Smith", service:"Social participation", status:"confirmed", margin:25, colour:"amber" }
];

const futureParticipants = ["Ethan Carter", "Grace Martin", "Lucas Brown", "Isla Wilson", "Noah Smith"];
const futureWorkers = ["Ava Williams", "Jack Harris", "Amelia Taylor", "Liam Smith", "Zoe King"];
const futureServices = ["Daily activities", "Community access", "Social participation", "Personal activities", "Capacity building", "Weekend support"];
const futureColours = ["violet", "mint", "amber", "rose", "blue"];
const futureRosterShifts = Array.from({ length: 84 }, (_, index) => index + 14).flatMap((day) =>
  Array.from({ length: 1 + (day % 3) }, (_, slot) => {
    const seed = day * 7 + slot * 11;
    const isOpen = seed % 17 === 0;
    const isWarning = !isOpen && seed % 19 === 0;
    return {
      id: `future-${day}-${slot}`,
      day,
      start: 7 + ((day + slot * 5) % 9),
      duration: 2.5 + ((day + slot) % 4) * 0.5,
      participant: futureParticipants[(day + slot * 2) % futureParticipants.length],
      worker: isOpen ? "Open shift" : futureWorkers[(day * 2 + slot) % futureWorkers.length],
      service: futureServices[(day + slot) % futureServices.length],
      status: isOpen ? "open" : isWarning ? "warning" : "confirmed",
      margin: 20 + (seed % 14),
      colour: futureColours[(day + slot) % futureColours.length],
    };
  }),
);

export const rosterShifts = [...baseRosterShifts, ...futureRosterShifts];

export const complianceItems = [
  { area:"Worker screening", score:96, evidence:42, issues:2, owner:"People team", tone:"mint" },
  { area:"Incident management", score:92, evidence:31, issues:1, owner:"Quality team", tone:"violet" },
  { area:"Complaints & feedback", score:100, evidence:18, issues:0, owner:"Operations", tone:"blue" },
  { area:"Risk management", score:87, evidence:26, issues:3, owner:"Quality team", tone:"amber" },
  { area:"Governance & policies", score:94, evidence:54, issues:2, owner:"Leadership", tone:"rose" },
  { area:"Service delivery", score:98, evidence:67, issues:1, owner:"Care team", tone:"mint" }
];

export const claims = [
  { id:"CLM-10842", participant:"Ethan Carter", period:"20–26 Jul", amount:4260.80, status:"Ready", items:14, payer:"NDIA" },
  { id:"CLM-10841", participant:"Grace Martin", period:"20–26 Jul", amount:3184.25, status:"Submitted", items:11, payer:"Plan Partners" },
  { id:"CLM-10840", participant:"Lucas Brown", period:"13–19 Jul", amount:5890.40, status:"Paid", items:18, payer:"Leap in!" },
  { id:"CLM-10839", participant:"Isla Wilson", period:"13–19 Jul", amount:2960.10, status:"Exception", items:9, payer:"NDIA" },
  { id:"CLM-10838", participant:"Noah Smith", period:"13–19 Jul", amount:1845.75, status:"Paid", items:6, payer:"Self managed" }
];

export const integrations = [
  { name:"Xero", category:"Accounting", status:"Available", description:"Sync invoices, contacts, payments and credit notes.", mark:"X", colour:"#13b5ea" },
  { name:"MYOB", category:"Accounting", status:"Available", description:"Connect accounting and payroll-ready records.", mark:"M", colour:"#578cc8" },
  { name:"QuickBooks", category:"Accounting", status:"Available", description:"Keep customers and approved invoices in sync.", mark:"Q", colour:"#2ca01c" },
  { name:"Microsoft 365", category:"Communications", status:"Connected", description:"Shared inbox, calendar and document collaboration.", mark:"M", colour:"#2563eb" },
  { name:"Google Workspace", category:"Communications", status:"Available", description:"Connect Gmail, Calendar and Drive.", mark:"G", colour:"#ea4335" },
  { name:"KeyPay", category:"Payroll", status:"Available", description:"Export approved timesheets and payroll-ready records.", mark:"K", colour:"#ef476f" },
  { name:"DocuSign", category:"Documents", status:"Available", description:"Issue and track service agreements and contracts.", mark:"D", colour:"#ffcc22" },
  { name:"Twilio", category:"Communications", status:"Connected", description:"SMS shift alerts, reminders and delivery receipts.", mark:"T", colour:"#f22f46" }
];
