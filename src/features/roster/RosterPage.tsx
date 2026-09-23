import { PageHeader } from "../../components/PageHeader";
import {
  AlertTriangle, ArrowRight, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight, Clock3, Filter, Info,
  MapPin, Maximize2, Minimize2, MoreHorizontal, Plus, RefreshCcw, Search, Sparkles,
  TriangleAlert, UsersRound, X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { rosterShifts } from "../../mocks/mockDomain";
import { formatShiftTime } from "../../utils/formatters";
import { ShiftEditor } from "./components/ShiftEditor";

const shiftColourClasses: Record<string, string> = {
  violet: "border-[#5e9ce3] bg-[#edf5ff] text-[#487fbd]",
  mint: "border-[#2aaa7d] bg-[#e9f7f2] text-[#21765a]",
  amber: "border-[#e29743] bg-[#fff3e4] text-[#996023]",
  rose: "border-[#da5d73] bg-[#ffebee] text-[#a04456]",
  blue: "border-[#4b94ce] bg-[#eaf4fd] text-[#316d9e]",
};
const shiftDropColours: Record<string, { line: string; label: string }> = {
  violet: { line: "#5e9ce3", label: "#4681c5" },
  mint: { line: "#2aaa7d", label: "#21765a" },
  amber: { line: "#e29743", label: "#996023" },
  rose: { line: "#da5d73", label: "#a04456" },
  blue: { line: "#4b94ce", label: "#316d9e" },
};

const rosterStartDate = new Date(2026, 7, 3);
const rosterDate = (day: number) => {
  const date = new Date(rosterStartDate);
  date.setDate(date.getDate() + day);
  return date;
};
const rosterDayLabel = (day: number) =>
  rosterDate(day).toLocaleDateString("en-AU", { weekday: "short", day: "numeric" });
const rosterDayFromDateInput = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return Math.round(
    (Date.UTC(year, month - 1, day) - Date.UTC(2026, 7, 3)) / 86_400_000,
  );
};
const rosterRangeLabel = (startDay: number, endDay: number) => {
  const start = rosterDate(startDay);
  const end = rosterDate(endDay);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  return sameMonth
    ? `${start.getDate()}–${end.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`
    : `${start.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}–${end.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`;
};

