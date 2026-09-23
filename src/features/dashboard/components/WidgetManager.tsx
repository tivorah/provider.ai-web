import { ArrowRight, Check, Settings2, Sparkles, Trash2, X } from "lucide-react";
import type { DashboardWidgetModel } from "../types";
import { widgetIcon } from "./DashboardWidget";

interface WidgetManagerProps {
  widgets: DashboardWidgetModel[];
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
  onBuild: () => void;
  onClose: () => void;
  onRestore: () => void;
}

export function WidgetManager({
  widgets,
  onDeactivate,
  onDelete,
  onBuild,
  onClose,
  onRestore,
}: WidgetManagerProps) {
  const customWidgets = widgets.filter((widget) => widget.custom);
  const providerWidgets = widgets.filter((widget) => !widget.custom);

  return (
    <div
      className="widget-backdrop [position:fixed] [inset:0] [z-index:90] [display:flex] [justify-content:flex-end] [background:rgba(27,25,40,.38)] [backdrop-filter:blur(3px)]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <aside className="widget-manager [width:min(440px,100%)] [height:100%] [display:flex] [flex-direction:column] [background:#f6f9fd] [box-shadow:-20px_0_60px_rgba(22,20,35,.18)] [width:min(390px,100%)]">
        <div className="widget-manager-head [padding:19px] [border-bottom:1px_solid_var(--border)] [background:white] [display:flex] [align-items:flex-start] [justify-content:space-between] [&>div]:[display:flex] [&>div]:[align-items:center] [&>div]:[gap:10px] [&>div>span]:[width:36px] [&>div>span]:[height:36px] [&>div>span]:[border-radius:10px] [&>div>span]:[display:grid] [&>div>span]:[place-items:center] [&>div>span]:[color:#386590] [&>div>span]:[background:#f0f5fa] [&_svg]:[width:17px] [&_h2]:[margin:0] [&_p]:[margin:0] [&_h2]:[font:700_13px_var(--font-sans)] [&_p]:[margin-top:4px] [&_p]:[color:#9292a1] [&_p]:[font-size:11px] [&>button]:[border:0] [&>button]:[background:transparent] [&_h2]:[font-size:18px] [&_p]:[font-size:12px] [padding:15px] [&_h2]:[font-size:15px] [&_p]:[font-size:11px]">
          <div>
            <span><Settings2 /></span>
            <div>
              <h2>Dashboard widgets</h2>
              <p>Manage the cards currently visible on this dashboard.</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close widget manager"><X /></button>
        </div>

        <div className="widget-manager-body [&>button_strong]:[font-size:11px] [&>button_small]:[font-size:11px] [padding:17px] [overflow:auto] [&>p]:[margin:0_0_9px] [&>p]:[color:#72756d] [&>p]:[text-transform:uppercase] [&>p]:[letter-spacing:.7px] [&>p]:[font-size:11px] [&>p]:[font-weight:800] [&>button]:[width:100%] [&>button]:[padding:11px] [&>button]:[margin-bottom:7px] [&>button]:[border:1px_solid_var(--border)] [&>button]:[border-radius:11px] [&>button]:[background:white] [&>button]:[display:grid] [&>button]:[grid-template-columns:35px_1fr_25px] [&>button]:[gap:9px] [&>button]:[align-items:center] [&>button]:[text-align:left] [&>button.active]:[border-color:#d3e5fa] [&>button.active]:[background:#f3f3ef] [&>button_strong]:[display:block] [&>button_small]:[display:block] [&>button_strong]:[font-size:11px] [&>button_small]:[margin-top:4px] [&>button_small]:[color:#72756d] [&>button_small]:[font-size:11px] [&>button_em]:[width:21px] [&>button_em]:[height:21px] [&>button_em]:[border-radius:6px] [&>button_em]:[display:grid] [&>button_em]:[place-items:center] [&>button_em]:[color:#72756d] [&>button_em]:[background:#dddfd7] [&>button.active_em]:[color:white] [&>button.active_em]:[background:#5796df] [&>button_em_svg]:[width:12px] [&>button_strong]:[font-size:11px] [&>button_small]:[font-size:11px] [&>p]:[font-size:12px] [&>button_strong]:[font-size:14px] [&>button_small]:[font-size:12px] [padding:12px] [&>button]:[padding:8px]">
          <button className="create-widget-primary [margin:13px_0] [padding:14px] [border:1px_solid_#c8dffa] [background:linear-gradient(135deg,#f2f8ff,#e9f3ff)] [&>span]:[width:38px] [&>span]:[height:38px] [&>span]:[border-radius:10px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[color:#386590] [&>span]:[background:white] [&>svg]:[color:#386590]" onClick={onBuild}>
            <span><Sparkles /></span>
            <div>
              <strong>Create a custom widget</strong>
              <small>Choose information already available in Provider.ai.</small>
            </div>
            <ArrowRight />
          </button>

          {customWidgets.length > 0 && (
            <WidgetGroup
              title="My custom widgets"
              widgets={customWidgets}
              onDeactivate={onDeactivate}
              onDelete={onDelete}
            />
          )}

          <WidgetGroup
            title="Active Provider.ai widgets"
            widgets={providerWidgets}
            onDeactivate={onDeactivate}
          />
        </div>

        <div className="widget-manager-foot [&_button]:[font-size:11px] [margin-top:auto] [border-top:1px_solid_var(--border)] [display:flex] [justify-content:space-between] [&_.primary-button]:[padding:9px_13px] ">
          <button className="secondary-button [display:flex] [align-items:center] [gap:7px] max-[570px]:[padding-inline:8px] " onClick={onRestore}>Restore defaults</button>
          <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] " onClick={onClose}>Done</button>
        </div>
      </aside>
    </div>
  );
}

