import React from 'react';
import { CultureEvent } from '../types';

interface MyScheduleProps {
  savedEvents: CultureEvent[];
  onRemove: (event: CultureEvent) => void;
}

const MySchedule: React.FC<MyScheduleProps> = ({ savedEvents, onRemove }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="flex items-end justify-between mb-10 border-b border-slate-200 pb-6">
        <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">나의 일정</h2>
            <p className="text-slate-500">저장한 축제와 공연 일정을 관리하세요.</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-400 uppercase mb-1">Total Events</p>
            <p className="text-4xl font-bold text-rose-500">{savedEvents.length}</p>
        </div>
      </div>

      {savedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                 <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">저장된 일정이 없습니다.</h3>
            <p className="text-slate-500 text-sm mb-6">마음에 드는 행사를 찾아 하트 버튼을 눌러보세요!</p>
            <a href="/" className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200">
                행사 둘러보기
            </a>
        </div>
      ) : (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

            <div className="space-y-12">
                {savedEvents.map((event, index) => (
                    <div key={event.id} className="relative flex items-start pl-12 md:pl-20 group">
                        {/* Timeline Dot */}
                        <div className="absolute left-[11px] md:left-[27px] top-6 w-4 h-4 rounded-full border-4 border-white bg-rose-500 shadow-md z-10"></div>
                        
                        {/* Date Label */}
                        <div className="hidden md:block absolute left-0 top-6 -translate-x-[120%] text-right w-24">
                            <p className="font-bold text-slate-800">{event.dateStart}</p>
                            <p className="text-xs text-slate-400">
                                {new Date(event.dateStart) > new Date() ? 'Upcoming' : 'Past'}
                            </p>
                        </div>

                        {/* Content Card */}
                        <div className="bg-white rounded-2xl p-5 md:p-6 w-full shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-32 md:h-auto rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow py-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                                        {event.category === 'FESTIVAL' ? '축제' : '공연'}
                                    </span>
                                    <button 
                                        onClick={() => onRemove(event)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                        title="일정 삭제"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
                                <div className="flex flex-col gap-1 text-sm text-slate-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {event.dateStart} ~ {event.dateEnd}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                        {event.location}
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg transition-colors">
                                        메모 작성
                                    </button>
                                    <button className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2 rounded-lg transition-colors">
                                        친구에게 공유
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Button (Placeholder) */}
                <div className="pl-12 md:pl-20">
                    <a href="/" className="block w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-rose-300 hover:text-rose-500 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        더 많은 일정 찾아보기
                    </a>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;