export function RosterPage({ createRequest = 0 }: { createRequest?: number }) {
  const rosterFullscreenRef = useRef<HTMLDivElement>(null);
  const rosterBoardRef = useRef<HTMLElement>(null);
  const rosterScrollRef = useRef<HTMLDivElement>(null);
  const [weekDayWidth, setWeekDayWidth] = useState(120);
  const [horizontalScroll, setHorizontalScroll] = useState({ left: false, right: false });
  const [isRosterFullscreen, setIsRosterFullscreen] = useState(false);
  const [view, setView] = useState("Week");
  const [shifts, setShifts] =
    useState<Array<(typeof rosterShifts)[number] & { breakMinutes?: number }>>(
      rosterShifts,
    );
  const [toast, setToast] = useState("");
  const [errorToast, setErrorToast] = useState("");
  const [draggingId, setDraggingId] = useState("");
  const [dropPreview, setDropPreview] = useState<{
    day: number;
    start: number;
    conflict: string;
  } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [draftSlot, setDraftSlot] = useState<{
    day: number;
    start: number;
  } | null>(null);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const periodStartDay = weekOffset * 7;
  const displayDayCount = view === "Day" ? 1 : view === "Fortnight" ? 14 : 7;
  const displayDays = Array.from({ length: displayDayCount }, (_, index) => {
    const day = view === "Day" ? selectedDay : periodStartDay + index;
    return { label: rosterDayLabel(day), day };
  });
  const visiblePeriodShifts = shifts.filter((shift) => displayDays.some(({ day }) => day === shift.day));
  const draggingShift = shifts.find((shift) => shift.id === draggingId);
  const dropColours = shiftDropColours[draggingShift?.colour ?? "violet"] ?? shiftDropColours.violet;
  const shiftLanes = useMemo(() => {
    const layout = new Map<string, { lane: number; laneCount: number }>();

    for (const day of new Set(shifts.map((shift) => shift.day))) {
      const dayShifts = shifts
        .filter((shift) => shift.day === day)
        .sort((a, b) => a.start - b.start || b.duration - a.duration);
      let cluster: Array<{ id: string; lane: number }> = [];
      let clusterEnd = -1;
      let laneEnds: number[] = [];

      const finishCluster = () => {
        const laneCount = Math.max(1, laneEnds.length);
        cluster.forEach(({ id, lane }) => layout.set(id, { lane, laneCount }));
        cluster = [];
        laneEnds = [];
      };

      dayShifts.forEach((shift) => {
        if (cluster.length && shift.start >= clusterEnd) finishCluster();
        const availableLane = laneEnds.findIndex((end) => end <= shift.start);
        const lane = availableLane === -1 ? laneEnds.length : availableLane;
        laneEnds[lane] = shift.start + shift.duration;
        cluster.push({ id: shift.id, lane });
        clusterEnd = Math.max(clusterEnd, shift.start + shift.duration);
      });
      if (cluster.length) finishCluster();
    }

    return layout;
  }, [shifts]);
  const dayColumnWidths = displayDays.map(({ day }) => {
    if (view === "Day") return 120;
    const concurrentLanes = shifts.reduce(
      (maximum, shift) =>
        shift.day === day
          ? Math.max(maximum, shiftLanes.get(shift.id)?.laneCount ?? 1)
          : maximum,
      1,
    );
    return weekDayWidth * concurrentLanes;
  });
  const rosterCanvasMinWidth =
    56 + dayColumnWidths.reduce((total, width) => total + width, 0);
  const rosterCanvasWidth = view === "Day" ? "100%" : `${rosterCanvasMinWidth}px`;
  const rosterGridColumns =
    view === "Day"
      ? "56px minmax(120px, 1fr)"
      : `56px ${dayColumnWidths.map((width) => `${width}px`).join(" ")}`;

  useLayoutEffect(() => {
    const board = rosterBoardRef.current;
    if (!board) return;

    const syncWeekDayWidth = () => {
      setWeekDayWidth(Math.max(120, (board.clientWidth - 56) / 7));
    };
    syncWeekDayWidth();

    const observer = new ResizeObserver(syncWeekDayWidth);
    observer.observe(board);
    return () => observer.disconnect();
  }, []);

  const syncHorizontalControls = () => {
    const board = rosterBoardRef.current;
    if (!board) return;
    setHorizontalScroll({
      left: board.scrollLeft > 8,
      right: board.scrollLeft < board.scrollWidth - board.clientWidth - 8,
    });
  };

  useEffect(() => {
    const board = rosterBoardRef.current;
    if (!board) return;
    if (view !== "Fortnight") {
      board.scrollLeft = 0;
      setHorizontalScroll({ left: false, right: false });
      return;
    }

    const timer = window.setTimeout(() => {
      syncHorizontalControls();
      board.scrollTo({
        left: Math.min(260, board.scrollWidth - board.clientWidth),
        behavior: "smooth",
      });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [view, weekDayWidth]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsRosterFullscreen(document.fullscreenElement === rosterFullscreenRef.current);
    };
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!isRosterFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const exitOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsRosterFullscreen(false);
    };
    window.addEventListener("keydown", exitOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", exitOnEscape);
    };
  }, [isRosterFullscreen]);

  const toggleRosterFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (rosterFullscreenRef.current?.requestFullscreen) {
      await rosterFullscreenRef.current.requestFullscreen();
      return;
    }
    setIsRosterFullscreen((current) => !current);
  };
  const conflictFor = (
    id: string,
    day: number,
    start: number,
    worker?: string,
    participant?: string,
    duration?: number,
  ) => {
    const moving = shifts.find((shift) => shift.id === id);
    const end = start + (duration ?? moving?.duration ?? 1);
    const workerName = worker ?? moving?.worker ?? "Open shift";
    const participantName = participant ?? moving?.participant ?? "";
    const clash = shifts.find(
      (shift) =>
        shift.id !== id &&
        shift.day === day &&
        start < shift.start + shift.duration &&
        end > shift.start &&
        (participantName === shift.participant ||
          (workerName !== "Open shift" && workerName === shift.worker)),
    );
    if (!clash) return "";
    return participantName === clash.participant
      ? `${participantName} already has a shift ${formatShiftTime(clash.start)}–${formatShiftTime(clash.start + clash.duration)}.`
      : `${workerName} is already rostered ${formatShiftTime(clash.start)}–${formatShiftTime(clash.start + clash.duration)}.`;
  };
  const snapDropTime = (clientY: number, element: HTMLElement, id: string) => {
    const rect = element.getBoundingClientRect();
    const duration = shifts.find((shift) => shift.id === id)?.duration ?? 1;
    return Math.min(
      24 - duration,
      Math.max(0, Math.round(((clientY - rect.top) / 56) * 4) / 4),
    );
  };
  const moveShift = (id: string, day: number, start: number) => {
    const duration = shifts.find((shift) => shift.id === id)?.duration ?? 1;
    const snapped = Math.min(
      24 - duration,
      Math.max(0, Math.round(start * 4) / 4),
    );
    const conflict = conflictFor(id, day, snapped);
    setDraggingId("");
    setDropPreview(null);
    if (conflict) {
      setErrorToast(`Shift not moved. ${conflict}`);
      window.setTimeout(() => setErrorToast(""), 3600);
      return;
    }
    setShifts((current) =>
      current.map((shift) =>
        shift.id === id ? { ...shift, day, start: snapped } : shift,
      ),
    );
    setToast(
      `Shift moved to ${displayDays.find((item) => item.day === day)?.label.split(" ")[0] ?? "day"} at ${formatShiftTime(snapped)}–${formatShiftTime(snapped + duration)}. Coverage, pay and margin recalculated.`,
    );
    window.setTimeout(() => setToast(""), 2600);
  };
  const saveShift = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const parseTime = (value: FormDataEntryValue) => {
      const [hour, minute] = value.toString().split(":").map(Number);
      return hour + minute / 60;
    };
    const start = parseTime(values.startTime);
    const end = parseTime(values.endTime);
    const duration = end - start;
    const breakMinutes = Number(values.breakMinutes);
    const day = rosterDayFromDateInput(values.date.toString());
    const worker = values.worker.toString();
    const participant = values.participant.toString();
    const recurrenceMonths = editingShiftId
      ? 0
      : Number(values.recurrenceMonths ?? 0);
    if (duration <= 0) {
      setErrorToast(
        "End time must be later than start time. Split overnight work into two dated shifts.",
      );
      return;
    }
    if (breakMinutes < 0 || breakMinutes >= duration * 60) {
      setErrorToast("Break time must be shorter than the total shift time.");
      return;
    }
    const selectedDays = editingShiftId
      ? [day]
      : formData.getAll("selectedDates").map((date) => rosterDayFromDateInput(date.toString()));
    if (selectedDays.length === 0) {
      setErrorToast("Select at least one day in the week for this shift.");
      return;
    }
    const occurrenceDays = [...new Set(selectedDays)].sort((a, b) => a - b);
    if (recurrenceMonths > 0) {
      const seriesEnd = rosterDate(day);
      seriesEnd.setMonth(seriesEnd.getMonth() + recurrenceMonths);
      for (const selectedOccurrenceDay of selectedDays) {
        for (let occurrenceDay = selectedOccurrenceDay + 7; rosterDate(occurrenceDay) <= seriesEnd; occurrenceDay += 7) {
          occurrenceDays.push(occurrenceDay);
        }
      }
      occurrenceDays.sort((a, b) => a - b);
    }
    const conflictingOccurrence = occurrenceDays
      .map((occurrenceDay) => ({
        day: occurrenceDay,
        conflict: conflictFor(
          editingShiftId ?? "new",
          occurrenceDay,
          start,
          worker,
          participant,
          duration,
        ),
      }))
      .find((occurrence) => occurrence.conflict);
    if (conflictingOccurrence) {
      const conflictDate = rosterDate(conflictingOccurrence.day).toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      setErrorToast(`Shift series not saved. ${conflictDate}: ${conflictingOccurrence.conflict}`);
      return;
    }
    const recordForDay = (occurrenceDay: number) => ({
      day: occurrenceDay,
      start,
      duration,
      breakMinutes,
      participant,
      worker,
      service: values.service.toString(),
      status: (worker === "Open shift" ? "open" : "confirmed") as "open" | "confirmed",
      margin: 29,
      colour: "violet",
    });
    setShifts((current) =>
      editingShiftId
        ? current.map((shift) =>
            shift.id === editingShiftId ? { ...shift, ...recordForDay(day) } : shift,
          )
        : [
            ...current,
            ...occurrenceDays.map((occurrenceDay, index) => ({
              id: `s-${Date.now()}-${index}`,
              ...recordForDay(occurrenceDay),
            })),
          ],
    );
    setCreateOpen(false);
    setDraftSlot(null);
    setEditingShiftId(null);
    setToast(
      editingShiftId
        ? `Shift updated for ${participant}, ${formatShiftTime(start)}–${formatShiftTime(end)}.`
        : recurrenceMonths > 0
          ? `${occurrenceDays.length} shifts created across ${selectedDays.length} weekday${selectedDays.length === 1 ? "" : "s"} for the next ${recurrenceMonths} month${recurrenceMonths === 1 ? "" : "s"}.`
          : `${occurrenceDays.length} shift${occurrenceDays.length === 1 ? "" : "s"} created for ${participant}, ${formatShiftTime(start)}–${formatShiftTime(end)}.`,
    );
  };
  const openCreate = (slot?: { day: number; start: number }) => {
    setEditingShiftId(null);
    setDraftSlot(slot ?? null);
    if (slot) setSelectedDay(slot.day);
    setCreateOpen(true);
  };
  useEffect(() => {
    if (createRequest > 0) openCreate();
  }, [createRequest]);
  const openEdit = (id: string) => {
    const shift = shifts.find((item) => item.id === id);
    if (!shift) return;
    setEditingShiftId(id);
    setDraftSlot(null);
    setSelectedDay(shift.day);
    setCreateOpen(true);
  };
  const editingShift = editingShiftId
    ? shifts.find((shift) => shift.id === editingShiftId)
    : undefined;
  useLayoutEffect(() => {
    const scrollArea = rosterScrollRef.current;
    if (!scrollArea) return;
    const visibleDayNumbers = displayDays.map(({ day }) => day);
    const visibleShifts = shifts.filter((shift) =>
      visibleDayNumbers.includes(shift.day),
    );
    const earliestStart = visibleShifts.length
      ? Math.min(...visibleShifts.map((shift) => shift.start))
      : 8;
    const leadInHours = 1;
    scrollArea.scrollTop = Math.max(0, (earliestStart - leadInHours) * 56);
  }, [view, selectedDay, weekOffset]);
  return (
    <section className="page m-0 max-w-none roster-page text-sm leading-normal">
      <PageHeader category="Care delivery" title="Roster" description="Plan services, assign workers and review coverage across your team."><button className="primary-button min-h-11" onClick={() => openCreate()}><Plus className="size-4" />Create shift</button></PageHeader>
      <div className="roster-command [display:flex] [align-items:center] [gap:15px] [margin-bottom:12px] max-[760px]:[align-items:flex-start] max-[760px]:[flex-wrap:wrap]">
        <div className="date-control [display:flex] [align-items:center] [gap:7px] [&_button]:[width:28px] [&_button]:[height:28px] [&_button]:[border:1px_solid_var(--border)] [&_button]:[border-radius:8px] [&_button]:[background:white] [&_strong]:[font:700_11px_var(--font-sans)] [&_strong]:[min-width:120px] [&_strong]:[text-align:center] [&_.today-button]:[width:auto] [&_.today-button]:[padding:0_9px] [&_.today-button]:[font-size:11px] [&_.today-button]:[font-size:11px] [&_.today-button]:[font-size:13px] [&_strong]:[font-size:13px]">
          <button onClick={() => view === "Day" ? setSelectedDay((value) => value - 1) : setWeekOffset((value) => value - (view === "Fortnight" ? 2 : 1))}>‹</button>
          <strong>{rosterRangeLabel(displayDays[0].day, displayDays[displayDays.length - 1].day)}</strong>
          <button onClick={() => view === "Day" ? setSelectedDay((value) => value + 1) : setWeekOffset((value) => value + (view === "Fortnight" ? 2 : 1))}>›</button>
          <button
            className="today-button"
            onClick={() => {
              setWeekOffset(0);
              setSelectedDay(0);
            }}
          >
            Today
          </button>
        </div>
        <div className="roster-health [flex:1] [display:flex] [justify-content:center] [align-items:center] [gap:13px] [color:#828291] [font-size:11px] [&_span]:[display:flex] [&_span]:[align-items:center] [&_span]:[gap:4px] [&_i]:[width:6px] [&_i]:[height:6px] [&_i]:[border-radius:50%] [&_i.green]:[background:#23aa7a] [&_i.amber]:[background:#e39842] [&_i.rose]:[background:#df6177] [&_strong]:[padding-left:12px] [&_strong]:[border-left:1px_solid_var(--border)] [&_strong]:[color:#25805f] max-[760px]:[order:3] max-[760px]:[flex-basis:100%] max-[760px]:[justify-content:flex-start] [font-size:11px] [font-size:13px]">
          <span>
            <i className="green" />
            {visiblePeriodShifts.filter((shift) => shift.status === "confirmed").length}{" "}
            confirmed
          </span>
          <span>
            <i className="amber" />
            {visiblePeriodShifts.filter((shift) => shift.status === "open").length} open
          </span>
          <span>
            <i className="rose" />
            {visiblePeriodShifts.filter((shift) => shift.status === "warning").length}{" "}
            warnings
          </span>
          <strong>Projected margin 27.4%</strong>
          <button
            type="button"
            title="Confirmed: worker assigned. Open: worker needed. Warning: scheduling or operational issue. Projected margin: estimated revenue remaining after direct labour costs."
            aria-label="Explain roster summary"
            onClick={() => setToast("Confirmed shifts have an eligible worker. Open shifts need assignment. Warnings require review before publishing.")}
            className="grid size-6 place-items-center rounded-full border border-line bg-white text-[#777786] hover:border-brand-300 hover:text-brand-700"
          >
            <Info size={13} />
          </button>
        </div>
        <div className="segmented [padding:3px] [border-radius:9px] [background:#ecf3fa] [display:flex] [&_button]:[border:0] [&_button]:[border-radius:7px] [&_button]:[padding:7px_10px] [&_button]:[background:transparent] [&_button]:[color:#8d8d9b] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_button.active]:[background:white] [&_button.active]:[color:#4682c6] [&_button.active]:[box-shadow:none] [&_button]:[font-size:11px] [&_button]:[font-size:14px]">
          {["Day", "Week", "Fortnight"].map((item) => (
            <button
              className={view === item ? "active" : ""}
              onClick={() => setView(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="roster-layout grid min-w-0 grid-cols-[minmax(0,1fr)_320px] gap-4 max-[1250px]:grid-cols-1">
        <div ref={rosterFullscreenRef} className={`relative min-w-0 ${isRosterFullscreen ? "fixed inset-0 z-100 h-screen w-screen bg-[#f6f9fc] p-4" : ""}`}>
        {isRosterFullscreen && (
          <div className="mb-3 flex shrink-0 items-center gap-4 rounded-xl border border-[#d8e5f4] bg-white px-4 py-3 pr-14 shadow-sm">
            <div className="flex items-center gap-2">
              <button className="grid size-8 place-items-center rounded-lg border border-line bg-white" onClick={() => view === "Day" ? setSelectedDay((value) => value - 1) : setWeekOffset((value) => value - (view === "Fortnight" ? 2 : 1))}>‹</button>
              <strong className="min-w-[155px] text-center text-[13px]">{rosterRangeLabel(displayDays[0].day, displayDays[displayDays.length - 1].day)}</strong>
              <button className="grid size-8 place-items-center rounded-lg border border-line bg-white" onClick={() => view === "Day" ? setSelectedDay((value) => value + 1) : setWeekOffset((value) => value + (view === "Fortnight" ? 2 : 1))}>›</button>
              <button className="rounded-lg border border-line bg-white px-3 py-2 text-[12px] font-semibold" onClick={() => { setWeekOffset(0); setSelectedDay(0); }}>Today</button>
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 text-[12px] text-[#777785]">
              <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#23aa7a]" />{visiblePeriodShifts.filter((shift) => shift.status === "confirmed").length} confirmed</span>
              <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#e39842]" />{visiblePeriodShifts.filter((shift) => shift.status === "open").length} open</span>
              <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#df6177]" />{visiblePeriodShifts.filter((shift) => shift.status === "warning").length} warnings</span>
              <strong className="border-l border-line pl-4 text-[#25805f]">Projected margin 27.4%</strong>
              <button type="button" title="Confirmed: worker assigned. Open: worker needed. Warning: scheduling or operational issue. Projected margin: estimated revenue remaining after direct labour costs." aria-label="Explain roster summary" className="grid size-6 place-items-center rounded-full border border-line bg-white text-[#777786] hover:text-brand-700"><Info size={13} /></button>
            </div>
            <div className="flex rounded-lg bg-[#ecf3fa] p-1">
              {["Day", "Week", "Fortnight"].map((item) => (
                <button
                  key={item}
                  onClick={() => setView(item)}
                  className={`rounded-md px-3 py-2 text-[12px] font-bold ${view === item ? "bg-white text-[#4682c6] shadow-sm" : "text-[#858593]"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          type="button"
          aria-label={isRosterFullscreen ? "Exit full-screen roster" : "Open full-screen roster"}
          title={isRosterFullscreen ? "Exit full screen (Esc)" : "View roster full screen"}
          onClick={() => void toggleRosterFullscreen()}
          className="absolute right-3 top-2 z-40 grid size-9 place-items-center rounded-lg border border-[#dde2e8] bg-white/85 text-[#5890cf] shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md"
        >
          {isRosterFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
        <article ref={rosterBoardRef} onScroll={syncHorizontalControls} className={`roster-board flex min-w-0 flex-col overflow-x-auto overflow-y-hidden rounded-[14px] border border-line bg-white [scrollbar-color:#a5b1bf_#dddfd7] [scrollbar-width:auto] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:border-[3px] [&::-webkit-scrollbar-thumb]:border-[#dddfd7] [&::-webkit-scrollbar-thumb]:bg-[#a5b1bf] [&::-webkit-scrollbar-track]:bg-[#dddfd7] roster-period-${view.toLowerCase()}`}>
          <div
            className="roster-days [display:grid] [height:50px] [border-bottom:1px_solid_var(--border)] [&>div]:[display:flex] [&>div]:[align-items:center] [&>div]:[justify-content:center] [&>div]:[gap:4px] [&>div]:[border-left:1px_solid_#dddfd7] [&_.time-heading]:[border-left:0] [&_.time-heading]:[color:#aaaab7] [&_.time-heading]:[font-size:11px] [&_strong]:[font-size:11px] [&_span]:[width:21px] [&_span]:[height:21px] [&_span]:[border-radius:7px] [&_span]:[display:grid] [&_span]:[place-items:center] [&_span]:[color:#777786] [&_span]:[font-size:11px] [&_.weekend]:[background:#fafcfe] [&_strong]:[font-size:12px] [&_span]:[font-size:12px] [&_.time-heading]:[font-size:11px] [flex:none] [position:relative] [z-index:4] [box-shadow:none] [min-width:max-content] [&>button]:[border:0] [&>button]:[border-left:1px_solid_#dddfd7] [&>button]:[background:white] [&>button]:[display:flex] [&>button]:[align-items:center] [&>button]:[justify-content:center] [&>button]:[gap:5px] [&>button]:[cursor:pointer] [&>button:hover]:[background:#f6faff] [&>button.weekend]:[background:#fafcfe] [&>button_strong]:[font-size:12px] [&>button_span]:[width:23px] [&>button_span]:[height:23px] [&>button_span]:[border-radius:7px] [&>button_span]:[display:grid] [&>button_span]:[place-items:center] [&>button_span]:[font-size:12px] [&_.time-heading]:[position:sticky] [&_.time-heading]:[left:0] [&_.time-heading]:[z-index:12] [&_.time-heading]:[background:#f7f7f4] [&_.time-heading]:[z-index:15]"
            style={{
              gridTemplateColumns: rosterGridColumns,
              minWidth: `${rosterCanvasMinWidth}px`,
              width: rosterCanvasWidth,
            }}
          >
            <div className="time-heading">AEST</div>
            {displayDays.map((item, index) => (
              <button
                onClick={() => {
                  setSelectedDay(item.day);
                  setView("Day");
                }}
                className={index % 7 === 5 || index % 7 === 6 ? "weekend" : ""}
                key={`${item.label}-${item.day}`}
              >
                <strong>{item.label.split(" ")[0]}</strong>
                <span>{item.label.split(" ")[1]}</span>
              </button>
            ))}
          </div>
          <div
            className={`roster-scroll shrink-0 overflow-y-auto overflow-x-visible [scrollbar-gutter:stable] ${isRosterFullscreen ? "h-[calc(100vh-150px)]" : "h-[min(72vh,760px)]"}`}
            ref={rosterScrollRef}
            style={{
              minWidth: `${rosterCanvasMinWidth}px`,
              width: rosterCanvasWidth,
            }}
          >
            <div
              className="roster-grid grid h-[1344px] min-h-[1344px] overflow-visible"
              style={{
                gridTemplateColumns: rosterGridColumns,
                minWidth: `${rosterCanvasMinWidth}px`,
                width: rosterCanvasWidth,
              }}
            >
              <div className="time-axis sticky left-0 z-12 grid h-[1344px] grid-rows-[repeat(24,56px)] bg-[#f7f7f4] text-center text-[11px] text-[#aaaab7] [&_span]:relative [&_span]:z-2 [&_span]:h-14 [&_span]:border-b [&_span]:border-[#e9f0f8] [&_span]:bg-[#f7f7f4] [&_span]:pt-1.5 [&_span]:tabular-nums">
                {Array.from({ length: 24 }, (_, hour) => (
                  <span key={hour}>{formatShiftTime(hour)}</span>
                ))}
              </div>
              {displayDays.map((item) => (
                <div
                  className={`day-column relative h-[1344px] cursor-crosshair border-l border-[#dddfd7] transition-[background] duration-150 [&>i]:block [&>i]:h-14 [&>i]:border-b [&>i]:border-[#eff4fa] ${dropPreview?.day === item.day ? "z-20" : "z-0"}`}
                  key={item.day}
                  onClick={(event) => {
                    if (
                      (event.target as HTMLElement).closest(
                        ".shift-card,.draft-shift-card",
                      )
                    )
                      return;
                    const start = snapDropTime(
                      event.clientY,
                      event.currentTarget,
                      "new",
                    );
                    openCreate({ day: item.day, start });
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    const id =
                      event.dataTransfer.getData("shift-id") || draggingId;
                    const start = snapDropTime(
                      event.clientY,
                      event.currentTarget,
                      id,
                    );
                    const conflict = conflictFor(id, item.day, start);
                    setDropPreview((current) =>
                      current?.day === item.day &&
                      current.start === start &&
                      current.conflict === conflict
                        ? current
                        : { day: item.day, start, conflict },
                    );
                  }}
                  onDragLeave={(event) => {
                    if (
                      !event.currentTarget.contains(event.relatedTarget as Node)
                    )
                      setDropPreview(null);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    const id =
                      event.dataTransfer.getData("shift-id") || draggingId;
                    const start = snapDropTime(
                      event.clientY,
                      event.currentTarget,
                      id,
                    );
                    moveShift(id, item.day, start);
                  }}
                >
                  {Array.from({ length: 24 }, (_, hour) => (
                    <i key={hour} />
                  ))}
                  {dropPreview?.day === item.day && (
                    <div
                      className="drop-time-indicator pointer-events-none absolute left-0 right-0 z-50 h-0.5 shadow-[0_0_0_1px_rgba(102,89,232,.08)] [&_span]:absolute [&_span]:bottom-1.5 [&_span]:left-2 [&_span]:z-50 [&_span]:max-w-[260px] [&_span]:overflow-hidden [&_span]:text-ellipsis [&_span]:whitespace-nowrap [&_span]:rounded-lg [&_span]:px-2 [&_span]:py-1.5 [&_span]:text-xs [&_span]:font-extrabold [&_span]:text-white [&_span]:shadow-[0_5px_14px_rgba(79,68,203,.25)] [&_span]:tabular-nums"
                      style={{ top: `${dropPreview.start * 56}px`, backgroundColor: dropPreview.conflict ? "#dc4f67" : dropColours.line }}
                    >
                      <span style={{ backgroundColor: dropPreview.conflict ? "#b83f55" : dropColours.label }}>
                        {dropPreview.conflict
                          ? `Clash · ${dropPreview.conflict}`
                          : `${item.label.split(" ")[0]} ${formatShiftTime(dropPreview.start)}`}
                      </span>
                    </div>
                  )}
                  {draftSlot?.day === item.day && (
                    <button
                      type="button"
                      className="draft-shift-card [position:absolute] [left:5px] [right:5px] [z-index:9] [min-height:54px] [padding:8px] [border:2px_dashed_#69a5e9] [border-radius:9px] [color:#4681c5] [background:#f0f7ff] [display:flex] [align-items:center] [gap:8px] [text-align:left] [box-shadow:none] [cursor:pointer] [&>svg]:[width:22px] [&>svg]:[height:22px] [&>svg]:[padding:4px] [&>svg]:[border-radius:6px] [&>svg]:[color:white] [&>svg]:[background:#599ce8] [&>svg]:[flex:none] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:12px] [&_small]:[margin-top:3px] [&_small]:[color:#77718e] [&_small]:[font-size:11px]"
                      style={{ top: `${draftSlot.start * 56 + 2}px` }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setCreateOpen(true);
                      }}
                    >
                      <Plus />
                      <span>
                        <strong>
                          New shift · {formatShiftTime(draftSlot.start)}
                        </strong>
                        <small>Click to edit shift details</small>
                      </span>
                    </button>
                  )}
                  {shifts
                    .filter((shift) => shift.day === item.day)
                    .map((shift) => {
                      const lane = shiftLanes.get(shift.id) ?? { lane: 0, laneCount: 1 };
                      const cardColour = shift.status === "warning"
                        ? shiftColourClasses.rose
                        : shift.status === "open"
                          ? shiftColourClasses.amber
                          : shiftColourClasses[shift.colour] ?? shiftColourClasses.violet;
                      return (
                      <button
                        type="button"
                        draggable
                        key={shift.id}
                        title="Click to edit shift"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEdit(shift.id);
                        }}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("shift-id", shift.id);
                          event.dataTransfer.effectAllowed = "move";
                          const preview = document.createElement("div");
                          preview.textContent = `${shift.worker} · ${formatShiftTime(shift.start)}`;
                          Object.assign(preview.style, {
                            position: "fixed",
                            left: "-1000px",
                            top: "-1000px",
                            padding: "7px 10px",
                            borderRadius: "8px",
                            background: "rgba(79, 68, 203, 0.82)",
                            color: "white",
                            font: "700 11px Manrope, sans-serif",
                            boxShadow: "0 6px 18px rgba(45, 40, 85, 0.2)",
                          });
                          document.body.appendChild(preview);
                          event.dataTransfer.setDragImage(preview, 12, 12);
                          window.setTimeout(() => preview.remove(), 0);
                          setDraggingId(shift.id);
                        }}
                        onDragEnd={() => {
                          setDraggingId("");
                          setDropPreview(null);
                        }}
                        className={`shift-card [&[draggable=true]]:[cursor:grab] [position:absolute] [border:0] [border-left:3px_solid] [border-radius:7px] [padding:6px] [text-align:left] [overflow:hidden] [cursor:pointer] [&_strong]:[display:block] [&_strong]:[white-space:nowrap] [&_strong]:[overflow:hidden] [&_strong]:[text-overflow:ellipsis] [&_small]:[display:block] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_b]:mr-1 [&_b]:font-extrabold [&_b]:uppercase [&_b]:tracking-wide [&_b]:opacity-70 [&_span]:[display:block] [&_span]:[white-space:nowrap] [&_span]:[overflow:hidden] [&_span]:[text-overflow:ellipsis] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[font-size:11px] [&_span]:[margin-top:5px] [&_span]:[opacity:.7] [&_span]:[font-size:11px] [&_svg]:[position:absolute] [&_svg]:[right:5px] [&_svg]:[top:5px] [&.open]:[border-style:dashed] [&.open]:[box-shadow:inset_0_0_0_1px_#e5a557] [&.warning]:[box-shadow:inset_0_0_0_1px_#df657a] [&[draggable=true]:active]:[cursor:grabbing] [&_strong]:[font-size:11px] [&_small]:[font-size:11px] [&_span]:[font-size:11px] [&_strong]:[font-size:12px] [&_small]:[font-size:11px] [&_span]:[font-size:11px] [&.is-dragging]:[opacity:.45] [z-index:3] [cursor:grab] [&:active]:[cursor:grabbing] [&:hover::after]:[opacity:1] ${cardColour} ${shift.status} ${draggingId === shift.id ? "is-dragging" : ""}`}
                        style={{
                          top: `${shift.start * 56 + 2}px`,
                          height: `${Math.max(52, shift.duration * 56 - 4)}px`,
                          left: `calc(${(lane.lane * 100) / lane.laneCount}% + 4px)`,
                          width: `calc(${100 / lane.laneCount}% - 8px)`,
                        }}
                      >
                        <strong>
                          {formatShiftTime(shift.start)}–
                          {formatShiftTime(shift.start + shift.duration)}
                        </strong>
                        <small><b>Client</b>{shift.participant}</small>
                        <small><b>SW</b>{shift.worker}</small>
                        <span>{shift.service}</span>
                        {shift.status === "warning" && (
                          <AlertTriangle size={12} />
                        )}
                      </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </article>
        {view === "Fortnight" && horizontalScroll.left && (
          <button
            type="button"
            aria-label="Scroll roster left"
            onClick={() => rosterBoardRef.current?.scrollBy({ left: -rosterBoardRef.current.clientWidth * 0.9, behavior: "smooth" })}
            className="absolute left-3 top-1/2 z-30 grid size-10 -translate-y-1/2 animate-[pulse_2s_ease-in-out_infinite] place-items-center rounded-full border border-white/60 bg-white/70 text-[#5890cf] shadow-[0_6px_20px_rgba(45,40,85,0.16)] backdrop-blur-sm transition hover:scale-105 hover:bg-white/90"
          >
            <ChevronRight className="rotate-180" size={20} />
          </button>
        )}
        {view === "Fortnight" && horizontalScroll.right && (
          <button
            type="button"
            aria-label="Scroll roster right"
            onClick={() => rosterBoardRef.current?.scrollBy({ left: rosterBoardRef.current.clientWidth * 0.9, behavior: "smooth" })}
            className="absolute right-3 top-1/2 z-30 grid size-10 -translate-y-1/2 animate-[pulse_2s_ease-in-out_infinite] place-items-center rounded-full border border-white/60 bg-white/70 text-[#5890cf] shadow-[0_6px_20px_rgba(45,40,85,0.16)] backdrop-blur-sm transition hover:scale-105 hover:bg-white/90"
          >
            <ChevronRight size={20} />
          </button>
        )}
        </div>
        <aside className="roster-insight [border:1px_solid_var(--border)] [border-radius:14px] [background:white] [overflow:hidden] [padding:17px] max-[1250px]:[display:grid] max-[1250px]:[grid-template-columns:repeat(3,1fr)] max-[1250px]:[gap:12px] max-[1250px]:[&_.insight-heading]:[grid-column:1/-1]">
          <div className="insight-heading [display:flex] [align-items:center] [gap:8px] [&>span]:[width:31px] [&>span]:[height:31px] [&>span]:[border-radius:9px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span]:[background:#f0f5fa] [&>span]:[color:#386590] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font:700_10.5px_var(--font-sans)] [&_small]:[margin-top:3px] [&_small]:[color:#72756d] [&_small]:[font-size:11px] [&_strong]:[font-size:14px] [&_small]:[font-size:12px]">
            <span>
              <Sparkles size={17} />
            </span>
            <div>
              <strong>Roster intelligence</strong>
              <small>Coverage and margin guard</small>
            </div>
          </div>
          <div className="health-score my-4 overflow-hidden rounded-xl border border-[#dce8f5] bg-white max-[1250px]:m-0">
            <div className="flex items-center justify-between border-b border-[#e5eef8] px-4 py-3.5">
              <div className="flex items-center gap-3" aria-label="Roster health score: 92 out of 100">
                <div className="relative grid size-16 place-items-center rounded-full bg-[conic-gradient(#2ca77c_0_92%,#e3e5ec_92%_100%)] shadow-[0_5px_16px_rgba(44,167,124,.15)] before:absolute before:inset-1.5 before:rounded-full before:bg-white">
                  <strong className="relative z-10 font-display text-[22px] leading-none font-bold tracking-[-.05em] text-[#242c38]">92</strong>
                </div>
                <span className="text-[11px] font-semibold text-[#72756d]">Health score</span>
              </div>
              <span className="rounded-md bg-[#e5f6ef] px-2 py-1 text-[11px] font-bold text-[#23785c]">Strong</span>
            </div>
            <div className="px-4 py-4">
              <strong className="block text-[14px] leading-snug text-[#2c333e]">Roster health is on track</strong>
              <p className="mt-1.5 text-[11px] leading-[1.55] text-[#797987]">
                Coverage, worker matching and shift continuity are performing well.
              </p>
              <button onClick={() => setToast("Roster health: 94% coverage, no double bookings, one overtime warning and three recommended matches.")} className="mt-3 inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[11px] font-medium text-[#1d4ed8] hover:text-[#1e40af]">View health details <ArrowRight className="size-3" /></button>
            </div>
          </div>
          <div className="roster-action [padding:11px_0] [display:grid] [grid-template-columns:30px_1fr] [gap:8px] [border-bottom:1px_solid_#dddfd7] [&>span]:[width:30px] [&>span]:[height:30px] [&>span]:[border-radius:8px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span.amber]:[background:#fff1df] [&>span.amber]:[color:#a96829] [&>span.rose]:[background:#ffe9ed] [&>span.rose]:[color:#b54d61] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#9999a6] [&_small]:[font-size:11px] [&_button]:[margin-top:6px] [&_button]:[border:0] [&_button]:[padding:0] [&_button]:[background:transparent] [&_button]:[color:#4f88ca] [&_button]:[display:flex] [&_button]:[gap:4px] [&_button]:[align-items:center] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_strong]:[font-size:14px] [&_small]:[font-size:12px] [&_button]:[font-size:12px]">
            <span className="amber">
              <UsersRound size={16} />
            </span>
            <div>
              <strong>Fill Tuesday open shift</strong>
              <small>Lucas Brown · 3 recommended workers</small>
              <button onClick={() => setCreateOpen(true)}>
                Review matches <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <div className="roster-action [padding:11px_0] [display:grid] [grid-template-columns:30px_1fr] [gap:8px] [border-bottom:1px_solid_#dddfd7] [&>span]:[width:30px] [&>span]:[height:30px] [&>span]:[border-radius:8px] [&>span]:[display:grid] [&>span]:[place-items:center] [&>span.amber]:[background:#fff1df] [&>span.amber]:[color:#a96829] [&>span.rose]:[background:#ffe9ed] [&>span.rose]:[color:#b54d61] [&_strong]:[display:block] [&_small]:[display:block] [&_strong]:[font-size:11px] [&_small]:[margin-top:3px] [&_small]:[color:#9999a6] [&_small]:[font-size:11px] [&_button]:[margin-top:6px] [&_button]:[border:0] [&_button]:[padding:0] [&_button]:[background:transparent] [&_button]:[color:#4f88ca] [&_button]:[display:flex] [&_button]:[gap:4px] [&_button]:[align-items:center] [&_button]:[font-size:11px] [&_button]:[font-weight:700] [&_strong]:[font-size:14px] [&_small]:[font-size:12px] [&_button]:[font-size:12px]">
            <span className="rose">
              <TriangleAlert size={16} />
            </span>
            <div>
              <strong>Potential overtime</strong>
              <small>Liam reaches 38 hours on Sunday.</small>
              <button
                onClick={() => {
                  setSelectedDay(6);
                  setView("Day");
                }}
              >
                Review shift <ArrowRight size={13} />
              </button>
            </div>
          </div>
          <div className="margin-preview [margin-top:16px] [padding:12px] [border-radius:10px] [background:#f6f9fd] [&>div]:[display:flex] [&>div]:[justify-content:space-between] [&>div]:[padding:5px_0] [&>div]:[color:#888897] [&>div]:[font-size:11px] [&_strong]:[color:#3c434d] [&_.total]:[margin-top:5px] [&_.total]:[padding-top:9px] [&_.total]:[border-top:1px_solid_#dbe7f4] [&_.total_strong]:[color:#25805f] [&_.total_strong]:[font-size:11px] max-[1250px]:[margin:0] [&>div]:[font-size:12px]">
            <div>
              <span>Expected revenue</span>
              <strong>$48,240</strong>
            </div>
            <div>
              <span>Direct labour</span>
              <strong>$31,080</strong>
            </div>
            <div className="total">
              <span>Gross margin</span>
              <strong>35.6%</strong>
            </div>
          </div>
        </aside>
      </div>
      {toast && (
        <div className="action-toast [position:fixed] [right:28px] [bottom:28px] [z-index:110] [padding:13px_16px] [border-radius:10px] [background:#212a37] [color:white] [display:flex] [align-items:center] [gap:9px] [font-size:11px] [box-shadow:0_15px_45px_rgba(25,22,40,.25)] [&_svg]:[width:17px] [&_svg]:[color:#68d1a9] [&.error]:[background:#9f3045] [&.error_svg]:[color:#ffd7de]">
          <CheckCircle2 />
          {toast}
        </div>
      )}
      {errorToast && (
        <div className="action-toast [position:fixed] [right:28px] [bottom:28px] [z-index:110] [padding:13px_16px] [border-radius:10px] [background:#212a37] [color:white] [display:flex] [align-items:center] [gap:9px] [font-size:11px] [box-shadow:0_15px_45px_rgba(25,22,40,.25)] [&_svg]:[width:17px] [&_svg]:[color:#68d1a9] [&.error]:[background:#9f3045] [&.error_svg]:[color:#ffd7de] error">
          <AlertTriangle />
          {errorToast}
        </div>
      )}
      {createOpen && (() => {
        const editor = (
          <ShiftEditor
            shift={editingShift}
            slot={draftSlot}
            selectedDay={view === "Day" ? selectedDay : periodStartDay}
            onSubmit={saveShift}
            onClose={() => {
              setCreateOpen(false);
              setDraftSlot(null);
              setEditingShiftId(null);
            }}
          />
        );
        return isRosterFullscreen && rosterFullscreenRef.current
          ? createPortal(editor, rosterFullscreenRef.current)
          : editor;
      })()}
    </section>
  );
}
