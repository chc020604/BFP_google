import React from 'react';
import { CultureEvent } from '../types';

interface EventCardProps {
  event: CultureEvent;
  onClick?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, isSaved, onToggleSave }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave?.();
  };

  return (
    <div 
        onClick={onClick}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-200/40 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] border border-slate-100"
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
        <img
          src={event.imageUrl}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-indigo-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg border border-white/10 z-10">
          {event.dateStart === event.dateEnd ? event.dateStart : `${event.dateStart} ~ ${event.dateEnd.split('-')[2]}`}
        </div>

        {/* Save Button */}
        <button 
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md shadow-md border transition-all duration-300
                ${isSaved 
                    ? 'bg-rose-500/90 border-rose-400 text-white' 
                    : 'bg-white/30 border-white/40 text-white hover:bg-white hover:text-rose-500'}
            `}
        >
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Overlay Text (Visible only on hover) */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <button className="w-full py-3 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-xl font-medium hover:bg-white hover:text-rose-500 transition-colors shadow-lg">
                자세히 보기
            </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
          {event.title}
        </h3>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <svg className="w-4 h-4 mr-1.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1 font-medium">{event.location}</span>
        </div>
        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed h-10">
          {event.description}
        </p>
        
        {/* Decorative accent line on hover */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-500 group-hover:w-full"></div>
      </div>
    </div>
  );
};

export default EventCard;