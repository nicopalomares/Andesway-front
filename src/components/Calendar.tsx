import React, {useState} from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isWithinInterval,
  parseISO,
} from "date-fns";
import {es} from "date-fns/locale";
import {ChevronLeft, ChevronRight} from "lucide-react";

interface Unavailability {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

interface CalendarProps {
  carId: string;
  unavailabilities: Unavailability[];
  onSelectRange: (start: Date, end: Date) => void;
  onDeleteRange?: (id: string) => void;
  isAdmin?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  carId,
  unavailabilities = [],
  onSelectRange,
  onDeleteRange,
  isAdmin = false,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState<Date | null>(null);
  const [selectingEnd, setSelectingEnd] = useState<Date | null>(null);
  const [confirmedStart, setConfirmedStart] = useState<Date | null>(null);
  const [confirmedEnd, setConfirmedEnd] = useState<Date | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Unavailability | null>(
    null,
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-brand-navy capitalize">
        {format(currentMonth, "MMMM yyyy", {locale: es})}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Dom", "Lun", "Mar", "Mi\u00e9", "Jue", "Vie", "S\u00e1b"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days: React.ReactNode[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        const isOutsideMonth = !isSameMonth(day, monthStart);

        const savedRange = unavailabilities.find((u) =>
          isWithinInterval(cloneDay, {
            start: parseISO(u.start_date),
            end: parseISO(u.end_date),
          }),
        );

        const isPendingDeleteDay =
          pendingDelete &&
          isWithinInterval(cloneDay, {
            start: parseISO(pendingDelete.start_date),
            end: parseISO(pendingDelete.end_date),
          });

        const isSelectingThisDay =
          selectingStart && isSameDay(cloneDay, selectingStart);

        const pendingStart =
          selectingStart && selectingEnd
            ? selectingStart < selectingEnd
              ? selectingStart
              : selectingEnd
            : (confirmedStart ?? null);
        const pendingEnd =
          selectingStart && selectingEnd
            ? selectingStart < selectingEnd
              ? selectingEnd
              : selectingStart
            : (confirmedEnd ?? null);

        const isInPendingRange =
          pendingStart &&
          pendingEnd &&
          isWithinInterval(cloneDay, {start: pendingStart, end: pendingEnd});

        const isPendingStart =
          pendingStart && isSameDay(cloneDay, pendingStart);
        const isPendingEnd = pendingEnd && isSameDay(cloneDay, pendingEnd);

        let cellClass =
          "relative h-12 flex items-center justify-center transition-all border border-transparent ";

        if (isOutsideMonth) {
          cellClass += "text-gray-300 pointer-events-none";
        } else if (isPendingDeleteDay) {
          cellClass += "bg-red-300 text-red-800 font-bold cursor-pointer";
        } else if (savedRange) {
          cellClass +=
            "bg-red-100 text-red-600 font-bold hover:bg-red-200 cursor-pointer";
        } else if (isPendingStart || isPendingEnd) {
          cellClass +=
            "bg-brand-orange text-white font-bold rounded-lg cursor-pointer";
        } else if (isInPendingRange) {
          cellClass +=
            "bg-brand-orange/20 text-brand-orange font-semibold cursor-pointer";
        } else if (isSelectingThisDay) {
          cellClass +=
            "bg-brand-orange text-white font-bold animate-pulse rounded-lg cursor-pointer";
        } else {
          cellClass += "text-gray-700 hover:bg-brand-orange/10 cursor-pointer";
        }

        days.push(
          <div
            key={day.toString()}
            className={cellClass}
            onClick={() => onDateClick(cloneDay)}
            title={savedRange?.reason || ""}>
            <span className="relative z-10">{formattedDate}</span>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className="grid grid-cols-7"
          key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return (
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {rows}
      </div>
    );
  };

  const onDateClick = (day: Date) => {
    // If clicking a saved range, delete it
    const matched = unavailabilities.find((u) =>
      isWithinInterval(day, {
        start: parseISO(u.start_date),
        end: parseISO(u.end_date),
      }),
    );
    if (matched) {
      if (isAdmin) setPendingDelete(matched);
      return;
    }

    // First click of new range
    if (!selectingStart) {
      setSelectingStart(day);
      setSelectingEnd(null);
      setConfirmedStart(null);
      setConfirmedEnd(null);
      return;
    }

    // Second click
    if (!selectingEnd) {
      if (!isAdmin) {
        // Non-admin: confirm immediately without buttons
        const start = selectingStart < day ? selectingStart : day;
        const end = selectingStart < day ? day : selectingStart;
        setSelectingStart(null);
        setConfirmedStart(start);
        setConfirmedEnd(end);
        onSelectRange(start, end);
      } else {
        setSelectingEnd(day);
      }
      return;
    }

    // Clicking again resets
    setSelectingStart(day);
    setSelectingEnd(null);
  };

  const handleConfirm = () => {
    if (!selectingStart || !selectingEnd) return;
    const start = selectingStart < selectingEnd ? selectingStart : selectingEnd;
    const end = selectingStart < selectingEnd ? selectingEnd : selectingStart;
    setSelectingStart(null);
    setSelectingEnd(null);
    onSelectRange(start, end);
  };

  const handleCancel = () => {
    setSelectingStart(null);
    setSelectingEnd(null);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {pendingDelete && (
        <div className="mt-4 flex items-center justify-between gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
          <span className="text-sm text-red-700 font-medium">
            Eliminar {format(parseISO(pendingDelete.start_date), "dd/MM/yyyy")}
            {" → "}
            {format(parseISO(pendingDelete.end_date), "dd/MM/yyyy")}?
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteRange?.(pendingDelete.id);
                setPendingDelete(null);
              }}
              className="px-4 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Eliminar
            </button>
          </div>
        </div>
      )}

      {isAdmin && selectingStart && selectingEnd && (
        <div className="mt-4 flex items-center justify-between gap-3 p-3 bg-brand-orange/10 rounded-xl border border-brand-orange/20">
          <span className="text-sm text-brand-navy font-medium">
            {format(
              selectingStart < selectingEnd ? selectingStart : selectingEnd,
              "dd/MM/yyyy",
            )}
            {" → "}
            {format(
              selectingStart < selectingEnd ? selectingEnd : selectingStart,
              "dd/MM/yyyy",
            )}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-1.5 text-sm font-semibold bg-brand-orange text-white rounded-lg hover:bg-brand-orange/90 transition-colors">
              Confirmar
            </button>
          </div>
        </div>
      )}

      {selectingStart && !selectingEnd && (
        <p className="mt-3 text-xs text-gray-400 text-center">
          Seleccioná la fecha de fin
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-500">
            No disponible (click para eliminar)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-brand-orange rounded"></div>
          <span className="text-gray-500">Primera fecha seleccionada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-gray-200 rounded"></div>
          <span className="text-gray-500">Disponible</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
