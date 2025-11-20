import React, { useRef, useEffect } from 'react';
import { DateSelection } from '../types';
import { WEEKDAYS_KR } from '../constants';

interface DateSelectorProps {
  selection: DateSelection;
  onDateChange: (newSelection: DateSelection) => void;
  activeDays: Set<number>;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selection, onDateChange, activeDays }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { year, month, day } = selection;

  // Helper to get days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Handlers for Month Navigation
  const handlePrevMonth = () => {
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }
    onDateChange({ year: newYear, month: newMonth, day: 1 });
  };

  const handleNextMonth = () => {
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    onDateChange({ year: newYear, month: newMonth, day: 1 });
  };

  const handleSelectDay = (d: number) => {
    onDateChange({ ...selection, day: d });
  };

  // Auto scroll selected day into view
  useEffect(() => {
    if (scrollContainerRef.current) {
        const selectedEl = scrollContainerRef.current.querySelector(`[data-day="${day}"]`);
        if (selectedEl) {
            selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
  }, [day, month]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Year/Month Navigator - Compact */}
      <div className="flex items-center justify-center space-x-6 mb-3">
        <button 
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-all"
            aria-label="Previous Month"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
        
        <h2 className="text-lg font-bold font-[Noto Sans KR] text-slate-700">
            {year}년 {month + 1}월
        </h2>

        <button 
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-all"
            aria-label="Next Month"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
      </div>

      {/* Day Strip - Compact Height */}
      <div className="relative w-full border-t border-b border-slate-100/80 bg-transparent py-3">
        <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-2 px-4 sm:px-8 scrollbar-hide snap-x snap-mandatory"
        >
            {dateList.map((d) => {
                // Calculate weekday
                const dateObj = new Date(year, month, d);
                const weekDayIndex = dateObj.getDay(); // 0 = Sun
                const isWeekend = weekDayIndex === 0 || weekDayIndex === 6;
                const isSunday = weekDayIndex === 0;
                const isSaturday = weekDayIndex === 6;
                const isSelected = d === day;
                const hasEvent = activeDays.has(d);

                return (
                    <button
                        key={d}
                        data-day={d}
                        onClick={() => handleSelectDay(d)}
                        className={`
                            flex-shrink-0 snap-center w-12 h-16 md:w-14 md:h-20 flex flex-col items-center justify-center rounded-xl transition-all duration-300 relative
                            ${isSelected 
                                ? 'bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-md shadow-rose-200 scale-105' 
                                : 'hover:bg-slate-50 bg-white border border-slate-100 text-slate-500'}
                        `}
                    >
                        <span className={`text-[10px] md:text-xs mb-1 font-semibold tracking-tight
                            ${isSelected ? 'text-white/90' : ''}
                            ${!isSelected && isSunday ? 'text-rose-500' : ''} 
                            ${!isSelected && isSaturday ? 'text-blue-500' : ''}
                        `}>
                            {WEEKDAYS_KR[weekDayIndex]}
                        </span>
                        <span className={`text-lg md:text-xl font-bold leading-none
                             ${isSelected ? 'text-white' : 'text-slate-700'}
                        `}>
                            {d}
                        </span>
                        
                        {/* Event Indicator Dot */}
                        {hasEvent && (
                             <div className={`absolute bottom-1.5 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full 
                                ${isSelected ? 'bg-white' : 'bg-rose-400'}
                             `}></div>
                        )}
                    </button>
                );
            })}
        </div>
        
        {/* Gradient Fade Effect on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default DateSelector;