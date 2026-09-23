import { ArrowRight, ChevronRight, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { widgetTrendBars } from "../../../mocks/dashboardWidgets";
import type { DashboardWidgetModel, WidgetDragProps } from "../types";

interface DashboardWidgetProps extends WidgetDragProps {
  widget: DashboardWidgetModel;
}

const splitItem = (item: string) => item.split(" · ");
const openWidget = (widget: DashboardWidgetModel) => {
  const source = `${widget.id} ${widget.title}`.toLowerCase();
  const detail = source.includes("roster") || source.includes("shift") ? "roster"
    : source.includes("claim") || source.includes("revenue") || source.includes("finance") || source.includes("margin") ? "finance"
      : source.includes("compliance") || source.includes("credential") || source.includes("ready") ? "compliance"
        : source.includes("people") || source.includes("worker") ? "people"
          : source.includes("participant") ? "participants" : "analytics";
  window.dispatchEvent(new CustomEvent("provider-navigate", { detail }));
};
const metricToneClasses: Record<string, string> = {
  mint: "bg-[#e2f7ef] text-[#16815e]",
  amber: "bg-[#fff0df] text-[#b26a26]",
  rose: "bg-[#ffe7eb] text-[#c44d63]",
  violet: "bg-[#f0f5fa] text-[#5091dc]",
};
const breakdownColours = [
  "bg-[#599ce8]",
  "bg-[#2aaa7d]",
  "bg-[#e29743]",
  "bg-[#df6177]",
];

export function widgetIcon(id: string) {
  if (id.includes("shift") || id.includes("roster")) return "24";
  if (id.includes("ready") || id.includes("coverage")) return "✓";
  if (id.includes("claim") || id.includes("revenue") || id.includes("margin")) return "$";
  if (id.includes("inbox") || id.includes("mail")) return "@";
  return "!";
}

export function DashboardWidget({
  widget,
  dragging = false,
  landing,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: DashboardWidgetProps) {
  return (
    <article
      data-dashboard-widget={widget.id}
      draggable={Boolean(onDragStart)}
      onDragStart={(event) => onDragStart?.(widget.id, event)}
      onDragOver={(event) => onDragOver?.(event, widget.id)}
      onDrop={(event) => onDrop?.(event, widget.id)}
      onDragEnd={onDragEnd}
      className={`metric-card [background:white] [border:1px_solid_var(--border)] [border-radius:15px] [box-shadow:none] [padding:17px] [min-height:151px] [&_>_p]:[margin:14px_0_3px] [&_>_p]:[color:#868697] [&_>_p]:[font-size:11px] [&_>_p]:[font-weight:600] [&_>_small]:[display:block] [&_>_small]:[color:#9b9baa] [&_>_small]:[margin-top:4px] [&_>_small]:[font-size:11px] max-[570px]:[min-height:135px] max-[570px]:[padding:14px] [&[draggable=true]]:[cursor:grab] [&[draggable=true]:active]:[cursor:grabbing] [&>p]:[font-size:14px] [&>small]:[font-size:13px] dashboard-widget [&.layout-schedule>p]:[font-weight:800] [&.layout-schedule>p]:[font-size:14px] [&.layout-list>p]:[font-weight:800] [&.layout-list>p]:[font-size:14px] [&.widget-dragging]:[opacity:.28] [&.widget-dragging]:[transform:scale(.975)] [&.widget-landing.before:before]:[left:-12px] [&.widget-landing.after:before]:[right:-12px] [&.widget-landing.valid]:[border-color:#79afed] [&.widget-landing.valid]:[box-shadow:0_0_0_3px_#69a7ed1c,0_12px_30px_#37516f15] [&.widget-landing.invalid]:[border-color:#e05469] [&.widget-landing.invalid]:[box-shadow:0_0_0_4px_#e0546929,0_10px_30px_#b62f4930] [&.widget-landing.invalid:before]:[background:#df4960] [&.widget-landing.invalid:before]:[box-shadow:0_0_0_4px_#df49602b,0_6px_20px_#a9253c42] [&.layout-schedule]:[min-height:210px] [&.layout-list]:[min-height:210px] [&.layout-schedule_.widget-schedule>div]:[padding-block:8px] [&.layout-list_.widget-list]:[grid-template-columns:1fr] [&.layout-list_.widget-list>div]:[grid-template-columns:27px_1fr] [&.layout-list_.widget-list>div>span]:[grid-row:1/3] [&.layout-list_.widget-list>button]:[margin-top:2px] max-[1100px]:[&.widget-landing.invalid]:[border-color:#79afed] max-[1100px]:[&.widget-landing.invalid]:[box-shadow:0_0_0_3px_#69a7ed1c] max-[1100px]:[&.widget-landing.invalid:before]:[background:#61a0e8] max-[1100px]:[&.widget-landing.invalid_.invalid-drop-label]:[display:none] [&.size-wide]:[grid-column:span_2] [&.size-wide]:[min-height:210px] [&_.card-top>div]:[display:flex] [&_.card-top>div]:[align-items:center] [&_.card-top>div]:[gap:6px] max-[760px]:[&.size-wide]:[grid-column:span_1] tone-${widget.tone} layout-${widget.layout ?? "metric"} size-${widget.size ?? "compact"} ${dragging ? "widget-dragging" : ""} ${landing ? `widget-landing ${landing.invalid ? "invalid" : "valid"} ${landing.side}` : ""}`}
    >
      <div className="card-top [display:flex] [justify-content:space-between] [&_button]:[border:0] [&_button]:[background:transparent] [&_button]:[cursor:pointer] [&_button]:[color:#aaaab8]">
        <span className={`metric-icon grid size-[30px] place-items-center rounded-[9px] text-[11px] font-bold ${metricToneClasses[widget.tone] ?? metricToneClasses.violet}`}>{widgetIcon(widget.id)}</span>
        <div>
          {widget.audience && (
            <span className="widget-audience [padding:4px_6px] [border-radius:6px] [color:#69647b] [background:rgba(255,255,255,.72)] [font-size:11px] [font-weight:700]">
              {widget.audience.includes("Entire team") ? "Everyone" : `${widget.audience.length} roles`}
            </span>
          )}
          <span aria-hidden="true" title={`Drag to move ${widget.title}`}>
            <GripVertical />
          </span>
        </div>
      </div>
      <p>{widget.title}</p>
      <WidgetContent widget={widget} />
      {landing?.invalid && <span className="invalid-drop-label [position:absolute] [z-index:12] [left:50%] [top:50%] [transform:translate(-50%,-50%)] [width:max-content] [padding:7px_10px] [border-radius:8px] [background:#a92f43] [color:white] [font-size:11px] [font-weight:800] [box-shadow:none] [pointer-events:none]">This card will not fit here</span>}
    </article>
  );
}

function WidgetContent({ widget }: { widget: DashboardWidgetModel }) {
  if (widget.layout === "digital-clock") return <ClockContent mode="digital" />;
  if (widget.layout === "analog-clock") return <ClockContent mode="analog" />;
  if (widget.layout === "calendar") return <CalendarContent />;

  if (widget.layout === "list") {
    return (
      <div className="widget-list [margin-top:10px] [display:grid] [grid-template-columns:1fr_1fr] [gap:7px_12px] [&>div]:[min-width:0] [&>div]:[padding:7px] [&>div]:[border-radius:8px] [&>div]:[background:rgba(255,255,255,.62)] [&>div]:[display:grid] [&>div]:[grid-template-columns:24px_1fr] [&>div]:[column-gap:7px] [&>div>span]:[grid-row:1/3] [&>div>span]:[width:23px] [&>div>span]:[height:23px] [&>div>span]:[border-radius:7px] [&>div>span]:[display:grid] [&>div>span]:[place-items:center] [&>div>span]:[color:#386590] [&>div>span]:[background:#f0f5fa] [&>div>span]:[font-size:11px] [&>div>span]:[font-weight:800] [&_strong]:[overflow:hidden] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small]:[white-space:nowrap] [&_strong]:[font-size:12px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:5px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&>button_svg]:[width:14px] max-[760px]:[grid-template-columns:1fr]">
        {widget.items?.slice(0, 5).map((item, index) => (
          <div key={item}>
            <span>{index + 1}</span>
            <strong>{splitItem(item)[0]}</strong>
            <small>{splitItem(item).slice(1).join(" · ")}</small>
          </div>
        ))}
        <button onClick={() => openWidget(widget)}>View more <ArrowRight /></button>
      </div>
    );
  }

  if (widget.layout === "status") {
    return (
      <div className="widget-status [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:5px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&>button_svg]:[width:14px] [margin-top:10px] [display:grid] [grid-template-columns:1fr_1fr] [gap:8px] [&>div]:[grid-row:span_2] [&>div]:[padding:12px] [&>div]:[border-radius:10px] [&>div]:[background:rgba(255,255,255,.65)] [&>div_strong]:[display:block] [&>div_small]:[display:block] [&>div_strong]:[font:700_25px_var(--font-sans)] [&>div_small]:[margin-top:4px] [&>div_small]:[color:#72756d] [&>span]:[display:flex] [&>span]:[align-items:center] [&>span]:[gap:7px] [&>span]:[font-size:11px] [&>span_i]:[width:7px] [&>span_i]:[height:7px] [&>span_i]:[border-radius:50%] [&>span_i]:[background:#2aaa7d] [&>span_i.warning]:[background:#df6177] [&>button]:[grid-column:2] max-[760px]:[grid-template-columns:1fr] max-[760px]:[&>div]:[grid-row:auto] max-[760px]:[&>button]:[grid-column:auto]">
        <div><strong>{widget.value}</strong><small>{widget.detail}</small></div>
        {widget.items?.map((item, index) => (
          <span key={item}><i className={index === widget.items!.length - 1 ? "warning" : ""} />{item}</span>
        ))}
        <button onClick={() => openWidget(widget)}>Open details <ArrowRight /></button>
      </div>
    );
  }

  if (widget.layout === "progress") {
    const percentage = Math.min(100, Number.parseFloat(widget.value) || 68);
    return (
      <div className="widget-progress [margin-top:9px] [&>p]:[margin:5px_0] [&>p]:[display:flex] [&>p]:[justify-content:space-between] [&>p]:[font-size:11px] [&>button]:[margin-top:7px] [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:4px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&>div:first-child]:[display:flex] [&>div:first-child]:[align-items:baseline] [&>div:first-child]:[gap:9px] [&>div_strong]:[font:700_25px_var(--font-sans)] [&>div_span]:[color:#72756d] [&>div_span]:[font-size:11px] [&>i]:[height:8px] [&>i]:[margin:9px_0_7px] [&>i]:[border-radius:6px] [&>i]:[background:rgba(255,255,255,.7)] [&>i]:[display:block] [&>i]:[overflow:hidden] [&>i_b]:[height:100%] [&>i_b]:[display:block] [&>i_b]:[border-radius:inherit] [&>i_b]:[background:#599ce8] [&>p_span]:[color:#777786] [&_button_svg]:[width:13px]">
        <div><strong>{widget.value}</strong><span>{widget.detail}</span></div>
        <i><b className={widget.tone === "mint" ? "bg-[#2aaa7d]" : widget.tone === "amber" ? "bg-[#e29743]" : "bg-[#599ce8]"} style={{ width: `${percentage}%` }} /></i>
        {widget.items?.slice(0, 3).map((item, index) => (
          <p key={item}>
            <span>{splitItem(item)[0]}</span>
            <strong>{splitItem(item)[1] ?? ["On track", "Review", "Current"][index]}</strong>
          </p>
        ))}
        <button onClick={() => openWidget(widget)}>View detailed progress <ArrowRight /></button>
      </div>
    );
  }

  if (widget.layout === "chart") {
    return (
      <div className="widget-chart [&>button]:[margin-top:7px] [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:4px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&>div:nth-child(2)_span]:[color:#72756d] [&>div:nth-child(2)_span]:[font-size:11px] [&>small]:[color:#72756d] [&>small]:[font-size:11px] [&_button_svg]:[width:13px] [margin-top:10px] [position:relative] [&>div:nth-child(2)]:[margin-top:8px] [&>div:nth-child(2)]:[display:flex] [&>div:nth-child(2)]:[align-items:baseline] [&>div:nth-child(2)]:[gap:8px] [&>div:nth-child(2)_strong]:[font:700_20px_var(--font-sans)]">
        <div className="mini-bars [height:78px] [display:flex] [align-items:flex-end] [gap:5px] [border-bottom:1px_solid_rgba(90,85,110,.14)] [&_i]:[flex:1] [&_i]:[min-width:5px] [&_i]:[border-radius:4px_4px_0_0] [&_i]:[background:linear-gradient(#80b4ef,#569ae8)]">
          {widgetTrendBars.map((value, index) => <i className={widget.tone === "mint" ? "bg-[linear-gradient(#72d3b1,#2aaa7d)]" : "bg-[linear-gradient(#80b4ef,#569ae8)]"} key={index} style={{ height: `${value}%` }} />)}
        </div>
        <div><strong>{widget.value}</strong><span>{widget.detail}</span></div>
        <small>10-period workspace trend</small>
        <button onClick={() => openWidget(widget)}>Open analysis <ArrowRight /></button>
      </div>
    );
  }

  if (widget.layout === "schedule") {
    return (
      <div className="widget-schedule [&>button]:[margin-top:7px] [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:4px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&_time]:[font-size:11px] [&_time]:[font-weight:700] [&_small]:[margin-top:2px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_button_svg]:[width:13px] [margin-top:8px] [&>div]:[padding:7px_0] [&>div]:[border-top:1px_solid_rgba(90,85,110,.1)] [&>div]:[display:grid] [&>div]:[grid-template-columns:65px_1fr_15px] [&>div]:[gap:7px] [&>div]:[align-items:center] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_svg]:[width:14px]">
        {widget.items?.slice(0, 4).map((item) => (
          <div key={item}>
            <time>{splitItem(item)[0]}</time>
            <span><strong>{splitItem(item)[1]}</strong><small>{splitItem(item).slice(2).join(" · ")}</small></span>
            <ChevronRight />
          </div>
        ))}
        <button onClick={() => openWidget(widget)}>Open full roster <ArrowRight /></button>
      </div>
    );
  }

  if (widget.layout === "breakdown") {
    return (
      <div className="widget-breakdown [&>button]:[margin-top:7px] [&>button]:[border:0] [&>button]:[background:transparent] [&>button]:[color:#386590] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[gap:4px] [&>button]:[font-size:11px] [&>button]:[font-weight:700] [&>div_small]:[color:#72756d] [&>div_small]:[font-size:11px] [&>p]:[margin:0] [&>p]:[padding:5px_0] [&>p]:[border-top:1px_solid_rgba(90,85,110,.1)] [&>p]:[display:grid] [&>p]:[grid-template-columns:8px_1fr_auto] [&>p]:[gap:6px] [&>p]:[align-items:center] [&>p]:[font-size:11px] [&_button_svg]:[width:13px] [margin-top:8px] [&>div]:[margin-bottom:7px] [&>div_strong]:[display:block] [&>div_small]:[display:block] [&>div_strong]:[font:700_21px_var(--font-sans)] [&>p_i]:[width:7px] [&>p_i]:[height:7px] [&>p_i]:[border-radius:2px] [&>p_i]:[background:#599ce8] [&>p_i.part-1]:[background:#2aaa7d] [&>p_i.part-2]:[background:#e29743] [&>p_i.part-3]:[background:#df6177] [&>p_span]:[color:#777786] [&>p_strong]:[font-size:11px]">
        <div><strong>{widget.value}</strong><small>{widget.detail}</small></div>
        {widget.items?.slice(0, 4).map((item, index) => (
          <p key={item}><i className={breakdownColours[index] ?? breakdownColours[0]} /><span>{splitItem(item)[0]}</span><strong>{splitItem(item).slice(1).join(" · ")}</strong></p>
        ))}
        <button onClick={() => openWidget(widget)}>View finance details <ArrowRight /></button>
      </div>
    );
  }

  return (
    <>
      <div className="metric-value [display:flex] [align-items:center] [gap:8px] [&_strong]:[font:700_25px_var(--font-sans)] [&_strong]:[letter-spacing:-.7px] [&_span]:[font-size:11px] [&_span]:[color:#16815e] [&_span]:[background:#e6f7f0] [&_span]:[padding:3px_5px] [&_span]:[border-radius:5px] [&_span]:[font-weight:700] [&_strong]:[font-size:30px] [&_span]:[font-size:12px]"><strong>{widget.value}</strong>{widget.trend && <span>{widget.trend}</span>}</div>
      <small>{widget.detail}</small>
    </>
  );
}

function ClockContent({ mode }: { mode: "digital" | "analog" }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  if (mode === "analog") {
    const seconds = now.getSeconds() * 6;
    const minutes = now.getMinutes() * 6 + now.getSeconds() * 0.1;
    const hours = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;
    return (
      <div className="mt-2 grid justify-items-center">
        <div className="relative size-[92px] rounded-full border-4 border-brand-100 bg-white shadow-inner">
          <i className="absolute left-1/2 top-1/2 h-[25px] w-[3px] origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-[#313945]" style={{ transform: `translate(-50%, -100%) rotate(${hours}deg)` }} />
          <i className="absolute left-1/2 top-1/2 h-[34px] w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rounded-full bg-brand-600" style={{ transform: `translate(-50%, -100%) rotate(${minutes}deg)` }} />
          <i className="absolute left-1/2 top-1/2 h-[36px] w-px origin-bottom -translate-x-1/2 -translate-y-full bg-[#df6177]" style={{ transform: `translate(-50%, -100%) rotate(${seconds}deg)` }} />
          <b className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-700" />
        </div>
        <small className="mt-2 text-xs text-muted">{now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</small>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <strong className="block font-display text-[34px] leading-none tracking-[-1px] text-[#313945] tabular-nums">
        {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
      </strong>
      <small className="mt-2 block text-xs text-muted">{now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</small>
    </div>
  );
}

function CalendarContent() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: offset + days }, (_, index) => index < offset ? null : index - offset + 1);

  return (
    <div className="mt-2">
      <strong className="font-display text-base">{today.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px]">
        {['M','T','W','T','F','S','S'].map((day, index) => <b className="py-1 text-[#9292a1]" key={`${day}-${index}`}>{day}</b>)}
        {cells.map((day, index) => <span className={`grid aspect-square place-items-center rounded-md ${day === today.getDate() ? "bg-brand-600 font-bold text-white" : "bg-[#f3f7fc] text-[#555466]"}`} key={index}>{day}</span>)}
      </div>
    </div>
  );
}
