import React, { useState, useEffect } from 'react';
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
  eachDayOfInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

interface Unavailability {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
}

interface CalendarProps {
  carId: string;
  unavailabilities: Unavailability[];
  onSelectRange?: (start: Date, end: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ carId, unavailabilities, onSelectRange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-brand-navy capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
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
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Check if day is unavailable
        const unavailability = unavailabilities.find(u => 
          isWithinInterval(cloneDay, {
            start: parseISO(u.start_date),
            end: parseISO(u.end_date)
          })
        );

        const isSelected = selectedRange.start && isSameDay(day, selectedRange.start) || 
                          (selectedRange.start && selectedRange.end && isWithinInterval(day, { start: selectedRange.start, end: selectedRange.end }));

        days.push(
          <div
            key={day.toString()}
            className={`relative h-12 flex items-center justify-center cursor-pointer transition-all border border-transparent
              ${!isSameMonth(day, monthStart) ? 'text-gray-300' : 'text-gray-700'}
              ${unavailability ? 'bg-red-50 text-red-600 font-bold' : 'hover:bg-brand-orange/10'}
              ${isSelected ? 'bg-brand-orange text-white font-bold rounded-lg' : ''}
            `}
            onClick={() => onDateClick(cloneDay)}
            title={unavailability?.reason || ''}
          >
            <span className="relative z-10">{formattedDate}</span>
            {unavailability && (
              <div className="absolute bottom-1 w-1 h-1 bg-red-400 rounded-full"></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border border-gray-100 rounded-xl overflow-hidden">{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    if (!onSelectRange) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: day, end: null });
    } else {
      const start = selectedRange.start < day ? selectedRange.start : day;
      const end = selectedRange.start < day ? day : selectedRange.start;
      setSelectedRange({ start, end });
      onSelectRange(start, end);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-500">No disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-brand-orange rounded"></div>
          <span className="text-gray-500">Seleccionado</span>
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
