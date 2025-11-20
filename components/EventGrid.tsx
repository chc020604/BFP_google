import React from 'react';
import { CultureEvent } from '../types';
import EventCard from './EventCard';

interface EventGridProps {
  events: CultureEvent[];
  loading: boolean;
  hasSearch?: boolean;
  onEventClick: (event: CultureEvent) => void;
  savedEventIds: Set<string>;
  onToggleSave: (event: CultureEvent) => void;
}

const EventGrid: React.FC<EventGridProps> = ({ events, loading, hasSearch, onEventClick, savedEventIds, onToggleSave }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-[480px] relative">
             {/* Shimmer Effect Wrapper */}
             <div className="animate-pulse flex flex-col h-full">
                {/* Image Skeleton with Sunset Hint */}
                <div className="h-[65%] bg-gradient-to-br from-slate-200 via-rose-50 to-slate-200 relative">
                    {/* Date Badge Skeleton */}
                    <div className="absolute top-3 left-3 w-24 h-7 bg-white/60 backdrop-blur-sm rounded-full"></div>
                </div>
                
                {/* Content Skeleton */}
                <div className="p-6 flex-1 flex flex-col justify-center space-y-4">
                    {/* Title */}
                    <div className="h-7 bg-slate-200 rounded-md w-3/4"></div>
                    
                    {/* Meta info (Location/Date) */}
                    <div className="flex items-center space-x-2">
                         <div className="w-4 h-4 bg-rose-200/50 rounded-full"></div>
                         <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                    </div>
                    
                    {/* Description lines */}
                    <div className="space-y-2 pt-2">
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white/50 rounded-3xl border border-slate-100 border-dashed">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
            {hasSearch ? (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
            )}
            </svg>
        </div>
        <p className="text-lg font-medium text-slate-600">
            {hasSearch ? "검색 결과가 없습니다." : "해당 날짜에 예정된 행사가 없습니다."}
        </p>
        <p className="text-sm mt-1">
             {hasSearch ? "다른 검색어로 찾아보세요." : "다른 날짜를 선택해보세요."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 pb-20">
      {events.map((event) => (
        <EventCard 
            key={event.id} 
            event={event} 
            onClick={() => onEventClick(event)}
            isSaved={savedEventIds.has(event.id)}
            onToggleSave={() => onToggleSave(event)}
        />
      ))}
    </div>
  );
};

export default EventGrid;