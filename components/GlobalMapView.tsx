import React, { useEffect, useRef, useState } from 'react';
import { CultureEvent } from '../types';

declare global {
  interface Window {
    kakao: any;
  }
}

interface GlobalMapViewProps {
  events: CultureEvent[];
}

const GlobalMapView: React.FC<GlobalMapViewProps> = ({ events }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const container = mapContainer.current;
    if (!container) return;

    const initMap = () => {
        if (!window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            if (!mapContainer.current) return;

            // 1. Focus on Busan (City Hall Area)
            const busanCenter = new window.kakao.maps.LatLng(35.1795543, 129.0756416);
            
            const options = {
                center: busanCenter,
                level: 8 // Zoom level: 8 shows major parts of Busan
            };

            // Clear existing map content
            mapContainer.current.innerHTML = '';

            const map = new window.kakao.maps.Map(mapContainer.current, options);

            // 2. CRITICAL FIX: Solve the "cut off" / "white space" map issue
            // The map needs to recalculate its layout once the DOM is fully painted.
            setTimeout(() => {
                map.relayout();
                map.setCenter(busanCenter); // Re-center after layout update
            }, 300);

            // 3. Filter for Today's Events
            const today = new Date();
            // Reset time to compare dates only
            today.setHours(0, 0, 0, 0);

            const todayEvents = events.filter(event => {
                const start = new Date(event.dateStart);
                const end = new Date(event.dateEnd);
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);
                
                return today >= start && today <= end;
            });
            
            setActiveCount(todayEvents.length);

            const bounds = new window.kakao.maps.LatLngBounds();
            let hasMarkers = false;

            todayEvents.forEach(event => {
                if (event.coordinates) {
                    const position = new window.kakao.maps.LatLng(event.coordinates.lat, event.coordinates.lng);
                    
                    // Create Marker
                    const marker = new window.kakao.maps.Marker({
                        map: map,
                        position: position,
                        title: event.title
                    });

                    // Custom Overlay for cleaner look
                    const content = `
                        <div style="
                            padding: 6px 12px;
                            background-color: white;
                            border-radius: 24px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
                            border: 1px solid #f43f5e;
                            font-size: 12px;
                            font-weight: bold;
                            color: #1e293b;
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            white-space: nowrap;
                            transform: translateY(-140%);
                            font-family: 'Noto Sans KR', sans-serif;
                        ">
                            <span style="width: 8px; height: 8px; background-color: #f43f5e; border-radius: 50%;"></span>
                            ${event.title}
                        </div>
                    `;
                    
                    const customOverlay = new window.kakao.maps.CustomOverlay({
                        position: position,
                        content: content,
                        yAnchor: 1
                    });
                    customOverlay.setMap(map);

                    bounds.extend(position);
                    hasMarkers = true;
                }
            });

            // NOTE: We keep the center on Busan by default as requested ("처음 지도가 표시 될때 부산을 포커싱").
            // Only if markers are way off screen would we want to fitBounds, but for a "Busan Festival" app, 
            // keeping the city context is usually better than zooming into a single marker.
            
            // Add zoom control
            const zoomControl = new window.kakao.maps.ZoomControl();
            map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        });
    };

    if (window.kakao && window.kakao.maps) {
        initMap();
    } else {
        const timer = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(timer);
                initMap();
            }
        }, 100);
        return () => clearInterval(timer);
    }
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-rose-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7" /></svg>
            </span>
            축제 지도 보기
            </h2>
            <p className="text-slate-500 mt-1">부산 전역에서 <span className="font-bold text-rose-500">오늘</span> 열리는 축제와 공연을 확인하세요.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
            오늘 진행중인 행사: <span className="text-rose-500 font-bold text-lg ml-1">{activeCount}</span>건
        </div>
      </div>

      <div className="relative w-full h-[70vh] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
        <div ref={mapContainer} className="w-full h-full"></div>
        
        {/* Loader visual */}
        {(!window.kakao || !window.kakao.maps) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6 pointer-events-none">
                 <svg className="w-12 h-12 mb-4 animate-bounce text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-lg font-semibold">지도를 불러오는 중입니다...</p>
            </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="mt-4 text-center text-xs text-slate-400">
          * 지도를 움직여 주변 행사를 확인해보세요.
      </div>
    </div>
  );
};

export default GlobalMapView;