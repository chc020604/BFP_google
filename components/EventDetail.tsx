import React, { useState, useEffect } from 'react';
import { CultureEvent, TransportInfo } from '../types';
import KakaoMap from './KakaoMap';
import { fetchNearbyPlaces } from '../services/apiService';

interface EventDetailProps {
  event: CultureEvent;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, isSaved, onToggleSave }) => {
  const [activeTransportTab, setActiveTransportTab] = useState<'parking' | 'subway' | 'bus'>('parking');
  const [realTransport, setRealTransport] = useState<TransportInfo | null>(null);
  const [loadingTransport, setLoadingTransport] = useState(false);

  // Load real-time nearby transport info using the service when event opens
  useEffect(() => {
    const loadTransport = async () => {
        if (event.coordinates) {
            setLoadingTransport(true);
            const info = await fetchNearbyPlaces(event.coordinates.lat, event.coordinates.lng);
            setRealTransport(info);
            setLoadingTransport(false);
        }
    };
    loadTransport();
  }, [event.coordinates]);

  // Use real data if available, otherwise fallback to event static data
  const transportData = realTransport || event.transport;

  const handleAddToCalendar = () => {
    const formatDateForCalendar = (dateStr: string, isEndDate = false) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        if (isEndDate) date.setDate(date.getDate() + 1);
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "").substring(0, 8);
    };
    
    const start = formatDateForCalendar(event.dateStart);
    const end = formatDateForCalendar(event.dateEnd, true);
    const title = event.title;
    const details = `${event.description}\n\n장소: ${event.location}\n\nBFP에서 보기: ${window.location.href}`;
    const location = event.location;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <button 
        onClick={onBack}
        className="group flex items-center text-slate-500 hover:text-rose-500 transition-colors mb-6 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        목록으로 돌아가기
      </button>

      <div className="mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 tracking-wide
            ${event.category === 'PERFORMANCE' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}
        `}>
            {event.category === 'PERFORMANCE' ? '공연 / 전시' : '축제 / 행사'}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {event.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-lg aspect-video bg-slate-200 relative group">
                <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    상세 정보
                </h3>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed min-h-[100px] h-auto whitespace-pre-line">
                    {event.description}
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    위치 정보
                </h3>
                <p className="text-slate-600 mb-4">{event.location}</p>
                <KakaoMap coordinates={event.coordinates} locationName={event.location} />
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-5 pb-2 border-b border-slate-100">이벤트 정보</h3>
                    <div className="space-y-5">
                        <div className="flex items-start">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 mt-0.5 mr-3">
                                <i className="far fa-calendar-alt"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">일정</p>
                                <p className="text-slate-700 font-medium text-sm">
                                    {event.dateStart} ~ {event.dateEnd}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                             <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 mt-0.5 mr-3">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">장소</p>
                                <p className="text-slate-700 font-medium text-sm">{event.location}</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                             <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0 mt-0.5 mr-3">
                                <i className="fas fa-won-sign"></i>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">가격</p>
                                <p className="text-slate-700 font-medium text-sm">{event.price || '무료'}</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-8 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <i className="fas fa-ticket-alt"></i>
                        예매하기
                    </button>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button 
                            onClick={onToggleSave}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-xs font-bold
                                ${isSaved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
                            `}
                        >
                             <i className={`${isSaved ? "fas" : "far"} fa-heart ${isSaved ? 'text-rose-500' : ''}`}></i>
                             {isSaved ? '저장됨' : '일정 저장'}
                        </button>
                        <button 
                            onClick={handleAddToCalendar}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-xs font-bold"
                        >
                            <i className="fab fa-google"></i>
                            캘린더 추가
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">교통 정보</h3>
                        {loadingTransport && <span className="text-xs text-rose-500 animate-pulse">실시간 검색중...</span>}
                    </div>
                    
                    <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                        {(['parking', 'subway', 'bus'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTransportTab(tab)}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5
                                    ${activeTransportTab === tab 
                                        ? 'bg-white text-slate-800 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'}
                                `}
                            >
                                <i className={`fas fa-${tab === 'parking' ? 'parking' : tab === 'subway' ? 'subway' : 'bus'}`}></i>
                                {tab === 'parking' ? '주차장' : tab === 'subway' ? '지하철' : '버스'}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[80px] flex flex-col justify-center">
                        {activeTransportTab === 'parking' && (
                            <div className="space-y-3">
                                {transportData?.parking && transportData.parking.length > 0 ? (
                                    transportData.parking.map((lot, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-slate-700 text-sm">{lot.name}</span>
                                                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">{lot.type}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{lot.address}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-600 text-center py-4">주변 1km 내 주차장 정보가 없습니다.</p>
                                )}
                            </div>
                        )}

                        {activeTransportTab === 'subway' && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                <div className="inline-block p-2 bg-white rounded-full shadow-sm mb-2">
                                     <i className="fas fa-subway text-orange-500 text-xl"></i>
                                </div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                    {transportData?.subway || "주변 1.5km 내 지하철역이 없습니다."}
                                </p>
                            </div>
                        )}

                        {activeTransportTab === 'bus' && (
                             <div className="space-y-3">
                                {transportData?.bus && transportData.bus.length > 0 ? (
                                    transportData.bus.map((stop, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <i className="fas fa-bus-alt text-slate-400 text-xs"></i>
                                                <span className="font-bold text-slate-700 text-sm">{stop.stopName}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {stop.routes.map((route, rIdx) => (
                                                    <span key={rIdx} className="inline-block bg-white border border-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                        {route}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-sm text-slate-600 text-center py-4">
                                         상세한 버스 노선 정보는<br/>지도 앱에서 확인해주세요.
                                     </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
