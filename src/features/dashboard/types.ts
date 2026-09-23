import type { DragEvent } from "react";

export type WidgetLayout = "metric" | "list" | "status" | "progress" | "chart" | "schedule" | "breakdown" | "digital-clock" | "analog-clock" | "calendar";
export type WidgetSize = "compact" | "wide";

export interface DashboardWidgetModel {
  id: string;
  title: string;
  value: string;
  detail: string;
  tone: string;
  trend?: string;
  custom?: boolean;
  source?: string;
  layout?: WidgetLayout;
  size?: WidgetSize;
  items?: string[];
  audience?: string[];
}

export interface WidgetLanding {
  id: string;
  side: "before" | "after";
  invalid: boolean;
}

export interface WidgetDragProps {
  dragging?: boolean;
  landing?: Omit<WidgetLanding, "id"> | null;
  onDragStart?: (id: string, event: DragEvent) => void;
  onDragOver?: (event: DragEvent, id: string) => void;
  onDrop?: (event: DragEvent, id: string) => void;
  onDragEnd?: () => void;
}
