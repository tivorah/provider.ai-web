import { Check, Plus, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { widgetAudiences, widgetTemplates } from "../../../mocks/dashboardWidgets";
import type { DashboardWidgetModel, WidgetSize } from "../types";
import { DashboardWidget, widgetIcon } from "./DashboardWidget";

interface WidgetBuilderProps {
  onBack: () => void;
  onCreate: (widget: DashboardWidgetModel) => void;
}

export function WidgetBuilder({ onBack, onCreate }: WidgetBuilderProps) {
  const [selectedId, setSelectedId] = useState(widgetTemplates[0].id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const selected = widgetTemplates.find((widget) => widget.id === selectedId) ?? widgetTemplates[0];
  const [title, setTitle] = useState(selected.title);
  const [size, setSize] = useState<WidgetSize>(selected.size ?? "compact");
  const [audience, setAudience] = useState<string[]>(["Administrators"]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(widgetTemplates.map((widget) => widget.source ?? "Other")))],
    [],
  );
  const filteredWidgets = useMemo(
    () => widgetTemplates.filter((widget) => {
      const matchesCategory = category === "All" || widget.source === category;
      const searchableText = `${widget.title} ${widget.detail} ${widget.source}`.toLowerCase();
      return matchesCategory && searchableText.includes(query.toLowerCase());
    }),
    [category, query],
  );

  const chooseWidget = (widget: DashboardWidgetModel) => {
    setSelectedId(widget.id);
    setTitle(widget.title);
    setSize(widget.size ?? "compact");
  };
  const toggleAudience = (role: string) => {
    setAudience((current) => {
      if (role === "Entire team") return [role];
      if (current.includes(role)) return current.filter((item) => item !== role);
      return [...current.filter((item) => item !== "Entire team"), role];
    });
  };
  const createWidget = () => {
    onCreate({
      ...selected,
      id: `custom-${Date.now()}`,
      title: title.trim() || selected.title,
      size,
      custom: true,
      audience: audience.length ? audience : ["Administrators"],
    });
  };

  return (
    <div className="widget-builder-screen [position:fixed] [inset:0] [z-index:120] [overflow:auto] [&>header]:[height:76px] [&>header]:[padding:0_clamp(24px,4vw,60px)] [&>header]:[display:grid] [&>header]:[grid-template-columns:1fr_auto_1fr] [&>header]:[align-items:center] [&>header]:[border-bottom:1px_solid_var(--border)] [&>header]:[background:white] [&>header>button:first-child]:[justify-self:start] [&>header>button:first-child]:[border:0] [&>header>button:first-child]:[background:transparent] [&>header>button:first-child]:[color:#386590] [&>header>button:first-child]:[font-size:11px] [&>header>button:first-child]:[font-weight:700] [&>header>div]:[text-align:center] [&>header_strong]:[display:block] [&>header_small]:[display:block] [&>header_strong]:[font:700_16px_var(--font-sans)] [&>header_small]:[margin-top:3px] [&>header_small]:[color:#9292a1] [&>header_small]:[font-size:11px] [&>header>.primary-button]:[justify-self:end] [&>main]:[width:min(1120px,calc(100%_-_48px))] [&>main]:[margin:36px_auto] [&>main]:[display:grid] [&>main]:[grid-template-columns:minmax(0,1fr)_minmax(360px,.8fr)] [&>main]:[gap:28px] max-[800px]:[&>header]:[grid-template-columns:1fr_auto] max-[800px]:[&>header>div]:[display:none] max-[800px]:[&>main]:[grid-template-columns:1fr] full-widget-builder [&>header_small]:[font-size:13px] [&>header_small]:[font-size:11px] [&>header_strong]:[font-size:17px] [&>header]:[height:64px] [&>header]:[padding-inline:24px] [&>header_strong]:[font-size:15px]">
      <header>
        <button onClick={onBack}>← Overview</button>
        <div><strong>Widget catalogue</strong><small>{widgetTemplates.length} ready-to-use widgets from across Provider.ai</small></div>
        <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] " onClick={createWidget}><Plus />Add widget</button>
      </header>

      <div className="full-builder-layout [height:calc(100vh_-_64px)] [display:grid] [grid-template-columns:190px_minmax(500px,1fr)_360px] [overflow:hidden] max-[1150px]:[grid-template-columns:170px_1fr_320px] max-[800px]:[display:block] max-[800px]:[overflow-y:auto]">
        <aside className="builder-filters [&_input]:[font-size:13px] [&>p]:[font-size:11px] [&>button]:[padding:10px_9px] [&>button]:[font-size:13px] [&>div_small]:[font-size:11px] [&>div_small]:[line-height:1.45] [&_input]:[min-width:0] [&_input]:[border:0] [&_input]:[outline:0] [&_input]:[font-size:11px] [&>p]:[margin:20px_8px_7px] [&>p]:[color:#72756d] [&>p]:[text-transform:uppercase] [&>p]:[letter-spacing:.7px] [&>p]:[font-size:11px] [&>p]:[font-weight:800] [&>button]:[width:100%] [&>button]:[padding:8px] [&>button]:[border:0] [&>button]:[border-radius:7px] [&>button]:[background:transparent] [&>button]:[color:#68697b] [&>button]:[display:flex] [&>button]:[justify-content:space-between] [&>button]:[text-align:left] [&>button]:[font-size:11px] [&>div_small]:[margin-top:3px] [&>div_small]:[font-size:11px] [&>label]:[height:44px] [&>button_span]:[font-size:11px] [&>div_strong]:[font-size:13px] [padding:18px_12px] [border-right:1px_solid_var(--border)] [background:white] [overflow-y:auto] [&>label]:[height:38px] [&>label]:[padding:0_9px] [&>label]:[border:1px_solid_var(--border)] [&>label]:[border-radius:8px] [&>label]:[display:flex] [&>label]:[align-items:center] [&>label]:[gap:7px] [&>label_svg]:[width:15px] [&>label_svg]:[color:#9292a1] [&>button.active]:[color:#4681c5] [&>button.active]:[background:#f0f5fa] [&>button.active]:[font-weight:700] [&>button_span]:[font-size:11px] [&>div]:[margin-top:22px] [&>div]:[padding:10px] [&>div]:[border-radius:9px] [&>div]:[color:#4681c5] [&>div]:[background:#eff6ff] [&>div_strong]:[display:block] [&>div_small]:[display:block] [&>div_strong]:[font-size:11px] max-[800px]:[border-right:0] max-[800px]:[&>button]:[display:inline-flex] max-[800px]:[&>button]:[width:auto] max-[800px]:[&>button]:[margin:2px]">
          <label>
            <Search />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search widgets…" />
          </label>
          <p>Categories</p>
          {categories.map((item) => (
            <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} key={item}>
              {item}
              <span>{item === "All" ? widgetTemplates.length : widgetTemplates.filter((widget) => widget.source === item).length}</span>
            </button>
          ))}
          <div><strong>Dashboard limit</strong><small>Maximum 10 active widgets</small></div>
        </aside>

        <main className="builder-catalogue [min-width:0] [padding:24px] [overflow-y:auto]">
          <div className="catalogue-heading [&_h1]:[font-size:29px] [&_p]:[font-size:14px] [&>span]:[font-size:12px] [display:flex] [justify-content:space-between] [align-items:flex-start] [&_h1]:[margin:0] [&_p]:[margin:0] [&_h1]:[font-size:25px] [&_p]:[margin-top:5px] [&_p]:[color:#777786] [&_p]:[font-size:12px] [&>span]:[padding:5px_8px] [&>span]:[border-radius:7px] [&>span]:[background:#e6eef8] [&>span]:[font-size:11px]">
            <div><h1>Choose a widget</h1><p>Every widget uses information already available in your Provider.ai workspace.</p></div>
            <span>{filteredWidgets.length} shown</span>
          </div>
          <div className="fifty-template-grid [&_small]:[font-size:11.5px] [&_small]:[margin-top:3px] [&_small]:[color:#386590] [&_small]:[font-size:11px] [&_small]:[font-weight:700] [grid-template-columns:repeat(3,minmax(190px,1fr))] [gap:11px] [&>button]:[min-height:145px] [&>button]:[padding:14px] [&_strong]:[font-size:14px] [&_p]:[font-size:12.5px] [&_p]:[line-height:1.45] max-[1250px]:[grid-template-columns:repeat(2,minmax(210px,1fr))] [margin-top:18px] [display:grid] [grid-template-columns:repeat(3,minmax(0,1fr))] [gap:9px] [&>button]:[min-height:125px] [&>button]:[padding:12px] [&>button]:[border:1px_solid_var(--border)] [&>button]:[border-radius:11px] [&>button]:[background:white] [&>button]:[display:grid] [&>button]:[grid-template-columns:35px_1fr_16px] [&>button]:[gap:8px] [&>button]:[text-align:left] [&>button:hover]:[border-color:#bed6f2] [&>button.selected]:[border:2px_solid_#599ce8] [&>button.selected]:[background:#f5faff] [&_.catalogue-icon]:[width:35px] [&_.catalogue-icon]:[height:35px] [&_strong]:[display:block] [&_strong]:[margin:0] [&_small]:[display:block] [&_small]:[margin:0] [&_p]:[display:block] [&_p]:[margin:0] [&_strong]:[font-size:12px] [&_p]:[margin-top:7px] [&_p]:[color:#72756d] [&_p]:[font-size:11px] [&_p]:[line-height:1.4] [&>button>svg]:[width:15px] [&>button>svg]:[color:#569ae8] max-[1150px]:[grid-template-columns:repeat(2,1fr)] max-[800px]:[grid-template-columns:1fr]">
            {filteredWidgets.map((widget) => (
              <button className={selectedId === widget.id ? "selected [&_.lp-checkbox]:[background:#5795dc] [&_.lp-checkbox]:[color:#fff] [&_.lp-checkbox]:[border-color:#5795dc]" : ""} onClick={() => chooseWidget(widget)} key={widget.id}>
                <span className={`catalogue-icon [width:34px] [height:34px] [border-radius:9px] [display:grid] [place-items:center] [color:#4f88ca] [background:#f0f5fa] [font-size:11px] [font-weight:800] [&.tone-mint]:[color:#24805f] [&.tone-mint]:[background:#e7f7f1] [&.tone-amber]:[color:#a96729] [&.tone-amber]:[background:#fff1df] [&.tone-rose]:[color:#b54c61] [&.tone-rose]:[background:#ffe9ed] tone-${widget.tone}`}>{widgetIcon(widget.id)}</span>
                <div><strong>{widget.title}</strong><small>{widget.source} · {widget.layout ?? "Metric"}</small><p>{widget.detail}</p></div>
                {selectedId === widget.id && <Check />}
              </button>
            ))}
          </div>
        </main>

        <aside className="builder-config [&>label_input]:[height:42px] [&>label_input]:[font-size:13px] [&_.dashboard-widget>p]:[font-size:12px] [&_.widget-list_small]:[font-size:11px] [&_.widget-schedule_small]:[font-size:11px] [&>label_input]:[height:38px] [&>label_input]:[padding:0_9px] [&>label_input]:[border:1px_solid_var(--border)] [&>label_input]:[border-radius:8px] [&>label_input]:[font-size:11px] [&>label_strong]:[font-size:13px] [&_.widget-list_strong]:[font-size:12px] [&_.widget-schedule_strong]:[font-size:12px] [padding:18px] [border-left:1px_solid_var(--border)] [background:white] [overflow-y:auto] [&_.dashboard-widget]:[margin:13px_0] [&_.dashboard-widget]:[min-height:150px] [&_.dashboard-widget]:[color:#3c434d] [&>label]:[display:grid] [&>label]:[gap:5px] [&>label_strong]:[font-size:11px] max-[800px]:[border-left:0] [&_.widget-progress>p:nth-of-type(n+3)]:[display:none] [&_.widget-schedule>div:nth-child(n+4)]:[display:none] [&_.widget-breakdown>p:nth-of-type(n+4)]:[display:none]">
          <div className="config-heading [&_small]:[font-size:12px] [&_small]:[color:#9292a1] [&_small]:[font-size:11px] [&_span]:[font-size:14px] [display:flex] [justify-content:space-between] [&_span]:[font-weight:800]"><span>Live preview</span><small>{selected.source}</small></div>
          <DashboardWidget widget={{ ...selected, title: title || selected.title, size, audience }} />
          <label>
            <strong>Widget name</strong>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={60} />
          </label>
          <div className="compact-config [&_button]:[padding:8px_10px] [&_button]:[font-size:11.5px] [&_button]:[padding:6px_8px] [&_button]:[border:1px_solid_var(--border)] [&_button]:[border-radius:7px] [&_button]:[background:white] [&_button]:[font-size:11px] [&>strong]:[font-size:13px] [&>strong]:[font-size:11px] [margin-top:13px] [&>span]:[margin-top:7px] [&>span]:[display:flex] [&>span]:[flex-wrap:wrap] [&>span]:[gap:5px] [&>div]:[margin-top:7px] [&>div]:[display:flex] [&>div]:[flex-wrap:wrap] [&>div]:[gap:5px] [&_button.active]:[color:#4681c5] [&_button.active]:[border-color:#a1c6f1] [&_button.active]:[background:#f0f5fa] [&_button.active]:[font-weight:700] [&_button_svg]:[width:11px]">
            <strong>Card size</strong>
            <span>
              <button className={size === "compact" ? "active" : ""} onClick={() => setSize("compact")}>Compact</button>
              <button className={size === "wide" ? "active" : ""} onClick={() => setSize("wide")}>Wide</button>
            </span>
            <small className="mt-2 block text-[11px] leading-relaxed text-[#72756d]">
              Compact is designed for key analytics and headline numbers. Wide is best for lists, schedules and charts.
            </small>
          </div>
          <div className="compact-config [&_button]:[padding:8px_10px] [&_button]:[font-size:11.5px] [&_button]:[padding:6px_8px] [&_button]:[border:1px_solid_var(--border)] [&_button]:[border-radius:7px] [&_button]:[background:white] [&_button]:[font-size:11px] [&>strong]:[font-size:13px] [&>strong]:[font-size:11px] [margin-top:13px] [&>span]:[margin-top:7px] [&>span]:[display:flex] [&>span]:[flex-wrap:wrap] [&>span]:[gap:5px] [&>div]:[margin-top:7px] [&>div]:[display:flex] [&>div]:[flex-wrap:wrap] [&>div]:[gap:5px] [&_button.active]:[color:#4681c5] [&_button.active]:[border-color:#a1c6f1] [&_button.active]:[background:#f0f5fa] [&_button.active]:[font-weight:700] [&_button_svg]:[width:11px]">
            <strong>Who can see it?</strong>
            <div>
              {widgetAudiences.map((role) => (
                <button className={audience.includes(role) ? "active" : ""} onClick={() => toggleAudience(role)} key={role}>
                  {audience.includes(role) && <Check />}{role}
                </button>
              ))}
            </div>
          </div>
          <div className="widget-description [&_strong]:[font-size:12.5px] [&_p]:[font-size:11.5px] [&_p]:[line-height:1.5] [margin-top:14px] [padding:10px] [border-radius:9px] [color:#4681c5] [background:#eff6ff] [display:flex] [gap:8px] [&>svg]:[width:16px] [&>svg]:[flex:none] [&_strong]:[font-size:11px] [&_p]:[margin:3px_0_0] [&_p]:[color:#77718e] [&_p]:[font-size:11px] [&_p]:[line-height:1.45]">
            <ShieldCheck />
            <span><strong>About this widget</strong><p>{selected.detail}. It updates from {selected.source} and respects each user’s record permissions.</p></span>
          </div>
          <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] add-widget-final [width:100%] [margin-top:14px] [justify-content:center]" onClick={createWidget}><Plus />Add to dashboard</button>
        </aside>
      </div>
    </div>
  );
}