function WidgetGroup({
  title,
  widgets,
  onDeactivate,
  onDelete,
}: {
  title: string;
  widgets: DashboardWidgetModel[];
  onDeactivate: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <>
      <div className="widget-section-title [margin:18px_0_9px] [display:flex] [align-items:center] [justify-content:space-between] [color:#777786] [text-transform:uppercase] [letter-spacing:.65px] [font-size:11px] [font-weight:800] [&:first-child]:[margin-top:0] [&_em]:[padding:3px_6px] [&_em]:[border-radius:6px] [&_em]:[background:#e6eef8] [&_em]:[font-style:normal]"><span>{title}</span><em>{widgets.length}</em></div>
      {widgets.map((widget) => (
        <div className="custom-widget-row [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [margin-bottom:8px] [display:grid] [grid-template-columns:1fr_40px] [gap:6px] [&>button:first-child]:[width:100%] [&>button:first-child]:[padding:11px] [&>button:first-child]:[border:1px_solid_var(--border)] [&>button:first-child]:[border-radius:11px] [&>button:first-child]:[background:white] [&>button:first-child]:[display:grid] [&>button:first-child]:[grid-template-columns:35px_1fr_25px] [&>button:first-child]:[gap:9px] [&>button:first-child]:[align-items:center] [&>button:first-child]:[text-align:left] [&>button:first-child.active]:[border-color:#d3e5fa] [&>button:first-child.active]:[background:#f3f3ef] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:14px] [&_small]:[margin-top:4px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_em]:[width:22px] [&_em]:[height:22px] [&_em]:[border-radius:6px] [&_em]:[display:grid] [&_em]:[place-items:center] [&_em]:[background:#e6eef8] [&_.active_em]:[color:white] [&_.active_em]:[background:#569ae8] [&_em_svg]:[width:13px] [&>button:first-child]:[padding:8px]" key={widget.id}>
          <button className="active" onClick={() => onDeactivate(widget.id)}>
            <span className={`catalogue-icon [width:34px] [height:34px] [border-radius:9px] [display:grid] [place-items:center] [color:#4f88ca] [background:#f0f5fa] [font-size:11px] [font-weight:800] [&.tone-mint]:[color:#24805f] [&.tone-mint]:[background:#e7f7f1] [&.tone-amber]:[color:#a96729] [&.tone-amber]:[background:#fff1df] [&.tone-rose]:[color:#b54c61] [&.tone-rose]:[background:#ffe9ed] tone-${widget.tone}`}>{widgetIcon(widget.id)}</span>
            <span><strong>{widget.title}</strong><small>{widget.detail}</small></span>
            <em><Check /></em>
          </button>
          {onDelete && (
            <button className="delete-widget [border:1px_solid_#f0ccd3] [border-radius:10px] [color:#b54c61] [background:#fff5f6] [&:hover]:[color:white] [&:hover]:[background:#bd4b60] [&_svg]:[width:16px]" onClick={() => onDelete(widget.id)} title="Delete widget">
              <Trash2 />
            </button>
          )}
        </div>
      ))}
    </>
  );
}
