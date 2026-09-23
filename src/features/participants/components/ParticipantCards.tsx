import { ArrowRight, Mail, MoreHorizontal, Phone, UsersRound, WalletCards } from "lucide-react";
import { participants } from "../../../mocks/mockDomain";
import { formatMoney as money } from "../../../utils/formatters";

export function FundingCard({
  participant,
  utilisation,
}: {
  participant: (typeof participants)[number];
  utilisation: number;
}) {
  return (
    <section className="record-card [padding:17px] [border:1px_solid_#e1e3ea] [border-radius:12px] [background:#fff] [&>button]:[border:0] [&>button]:[background:none] [&>button]:[color:#528ed2] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:5px] [&>button]:[font-size:11px] [&>button]:[font-weight:750] [&>button_svg]:[width:13px] [&>button]:[font-size:11px] funding-summary [&>strong]:[font-size:24px] [&>small]:[display:block] [&>small]:[color:#72756d] [&>small]:[font-size:11px] [&>i]:[display:block] [&>i]:[height:7px] [&>i]:[margin:11px_0] [&>i]:[border-radius:7px] [&>i]:[background:#e7e8ed] [&>i_b]:[height:100%] [&>i_b]:[display:block] [&>i_b]:[border-radius:inherit] [&>i_b]:[background:#5996dc] [&>div:not(.record-card-title)]:[display:flex] [&>div:not(.record-card-title)]:[gap:28px] [&>div_span_b]:[display:block] [&>div_span_b]:[font-size:11px] [&>div_span_small]:[display:block] [&>div_span_small]:[font-size:11px]">
      <div className="record-card-title [display:flex] [justify-content:space-between] [align-items:flex-start] [margin-bottom:13px] [&_h2]:[font-size:14px] [&_h2]:[margin:0] [&_p]:[font-size:11px] [&_p]:[color:#72756d] [&_p]:[margin:3px_0_0] [&_button]:[border:0] [&_button]:[background:none] [&_button]:[color:#528ed2] [&_button]:[display:flex] [&_button]:[align-items:center] [&_button]:[gap:5px] [&_button]:[font-size:11px] [&_button]:[font-weight:750] [&_svg]:[width:13px] [&_h2]:[font-size:16px] [&_p]:[font-size:11px] [&_button]:[font-size:11px]">
        <div>
          <h2>Plan funding</h2>
          <p>Renews {participant.renewal}</p>
        </div>
        <WalletCards />
      </div>
      <strong>{money(participant.budget - participant.used)}</strong>
      <small>available of {money(participant.budget)}</small>
      <i>
        <b style={{ width: `${utilisation}%` }} />
      </i>
      <div>
        <span>
          <b>{money(participant.used)}</b>
          <small>Utilised</small>
        </span>
        <span>
          <b>{utilisation}%</b>
          <small>Plan used</small>
        </span>
      </div>
      <button>
        View funding details <ArrowRight />
      </button>
    </section>
  );
}
export function PeopleCard({
  participant,
}: {
  participant: (typeof participants)[number];
}) {
  return (
    <section className="record-card [padding:17px] [border:1px_solid_#e1e3ea] [border-radius:12px] [background:#fff] [&>button]:[border:0] [&>button]:[background:none] [&>button]:[color:#528ed2] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:5px] [&>button]:[font-size:11px] [&>button]:[font-weight:750] [&>button_svg]:[width:13px] [&>button]:[font-size:11px] participant-people">
      <div className="record-card-title [display:flex] [justify-content:space-between] [align-items:flex-start] [margin-bottom:13px] [&_h2]:[font-size:14px] [&_h2]:[margin:0] [&_p]:[font-size:11px] [&_p]:[color:#72756d] [&_p]:[margin:3px_0_0] [&_button]:[border:0] [&_button]:[background:none] [&_button]:[color:#528ed2] [&_button]:[display:flex] [&_button]:[align-items:center] [&_button]:[gap:5px] [&_button]:[font-size:11px] [&_button]:[font-weight:750] [&_svg]:[width:13px] [&_h2]:[font-size:16px] [&_p]:[font-size:11px] [&_button]:[font-size:11px]">
        <div>
          <h2>Key people</h2>
          <p>Coordination and personal contacts.</p>
        </div>
        <UsersRound />
      </div>
      <Contact
        name={participant.coordinator}
        role="Support coordinator"
        phone="0402 514 889"
        email="maya@example.com"
      />
      <Contact
        name="Sophie Carter"
        role="Plan nominee · Mother"
        phone="0412 884 210"
        email="sophie@example.com"
      />
      <button>
        View all important people <ArrowRight />
      </button>
    </section>
  );
}
export function Contact({
  name,
  role,
  phone,
  email,
  primary = false,
}: {
  name: string;
  role: string;
  phone: string;
  email: string;
  primary?: boolean;
}) {
  return (
    <div className="participant-contact [&_strong]:[font-size:12px] [&_small]:[font-size:12px] [padding:9px_0] [border-top:1px_solid_#e9eaef] [display:grid] [grid-template-columns:34px_1fr_20px] [gap:8px] [align-items:center] [&>span]:[width:33px] [&>span]:[height:33px] [&>span]:[border-radius:50%] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:#528ccf] [&>span]:[background:#f0f5fa] [&>span]:[font-size:11px] [&>span]:[font-weight:800] [&_strong]:[display:block] [&_strong]:[font-size:11px] [&_small]:[display:block] [&_small]:[font-size:11px] [&_small]:[color:#72756d] [&_small]:[margin-top:2px] [&_strong_em]:[margin-left:6px] [&_strong_em]:[padding:2px_5px] [&_strong_em]:[border-radius:7px] [&_strong_em]:[background:#e7f6ef] [&_strong_em]:[color:#287b61] [&_strong_em]:[font-size:11px] [&_strong_em]:[font-style:normal] [&_p]:[display:flex] [&_p]:[align-items:center] [&_p]:[gap:4px] [&_p]:[margin:5px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_p_svg]:[width:10px] [&_p_svg]:[margin-left:5px] [&>button]:[border:0] [&>button]:[background:none] [&_p]:[font-size:11px]">
      <span>
        {name
          .split(" ")
          .map((x) => x[0])
          .join("")}
      </span>
      <div>
        <strong>
          {name}
          {primary && <em>Primary</em>}
        </strong>
        <small>{role}</small>
        <p>
          <Phone />
          {phone}
          <Mail />
          {email}
        </p>
      </div>
      <button>
        <MoreHorizontal />
      </button>
    </div>
  );
}
