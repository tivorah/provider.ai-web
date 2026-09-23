import { useEffect, useMemo, useState } from "react";
import type { DashboardWidgetModel, WidgetLanding } from "../types";

const CUSTOM_WIDGETS_KEY = "provider-ai-custom-widgets";
const WIDGET_ORDER_KEY = "provider-ai-widget-order";
const ENABLED_WIDGETS_KEY = "provider-ai-widget-enabled";
const MAX_ACTIVE_WIDGETS = 10;

function readStoredList<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

export function useDashboardWidgets(baseWidgets: DashboardWidgetModel[], defaultIds: string[]) {
  const [customWidgets, setCustomWidgets] = useState<DashboardWidgetModel[]>(() => readStoredList(CUSTOM_WIDGETS_KEY));
  const [order, setOrder] = useState<string[]>(() => readStoredList(WIDGET_ORDER_KEY));
  const [enabled, setEnabled] = useState<string[]>(() => readStoredList(ENABLED_WIDGETS_KEY));

  const allWidgets = useMemo(() => [...baseWidgets, ...customWidgets], [baseWidgets, customWidgets]);
  const visibleWidgets = useMemo(
    () => order
      .map((id) => allWidgets.find((widget) => widget.id === id))
      .filter((widget): widget is DashboardWidgetModel => Boolean(widget))
      .filter((widget) => enabled.includes(widget.id)),
    [allWidgets, enabled, order],
  );

  useEffect(() => {
    if (!defaultIds.length) return;
    setOrder((current) => current.length ? current : defaultIds);
    setEnabled((current) => current.length ? current : defaultIds);
  }, [defaultIds]);

  useEffect(() => {
    localStorage.setItem(WIDGET_ORDER_KEY, JSON.stringify(order));
    localStorage.setItem(ENABLED_WIDGETS_KEY, JSON.stringify(enabled));
    localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(customWidgets));
  }, [customWidgets, enabled, order]);

  const addWidget = (widget: DashboardWidgetModel) => {
    if (enabled.length >= MAX_ACTIVE_WIDGETS) return false;
    setCustomWidgets((current) => [...current, widget]);
    setOrder((current) => [...current, widget.id]);
    setEnabled((current) => [...current, widget.id]);
    return true;
  };

  const deactivateWidget = (id: string) => {
    setEnabled((current) => current.filter((item) => item !== id));
  };

  const deleteWidget = (id: string) => {
    setCustomWidgets((current) => current.filter((widget) => widget.id !== id));
    setOrder((current) => current.filter((item) => item !== id));
    setEnabled((current) => current.filter((item) => item !== id));
  };

  const restoreDefaults = () => {
    const defaults = defaultIds.slice(0, MAX_ACTIVE_WIDGETS);
    setOrder(defaults);
    setEnabled(defaults);
  };

  const moveWidget = (source: string, target: string, side: WidgetLanding["side"]) => {
    if (!source || source === target) return;
    setOrder((current) => {
      const next = current.filter((id) => id !== source);
      const targetIndex = next.indexOf(target);
      next.splice(Math.max(0, targetIndex + (side === "after" ? 1 : 0)), 0, source);
      return next;
    });
  };

  const moveWidgetToEnd = (source: string) => {
    setOrder((current) => [...current.filter((id) => id !== source), source]);
  };

  const swapWidgets = (source: string, target: string) => {
    if (!source || !target || source === target) return;
    setOrder((current) => {
      const sourceIndex = current.indexOf(source);
      const targetIndex = current.indexOf(target);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      [next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]];
      return next;
    });
  };

  const canPlaceWidget = (source: string, target: string, side: WidgetLanding["side"]) => {
    const sourceWidget = allWidgets.find((widget) => widget.id === source);
    if (!sourceWidget) return false;
    const withoutSource = visibleWidgets.filter((widget) => widget.id !== source);
    const insertionIndex = withoutSource.findIndex((widget) => widget.id === target) + (side === "after" ? 1 : 0);
    return sourceWidget.size !== "wide" || insertionIndex % 4 !== 3;
  };

  return {
    addWidget,
    allWidgets,
    canPlaceWidget,
    deactivateWidget,
    deleteWidget,
    enabled,
    moveWidget,
    moveWidgetToEnd,
    restoreDefaults,
    swapWidgets,
    visibleWidgets,
  };
}
