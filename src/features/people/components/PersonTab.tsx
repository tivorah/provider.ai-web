import {
  AlertTriangle, BadgeCheck, CalendarDays, Check, ChevronRight, Clock3,
  Download, FileText, Filter, Info, Mail, MoreHorizontal, Plus, Search,
  ShieldCheck, TriangleAlert, UserCheck, UsersRound,
} from "lucide-react";
import { useState } from "react";
import { people } from "../../../mocks/mockDomain";
import { employeeCredentialNames, employeeDocumentNames, onboardingChecklist, weekDayNames } from "../../../utils/content";

export function PersonTab({
  person,
  tab,
}: {
  person: (typeof people)[number];
  tab: string;
}) {
  const [inviteSent, setInviteSent] = useState(false);
  const [approved, setApproved] = useState(person.readiness === 100);
  const [availabilityEditing, setAvailabilityEditing] = useState(false);
  const rate = person.role.includes("Senior")
    ? 38.62
    : person.type === "Casual"
      ? 41.76
      : 34.8;
  const fortnightGross = person.hours * 2 * rate;
  const monthlyGross = (fortnightGross * 26) / 12;
  if (tab === "Onboarding")
    return (
      <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white]">
        <div className="onboarding-banner [padding:17px] [border-radius:13px] [background:linear-gradient(135deg,#f1f8ff,#f3f3ef)] [display:grid] [grid-template-columns:42px_1fr_auto] [gap:12px] [align-items:center] [&>span]:[width:42px] [&>span]:[height:42px] [&>span]:[border-radius:11px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:#386590] [&>span]:[background:white] [&_h3]:[margin:0] [&_p]:[margin:0] [&_h3]:[font:700_14px_var(--font-sans)] [&_p]:[margin-top:4px] [&_p]:[color:#777486] [&_p]:[font-size:11px] [&_p]:[line-height:1.45] max-[760px]:[grid-template-columns:42px_1fr] max-[760px]:[&_button]:[grid-column:2] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
          <span>
            <UserCheck />
          </span>
          <div>
            <h3>
              {approved
                ? "Onboarding approved"
                : person.status === "Onboarding"
                  ? "Employee submission in progress"
                  : "Onboarding record complete"}
            </h3>
            <p>
              Secure employee portal for personal details, tax, super, bank
              information, contracts and mandatory evidence.
            </p>
          </div>
          <button
            className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
            onClick={() => setInviteSent(true)}
          >
            {inviteSent ? "Invite resent" : "Send portal invite"}
          </button>
        </div>
        <div className="onboarding-progress [padding:14px_2px] [display:flex] [align-items:center] [gap:12px] [&_div]:[min-width:75px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_18px_var(--font-sans)] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&>i]:[height:7px] [&>i]:[flex:1] [&>i]:[border-radius:5px] [&>i]:[background:#e2ebf6] [&>i]:[overflow:hidden] [&_b]:[display:block] [&_b]:[height:100%] [&_b]:[border-radius:inherit] [&_b]:[background:#599ce8]">
          <div>
            <strong>{approved ? "100%" : `${person.readiness}%`}</strong>
            <small>Completed</small>
          </div>
          <i>
            <b style={{ width: `${approved ? 100 : person.readiness}%` }} />
          </i>
        </div>
        {onboardingChecklist.map((item, index) => (
          <div className="onboarding-item [grid-template-columns:34px_1fr_auto] [padding:13px_4px] [border-top:1px_solid_var(--border)] [display:grid] [grid-template-columns:31px_1fr_auto] [gap:10px] [align-items:center] [&>span]:[width:29px] [&>span]:[height:29px] [&>span]:[border-radius:8px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span.done]:[color:#247f5f] [&>span.done]:[background:#e8f7f1] [&>span.waiting]:[color:#a86729] [&>span.waiting]:[background:#fff1df] [&_svg]:[width:15px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:4px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#386590] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={item}>
            <span className={index < 4 || approved ? "done" : "waiting"}>
              {index < 4 || approved ? <Check /> : <Clock3 />}
            </span>
            <div>
              <strong>{item}</strong>
              <small>
                {index < 4 || approved
                  ? "Submitted and ready for review"
                  : "Waiting for employee upload"}
              </small>
            </div>
            <button>
              {index < 4 || approved ? "Review" : "Send reminder"}
            </button>
          </div>
        ))}
        <div className="onboarding-actions [padding-top:15px] [border-top:1px_solid_var(--border)] [display:flex] [align-items:center] [justify-content:space-between] [gap:12px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_small]:[font-size:12.5px]">
          <small>
            {inviteSent
              ? "Portal invitation sent to the employee’s private email."
              : "All changes are recorded in the organisation audit log."}
          </small>
          <button
            className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] "
            disabled={approved}
            onClick={() => setApproved(true)}
          >
            <BadgeCheck />
            {approved ? "Approved" : "Approve onboarding"}
          </button>
        </div>
      </div>
    );
  if (tab === "Credentials")
    return (
      <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white]">
        <div className="drawer-section-head [display:flex] [justify-content:space-between] [align-items:center] [&_h3]:[margin:0] [&_h3]:[font:700_13px_var(--font-sans)] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#386590] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
          <div>
            <h3>Credentials and checks</h3>
            <p>Eligibility evidence used by roster matching.</p>
          </div>
          <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] ">
            <Plus />
            Add credential
          </button>
        </div>
        {employeeCredentialNames.map((name, index) => (
          <div className="credential-row [grid-template-columns:32px_1fr_auto_20px] [padding:16px] [border:1px_solid_var(--border)] [border-radius:12px] [background:white] [display:grid] [grid-template-columns:1fr_auto] [gap:10px] [align-items:center] [&_strong]:[display:block] [&_small]:[display:block] [&_small]:[margin-top:4px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={name}>
            <span
              className={
                index === 1 && person.expiring ? "expiring" : "verified"
              }
            >
              {index === 1 && person.expiring ? <AlertTriangle /> : <Check />}
            </span>
            <div>
              <strong>{name}</strong>
              <small>
                {index === 1 && person.expiring
                  ? "Expires 9 August 2026"
                  : "Verified · current"}
              </small>
            </div>
            <time>
              {index === 1 && person.expiring ? "7 days" : "View evidence"}
            </time>
            <ChevronRight />
          </div>
        ))}
      </div>
    );
  if (tab === "Availability")
    return (
      <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white] availability-content [gap:18px]">
        <div className="drawer-section-head [display:flex] [justify-content:space-between] [align-items:center] [&_h3]:[margin:0] [&_h3]:[font:700_13px_var(--font-sans)] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#386590] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
          <div>
            <h3>Availability and capacity</h3>
            <p>Weekly working pattern used for safe roster matching.</p>
          </div>
          <button
            className="secondary-button [display:flex] [align-items:center] [gap:7px] max-[570px]:[padding-inline:8px] "
            onClick={() => setAvailabilityEditing((value) => !value)}
          >
            {availabilityEditing ? "Save availability" : "Edit availability"}
          </button>
        </div>
        <div className="capacity-overview [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&>p]:[margin:0_16px] [&>p]:[color:#777786] [&>p]:[font-size:11px] [padding:18px] [border:1px_solid_var(--border)] [border-radius:13px] [background:white] [&>div]:[display:grid] [&>div]:[grid-template-columns:repeat(3,1fr)] [&>div>span]:[padding:0_16px] [&>div>span+span]:[border-left:1px_solid_var(--border)] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_23px_var(--font-sans)] [&>i]:[height:8px] [&>i]:[margin:16px_16px_8px] [&>i]:[border-radius:5px] [&>i]:[background:#e6eef8] [&>i]:[display:block] [&>i]:[overflow:hidden] [&>i_b]:[height:100%] [&>i_b]:[display:block] [&>i_b]:[border-radius:inherit] [&>i_b]:[background:linear-gradient(90deg,#599ce8,#82b6f1)] max-[520px]:[&>div]:[grid-template-columns:1fr] max-[520px]:[&>div>span]:[padding:9px] max-[520px]:[&>div>span+span]:[border-left:0] max-[520px]:[&>div>span+span]:[border-top:1px_solid_var(--border)]">
          <div>
            <span>
              <strong>{person.capacity}h</strong>
              <small>Weekly capacity</small>
            </span>
            <span>
              <strong>{person.hours}h</strong>
              <small>Currently allocated</small>
            </span>
            <span>
              <strong>{person.capacity - person.hours}h</strong>
              <small>Remaining capacity</small>
            </span>
          </div>
          <i>
            <b
              style={{
                width: `${Math.min(100, (person.hours / person.capacity) * 100)}%`,
              }}
            />
          </i>
          <p>
            {Math.round((person.hours / person.capacity) * 100)}% allocated ·{" "}
            {person.capacity - person.hours} hours available for additional
            supports
          </p>
        </div>
        <div className="availability-table [border:1px_solid_var(--border)] [border-radius:13px] [background:white] [overflow:hidden]">
          <div className="availability-head [display:grid] [grid-template-columns:120px_1.15fr_1.2fr_100px] [gap:12px] [align-items:center] [padding:10px_15px] [color:#72756d] [background:#f7f7f4] [text-transform:uppercase] [letter-spacing:.6px] [font-size:11px] [font-weight:800] max-[760px]:[display:none]">
            <span>Day</span>
            <span>Available window</span>
            <span>Preference</span>
            <span>Status</span>
          </div>
          {weekDayNames.map((day, index) => {
            const unavailable = index === 2 || index === 6;
            return (
              <div className="availability-day [&>span_input]:[width:92px] [&>span_input]:[padding:6px] [&>span_input]:[border:1px_solid_var(--border)] [&>span_input]:[border-radius:7px] [&>span_input]:[font-size:11px] [&>span_em]:[margin:0_5px] [&>span_em]:[color:#72756d] [&>span_em]:[font-size:11px] [&>span_em]:[font-style:normal] [&>small]:[color:#777786] [&>small]:[font-size:11px] [display:grid] [grid-template-columns:120px_1.15fr_1.2fr_100px] [gap:12px] [align-items:center] [min-height:54px] [padding:9px_15px] [border-top:1px_solid_#dddfd7] [&_strong]:[font-size:13px] [&>span]:[font-size:12px] [&>b]:[padding:5px_7px] [&>b]:[border-radius:7px] [&>b]:[text-align:center] [&>b]:[font-size:11px] [&>b.available]:[color:#247f5f] [&>b.available]:[background:#e8f7f1] [&>b.off]:[color:#72756d] [&>b.off]:[background:#e6eef8] max-[760px]:[grid-template-columns:100px_1fr] max-[760px]:[&>small]:[grid-column:2] max-[760px]:[&>b]:[grid-column:2]" key={day}>
                <strong>{day}</strong>
                <span>
                  {availabilityEditing && !unavailable ? (
                    <>
                      <input type="time" defaultValue="07:00" /> <em>to</em>{" "}
                      <input type="time" defaultValue="18:00" />
                    </>
                  ) : unavailable ? (
                    "—"
                  ) : (
                    "7:00 am – 6:00 pm"
                  )}
                </span>
                <small>
                  {unavailable
                    ? "Not available"
                    : index === 5
                      ? "Weekend work preferred"
                      : "Community and in-home support"}
                </small>
                <b className={unavailable ? "off" : "available"}>
                  {unavailable ? "Unavailable" : "Available"}
                </b>
              </div>
            );
          })}
        </div>
        <div className="availability-details [display:grid] [grid-template-columns:1fr_1fr] [gap:12px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white] [&_h4]:[margin:0_0_11px] [&_h4]:[font:700_13px_var(--font-sans)] [&_span]:[margin-top:8px] [&_span]:[color:#686778] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:7px] [&_span]:[font-size:11.5px] [&_svg]:[width:15px] [&_svg]:[color:#569ae8] max-[760px]:[grid-template-columns:1fr]">
          <section>
            <h4>Work preferences</h4>
            <span>
              <Check />
              Western Sydney service area
            </span>
            <span>
              <Check />
              Community access and daily activities
            </span>
            <span>
              <Check />
              Maximum 8-hour shift
            </span>
            <span>
              <Check />
              30-minute travel radius preferred
            </span>
          </section>
          <section>
            <h4>Roster rules</h4>
            <span>
              <Clock3 />
              Minimum 10-hour break between shifts
            </span>
            <span>
              <CalendarDays />
              Available two weekends per month
            </span>
            <span>
              <AlertTriangle />
              No sleepover shifts recorded
            </span>
          </section>
        </div>
        <div className="audit-assurance [&_small]:[margin-top:3px] [&_small]:[font-size:11px] [padding:12px_14px] [border-radius:11px] [color:#247f5f] [background:#e8f7f1] [display:flex] [align-items:center] [gap:9px] [&_svg]:[width:18px] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:12px]">
          <ShieldCheck />
          <span>
            <strong>Changes are auditable</strong>
            <small>
              All changes are recorded in the organisation audit log.
            </small>
          </span>
        </div>
      </div>
    );
  if (tab === "Employment")
    return (
      <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white]">
        <div className="drawer-section-head [display:flex] [justify-content:space-between] [align-items:center] [&_h3]:[margin:0] [&_h3]:[font:700_13px_var(--font-sans)] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#386590] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
          <div>
            <h3>Employment and pay</h3>
            <p>
              Classification and payroll projection. Confirm against the
              current Fair Work instrument before production payroll.
            </p>
          </div>
          <button className="secondary-button [display:flex] [align-items:center] [gap:7px] max-[570px]:[padding-inline:8px] ">Edit details</button>
        </div>
        <div className="drawer-fields [grid-template-columns:repeat(3,1fr)] max-[760px]:[grid-template-columns:1fr_1fr] max-[520px]:[grid-template-columns:1fr] [padding:16px] [border:1px_solid_var(--border)] [border-radius:12px] [background:white] [display:grid] [grid-template-columns:1fr_1fr] [gap:14px] [&_label]:[color:#72756d] [&_label]:[font-size:11px] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:.5px] [&_strong]:[display:block] [&_strong]:[margin-top:5px] [&_strong]:[color:#3c434d] [&_strong]:[font-size:11px] max-[800px]:[grid-template-columns:1fr] [&_label]:[font-size:12px] [&_small]:[font-size:12px] [&_strong]:[font-size:14px]">
          <div>
            <small>Employment type</small>
            <strong>{person.type}</strong>
          </div>
          <div>
            <small>Job title</small>
            <strong>{person.role}</strong>
          </div>
          <div>
            <small>Industrial instrument</small>
            <strong>SCHADS Award</strong>
          </div>
          <div>
            <small>Classification</small>
            <strong>Home Care Employee Level 3.2</strong>
          </div>
          <div>
            <small>Base rate</small>
            <strong>${rate.toFixed(2)} per hour</strong>
          </div>
          <div>
            <small>Ordinary hours</small>
            <strong>{person.hours} hours per week</strong>
          </div>
          <div>
            <small>Projected fortnightly gross</small>
            <strong>
              $
              {fortnightGross.toLocaleString("en-AU", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>
          <div>
            <small>Projected monthly gross</small>
            <strong>
              $
              {monthlyGross.toLocaleString("en-AU", {
                minimumFractionDigits: 2,
              })}
            </strong>
          </div>
          <div>
            <small>Start date</small>
            <strong>12 February 2024</strong>
          </div>
          <div>
            <small>Primary location</small>
            <strong>{person.location}, NSW</strong>
          </div>
        </div>
        <div className="pay-note [padding:12px] [border-radius:10px] [display:flex] [gap:9px] [align-items:flex-start] [color:#86601f] [background:#fff5e7] [font-size:11px] [line-height:1.5] [&_svg]:[width:17px] [&_svg]:[flex:none] [font-size:12.5px]">
          <Info />
          <span>
            Weekend, evening, public-holiday, overtime, allowance, leave, tax
            and super rules are calculated separately in a real payroll engine.
          </span>
        </div>
      </div>
    );
  if (tab === "Documents")
    return (
      <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white]">
        <div className="drawer-section-head [display:flex] [justify-content:space-between] [align-items:center] [&_h3]:[margin:0] [&_h3]:[font:700_13px_var(--font-sans)] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[color:#386590] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
          <div>
            <h3>Employee documents</h3>
            <p>Contracts, policies and uploaded evidence.</p>
          </div>
          <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] ">
            <Plus />
            Upload
          </button>
        </div>
        {employeeDocumentNames.map((name, index) => (
          <div className="document-row [grid-template-columns:32px_1fr_34px] [padding:16px] [border:1px_solid_var(--border)] [border-radius:12px] [background:white] [display:grid] [grid-template-columns:1fr_auto] [gap:10px] [align-items:center] [&_strong]:[display:block] [&_small]:[display:block] [&_small]:[margin-top:4px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12.5px]" key={name}>
            <span>
              <FileText />
            </span>
            <div>
              <strong>{name}</strong>
              <small>
                {index < 2 ? "Signed 12 Feb 2024" : "Updated 4 Mar 2026"}
              </small>
            </div>
            <button>
              <Download />
            </button>
          </div>
        ))}
      </div>
    );
  return (
    <div className="person-tab-content [padding:24px_30px] [&>.drawer-section-head]:[padding-bottom:5px] [padding:20px_24px] [display:grid] [gap:14px] [&>section]:[padding:16px] [&>section]:[border:1px_solid_var(--border)] [&>section]:[border-radius:12px] [&>section]:[background:white]">
      <div className="readiness-overview [display:flex] [align-items:center] [gap:15px] [&_strong]:[font:700_30px_var(--font-sans)] [&_strong]:[color:#283f60] [&_span]:[color:#777486] [&_span]:[font-size:11px] [&_span]:[line-height:1.5] [&_h3]:[font-size:17px] [&_p]:[font-size:13px]">
        <div className="large-ring [width:105px] [height:105px] [border-radius:50%] [display:grid] [place-content:center] [text-align:center] [background:radial-gradient(circle,white_62%,transparent_63%),conic-gradient(#5292dc_94%,#e6eef8_0)] [&_strong]:[font:700_27px_var(--font-sans)] [&_small]:[color:#8e8e9d] [&_small]:[font-size:11px]">
          <strong>{person.readiness}</strong>
          <small>Readiness score</small>
        </div>
        <div>
          <h3>{person.status}</h3>
          <p>
            {person.readiness === 100
              ? "All mandatory checks, training and employment information are current."
              : "Onboarding or credential requirements need attention before unrestricted rostering."}
          </p>
          <div className="readiness-checks">
            <span>
              <Check />
              Identity verified
            </span>
            <span>
              <Check />
              Contract signed
            </span>
            <span className={person.expiring ? "warning-text [color:#b36928]" : ""}>
              {person.expiring ? <AlertTriangle /> : <Check />}
              {person.expiring
                ? `${person.expiring} credentials need attention`
                : "Credentials current"}
            </span>
          </div>
        </div>
      </div>
      <div className="drawer-fields [grid-template-columns:repeat(3,1fr)] max-[760px]:[grid-template-columns:1fr_1fr] max-[520px]:[grid-template-columns:1fr] [padding:16px] [border:1px_solid_var(--border)] [border-radius:12px] [background:white] [display:grid] [grid-template-columns:1fr_1fr] [gap:14px] [&_label]:[color:#72756d] [&_label]:[font-size:11px] [&_label]:[text-transform:uppercase] [&_label]:[letter-spacing:.5px] [&_strong]:[display:block] [&_strong]:[margin-top:5px] [&_strong]:[color:#3c434d] [&_strong]:[font-size:11px] max-[800px]:[grid-template-columns:1fr] [&_label]:[font-size:12px] [&_small]:[font-size:12px] [&_strong]:[font-size:14px]">
        <div>
          <small>Employee ID</small>
          <strong>EMP-{person.id.slice(1).padStart(4, "0")}</strong>
        </div>
        <div>
          <small>Work email</small>
          <strong>
            {person.name
              .toLowerCase()
              .replace(" ".trim(), ".")
              .replace(" ", ".")}
            @harbourcare.com.au
          </strong>
        </div>
        <div>
          <small>Mobile</small>
          <strong>04{person.id.charCodeAt(1)} 284 610</strong>
        </div>
        <div>
          <small>Emergency contact</small>
          <strong>Jordan · 0402 118 905</strong>
        </div>
        <div>
          <small>This week</small>
          <strong>{person.hours} scheduled hours</strong>
        </div>
        <div>
          <small>Participant continuity</small>
          <strong>91% repeat support</strong>
        </div>
        <div>
          <small>Manager</small>
          <strong>Olivia Williams</strong>
        </div>
        <div>
          <small>Last supervision</small>
          <strong>18 July 2026</strong>
        </div>
        <div>
          <small>Branch</small>
          <strong>Western Sydney</strong>
        </div>
        <div>
          <small>Payroll cycle</small>
          <strong>Fortnightly · Thursday</strong>
        </div>
      </div>
    </div>
  );
}
