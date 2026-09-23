import { Activity, ChevronDown, CircleDollarSign, Sparkles, TrendingUp, UserCheck } from "lucide-react";
import { ActionRow, FinanceKpi, ModuleHeader } from "../shared/components/ModuleUi";

export function AnalyticsPage() {
  return (
    <section className="page w-full max-w-none px-[clamp(12px,1.5vw,24px)] pb-14 pt-8 text-[15px] leading-normal module-page">
      <ModuleHeader
        eyebrow="Business intelligence"
        title="Analytics"
        subtitle="See service quality, workforce health and commercial performance together."
        action="Create report"
      />
      <div className="analytics-kpis [display:grid] [grid-template-columns:repeat(4,1fr)] [gap:12px] [margin-bottom:14px] [&>article]:[padding:16px] [&>article]:[border:1px_solid_var(--border)] [&>article]:[border-radius:13px] [&>article]:[background:white] [&>article]:[position:relative] [&>article>div]:[display:flex] [&>article>div]:[align-items:center] [&>article>div]:[gap:8px] [&>article>div_span]:[width:30px] [&>article>div_span]:[height:30px] [&>article>div_span]:[border-radius:8px] [&>article>div_span]:[display:grid] [&>article>div_span]:[place-items:center] [&>article>div_span]:[color:#386590] [&>article>div_span]:[background:#f0f5fa] [&_svg]:[width:15px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&>article>strong]:[display:inline-block] [&>article>strong]:[margin-top:11px] [&>article>strong]:[font:700_20px_var(--font-sans)] [&_em]:[margin-left:8px] [&_em]:[padding:3px_5px] [&_em]:[border-radius:5px] [&_em]:[background:#e8f7f1] [&_em]:[color:#25805f] [&_em]:[font-size:11px] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em_svg]:[vertical-align:middle] [&_p]:[position:absolute] [&_p]:[right:14px] [&_p]:[bottom:17px] [&_p]:[margin:0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] max-[1000px]:[grid-template-columns:repeat(2,1fr)] max-[760px]:[grid-template-columns:1fr_1fr] max-[520px]:[grid-template-columns:1fr] [&_small]:[font-size:13px] [&>article>strong]:[font-size:25px]">
        <FinanceKpi
          icon={<Activity />}
          label="Delivered hours"
          value="1,842"
          trend="8.1%"
          positive
        />
        <FinanceKpi
          icon={<UserCheck />}
          label="Service continuity"
          value="92.4%"
          trend="1.8%"
          positive
        />
        <FinanceKpi
          icon={<TrendingUp />}
          label="Utilisation"
          value="86.7%"
          trend="3.2%"
          positive
        />
        <FinanceKpi
          icon={<CircleDollarSign />}
          label="Revenue leakage"
          value="1.3%"
          trend="0.6%"
          positive
        />
      </div>
      <div className="analytics-grid [display:grid] [grid-template-columns:1fr_320px] [gap:12px] max-[1000px]:[grid-template-columns:1fr]">
        <article className="panel [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [padding:20px] outcome-chart [min-height:340px]">
          <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
            <div>
              <h2>Service delivery health</h2>
              <p>Delivered, cancelled and unfilled hours</p>
            </div>
            <button className="filter-button [background:white] [border:1px_solid_var(--border)] [border-radius:10px] [padding:10px_13px] [display:flex] [align-items:center] [gap:7px] [font-size:11.5px] [font-weight:600] [cursor:pointer] [font-size:11px] [font-size:12.5px] [font-size:14px]">
              Last 12 months <ChevronDown size={14} />
            </button>
          </div>
          <div className="line-chart [height:240px] [padding:20px_15px_0] [background:repeating-linear-gradient(to_bottom,#fff_0,#fff_53px,#ecf3fa_54px)] [&_svg]:[width:100%] [&_svg]:[height:190px] [&_svg]:[overflow:visible] [&>div]:[display:flex] [&>div]:[justify-content:space-between] [&>div]:[color:#72756d] [&>div]:[font-size:11px]">
            <svg viewBox="0 0 700 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#599ce8" stopOpacity=".28" />
                  <stop offset="1" stopColor="#599ce8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 180 C60 170 80 120 140 132 S220 86 280 105 S370 55 430 73 S510 42 570 60 S640 20 700 31 L700 220 L0 220Z"
                fill="url(#area)"
              />
              <path
                d="M0 180 C60 170 80 120 140 132 S220 86 280 105 S370 55 430 73 S510 42 570 60 S640 20 700 31"
                fill="none"
                stroke="#599ce8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <div>
              {[
                "Sep",
                "Oct",
                "Nov",
                "Dec",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
              ].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </article>
        <article className="panel [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8] [padding:20px] insight-feed [&_.panel-heading>svg]:[color:#4f88ca] [&_.action-row]:[padding:14px_0]">
          <div className="panel-heading [display:flex] [align-items:flex-start] [justify-content:space-between] [padding-bottom:16px] [&_h2]:[margin:0] [&_h2]:[font:700_14px_var(--font-sans)] [&_p]:[margin:4px_0_0] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_h2]:[font-size:14px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px] [&_h2]:[font-size:18px] [&_p]:[font-size:13px]">
            <div>
              <h2>Provider.ai insights</h2>
              <p>Signals worth acting on</p>
            </div>
            <Sparkles size={18} />
          </div>
          <ActionRow
            tone="mint"
            title="Continuity is improving"
            meta="Repeat-worker coverage increased 6.2%"
          />
          <ActionRow
            tone="amber"
            title="Friday capacity gap"
            meta="Community access demand exceeds supply"
          />
          <ActionRow
            tone="violet"
            title="Claim cycle accelerated"
            meta="Average payment is 1.4 days faster"
          />
        </article>
      </div>
    </section>
  );
}
