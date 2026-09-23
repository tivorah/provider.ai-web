import { CalendarRange, Check, Clock3, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { participants, people, rosterShifts } from "../../../mocks/mockDomain";
import { formatShiftTime } from "../../../utils/formatters";

const rosterStartDate = new Date(2026, 7, 3);
const shiftDate = (day: number) => {
  const date = new Date(rosterStartDate);
  date.setDate(date.getDate() + day);
  return date;
};
const shiftDateLabel = (day: number) =>
  shiftDate(day).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const shiftDateInputValue = (day: number) => {
  const date = shiftDate(day);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateOfMonth = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${dateOfMonth}`;
};

const compactDateLabel = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export function ShiftEditor({
  shift,
  slot,
  selectedDay,
  onSubmit,
  onClose,
}: {
  shift?: (typeof rosterShifts)[number] & { breakMinutes?: number };
  slot: { day: number; start: number } | null;
  selectedDay: number;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  const [recurring, setRecurring] = useState(false);
  const start = shift?.start ?? slot?.start ?? 9;
  const end = Math.min(24, start + (shift?.duration ?? 3));
  const initialDate = shiftDateInputValue(shift?.day ?? slot?.day ?? selectedDay);
  const [anchorDate, setAnchorDate] = useState(initialDate);
  const [selectedDates, setSelectedDates] = useState<string[]>([initialDate]);
  return (
    <div
      className="modal-backdrop [position:fixed] [inset:0] [z-index:50] [padding:24px] [display:grid] [place-items:center] [background:rgba(28,26,43,.48)] [backdrop-filter:blur(5px)]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="modal-card [width:min(100%,560px)] [max-height:calc(100vh_-_48px)] [overflow:auto] [position:relative] [padding:27px] [border-radius:17px] [background:white] [box-shadow:0_24px_70px_rgba(24,22,39,.24)] [&_h2]:[margin:0] [&_h2]:[font:700_20px_var(--font-sans)] [&_>_p]:[margin:6px_0_23px] [&_>_p]:[color:#8d8d9c] [&_>_p]:[font-size:11px] roster-shift-modal [width:min(620px,calc(100%_-_30px))] [&_input[type=time]]:[font-variant-numeric:tabular-nums]">
        <button className="modal-close [position:absolute] [right:18px] [top:18px] [width:34px] [height:34px] [display:grid] [place-items:center] [border:1px_solid_var(--border)] [border-radius:9px] [background:white] [cursor:pointer]" onClick={onClose}>
          <X />
        </button>
        <h2>
          {shift
            ? "Edit shift"
            : slot
              ? `New shift · ${shiftDateLabel(slot.day)} at ${formatShiftTime(slot.start)}`
              : "Create shift"}
        </h2>
        <p>
          Set the exact working window and unpaid break. Provider.ai calculates
          elapsed and payable hours automatically.
        </p>
        <form className="modal-form [display:grid] [gap:15px] [&_label]:[display:grid] [&_label]:[gap:7px] [&_label]:[color:#555567] [&_label]:[font-size:11px] [&_label]:[font-weight:700] [&_input]:[width:100%] [&_input]:[border:1px_solid_#dddfd7] [&_input]:[border-radius:10px] [&_input]:[padding:11px_12px] [&_input]:[background:white] [&_input]:[color:var(--ink)] [&_input]:[outline:0] [&_input]:[font-size:12px] [&_input]:[font-weight:400] [&_input]:[transition:border_.15s,box-shadow_.15s] [&_select]:[width:100%] [&_select]:[border:1px_solid_#dddfd7] [&_select]:[border-radius:10px] [&_select]:[padding:11px_12px] [&_select]:[background:white] [&_select]:[color:var(--ink)] [&_select]:[outline:0] [&_select]:[font-size:12px] [&_select]:[font-weight:400] [&_select]:[transition:border_.15s,box-shadow_.15s] [&_textarea]:[width:100%] [&_textarea]:[border:1px_solid_#dddfd7] [&_textarea]:[border-radius:10px] [&_textarea]:[padding:11px_12px] [&_textarea]:[background:white] [&_textarea]:[color:var(--ink)] [&_textarea]:[outline:0] [&_textarea]:[font-size:12px] [&_textarea]:[font-weight:400] [&_textarea]:[transition:border_.15s,box-shadow_.15s] [&_input:focus]:[border-color:#70a9eb] [&_input:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_select:focus]:[border-color:#70a9eb] [&_select:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea:focus]:[border-color:#70a9eb] [&_textarea:focus]:[box-shadow:0_0_0_3px_rgba(98,86,232,.1)] [&_textarea]:[resize:vertical] [&_textarea]:[font-family:inherit]" onSubmit={onSubmit}>
          <label>
            Participant
            <select
              name="participant"
              defaultValue={shift?.participant ?? "Ethan Carter"}
            >
              {participants.map((person) => (
                <option key={person.id}>{person.name}</option>
              ))}
            </select>
          </label>
          <label>
            Worker
            <select name="worker" defaultValue={shift?.worker ?? "Open shift"}>
              <option>Open shift</option>
              {people
                .filter((person) => person.status !== "Onboarding")
                .map((person) => (
                  <option key={person.id}>{person.name}</option>
                ))}
            </select>
          </label>
          <div className="form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:12px]">
            <label>
              {shift ? "Date" : selectedDates.length > 1 ? "Add another date" : "Shift date"}
              <input
                name="date"
                type="date"
                value={anchorDate}
                onChange={(event) => {
                  setAnchorDate(event.target.value);
                  setSelectedDates((current) =>
                    current.includes(event.target.value)
                      ? current
                      : [...current, event.target.value].sort(),
                  );
                }}
                min={shiftDateInputValue(-91)}
                max={shiftDateInputValue(365)}
                required
              />
            </label>
            <label>
              Service
              <select
                name="service"
                defaultValue={shift?.service ?? "Daily activities"}
              >
                <option>Daily activities</option>
                <option>Community access</option>
                <option>Personal activities</option>
                <option>Capacity building</option>
                <option>Weekend support</option>
              </select>
            </label>
          </div>
          {!shift && (
            <div className="flex flex-wrap items-center gap-1.5" aria-label="Selected shift dates">
              {selectedDates.map((date) => (
                <span key={date} className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 py-1.5 pl-2.5 pr-1.5 text-[11px] font-semibold text-brand-800">
                  <input type="hidden" name="selectedDates" value={date} />
                  {compactDateLabel(date)}
                  {selectedDates.length > 1 && (
                    <button
                      type="button"
                      className="grid size-5 place-items-center rounded text-brand-600 hover:bg-brand-100"
                      aria-label={`Remove ${compactDateLabel(date)}`}
                      onClick={() => setSelectedDates((current) => current.filter((value) => value !== date))}
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              <span className="text-[11px] text-[#858291]">
                {selectedDates.length === 1 ? "Choose another date above to add it" : `${selectedDates.length} dates selected`}
              </span>
            </div>
          )}
          <div className="form-row [display:grid] [grid-template-columns:1fr_1fr] [gap:12px] three-fields [grid-template-columns:repeat(3,1fr)] max-[600px]:[grid-template-columns:1fr]">
            <label>
              Start time
              <input
                name="startTime"
                type="time"
                step="900"
                defaultValue={formatShiftTime(start)}
                required
              />
            </label>
            <label>
              End time
              <input
                name="endTime"
                type="time"
                step="900"
                defaultValue={formatShiftTime(end)}
                required
              />
            </label>
            <label>
              Unpaid break
              <select
                name="breakMinutes"
                defaultValue={shift?.breakMinutes ?? 0}
              >
                <option value="0">No break</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </label>
          </div>
          <div className="shift-time-help [padding:11px] [border-radius:9px] [color:#4681c5] [background:#eff6ff] [display:flex] [align-items:flex-start] [gap:8px] [font-size:12px] [line-height:1.5] [&_svg]:[width:17px] [&_svg]:[flex:none]">
            <Clock3 />
            <span>
              Times use 15-minute increments. Breaks reduce payable hours but do
              not change the shift coverage window.
            </span>
          </div>
          {!shift && (
            <div className="overflow-hidden rounded-xl border border-[#e1e5ea] bg-white">
              <button type="button" title="Repeat every selected weekday for the chosen duration" onClick={() => setRecurring((value) => !value)} className="flex w-full items-center gap-3 border-0 bg-white px-3.5 py-3 text-left hover:bg-[#f7f7f4]" aria-expanded={recurring}>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700"><CalendarRange size={17} /></span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-[12px] text-[#323b47]">Repeat weekly</strong>
                  <small className="mt-0.5 block text-[11px] text-[#858291]">Repeat every selected day each week.</small>
                </span>
                <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${recurring ? "bg-brand-600" : "bg-[#d7d7df]"}`}><i className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${recurring ? "translate-x-[18px]" : "translate-x-0.5"}`} /></span>
              </button>
              {recurring && <label className="grid gap-1.5 border-t border-[#e5edf7] bg-[#f7f7f4] px-3.5 py-3 text-[11px] font-bold text-[#555567]">
                Repeat for
                <select name="recurrenceMonths" defaultValue="1" className="w-full rounded-lg border border-[#d9e3ee] bg-white px-3 py-2.5 text-[12px] font-normal text-ink outline-none focus:border-[#70a9eb] focus:ring-3 focus:ring-[#569ae8]/10">
                  <option value="1">Weekly for 1 month</option>
                  <option value="2">Weekly for 2 months</option>
                  <option value="3">Weekly for 3 months</option>
                  <option value="6">Weekly for 6 months</option>
                </select>
                <small className="font-normal leading-relaxed text-[#858291]">All occurrences are checked for participant and worker conflicts before they are created.</small>
              </label>}
            </div>
          )}
          <div className="modal-actions [display:flex] [justify-content:flex-end] [gap:9px] [padding-top:5px]">
            <button
              type="button"
              className="secondary-button [display:flex] [align-items:center] [gap:7px] max-[570px]:[padding-inline:8px] "
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="primary-button [display:flex] [align-items:center] [gap:8px] [&:disabled]:[opacity:.65] [&:disabled]:[cursor:wait] ">
              {shift ? "Save shift changes" : "Check and create shift"}
              <Check />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
