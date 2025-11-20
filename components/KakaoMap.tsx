import React, { useEffect, useRef } from 'react';
import { Coordinates } from '../types';

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  coordinates?: Coordinates;
  locationName: string;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ coordinates, locationName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;

    // Function to initialize map safely
    const initMap = () => {
        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                // Safety check to ensure container still exists after async load
                if (!mapContainer.current) return;

                const options = {
                    center: new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng),
                    level: 3
                };
                
                // Clear previous map if any (though React normally handles this via component unmount/remount)
                mapContainer.current.innerHTML = '';

                const map = new window.kakao.maps.Map(mapContainer.current, options);

                const markerPosition = new window.kakao.maps.LatLng(coordinates.lat, coordinates.lng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition
                });
                marker.setMap(map);

                const content = `<div style="padding:5px; font-size:12px; color:#000; border-radius:4px; background:white; border:1px solid #ccc;">${locationName}</div>`;
                const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: markerPosition,
                    content: content,
                    yAnchor: 2.5
                });
                customOverlay.setMap(map);
            });
        }
    };

    // Check if script is loaded, if not, wait a bit (simple polling for async script load)
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
  }, [coordinates, locationName]);

  const handleGetDirections = () => {
      if(coordinates) {
          // Kakao Map URL Scheme for Directions
          const url = `https://map.kakao.com/link/to/${locationName},${coordinates.lat},${coordinates.lng}`;
          window.open(url, '_blank');
      }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <button 
            onClick={handleGetDirections}
            className="flex items-center gap-2 bg-[#FEE500] hover:bg-[#FDD835] text-slate-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm"
        >
            <img src="https://t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png" alt="Kakao Map" className="h-4 w-auto" />
            길찾기
        </button>
      </div>
      
      <div className="relative w-full h-[300px] md:h-[400px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center group">
        <div ref={mapContainer} className="w-full h-full z-0"></div>
        
        {/* Fallback if API fails to load (network issues) */}
        {(!window.kakao || !window.kakao.maps) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6 text-center z-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="font-semibold">지도를 불러오는 중...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default KakaoMap;