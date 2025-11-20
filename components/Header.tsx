import React from 'react';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  onNavigate: (view: 'list' | 'map' | 'ticket' | 'schedule') => void;
  user: User | null;
  onLoginRequest: () => void;
  onLogoutRequest: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLoginRequest, onLogoutRequest }) => {
  
  return (
    <header className="w-full relative overflow-hidden bg-gradient-to-r from-orange-400 via-rose-400 to-purple-600 text-white shadow-xl animate-gradient-x">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]"></div>
        
        {/* Top Utility Bar: Weather & User Tools */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-between items-center text-xs md:text-sm font-medium text-white/90">
            <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/25 transition-colors cursor-pointer border border-white/10 shadow-sm">
                    <svg className="w-4 h-4 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Busan 18°C 맑음</span>
                </div>
            </div>
            <div className="flex items-center space-x-5">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-white/90">
                            {user.email?.split('@')[0]}님
                        </span>
                        <button 
                            onClick={onLogoutRequest}
                            className="hover:text-orange-100 transition-colors bg-white/10 px-3 py-1 rounded-full"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button onClick={onLoginRequest} className="hover:text-orange-100 transition-colors flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20">
                             <i className="fas fa-envelope"></i> 이메일 로그인
                        </button>
                        <div className="h-3 w-px bg-white/40"></div>
                        <button onClick={onLoginRequest} className="hover:text-orange-100 transition-colors">회원가입</button>
                    </div>
                )}
                
                <div className="flex items-center gap-1 ml-2 cursor-pointer hover:opacity-80">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span className="text-xs uppercase">KR</span>
                </div>
            </div>
        </div>

        {/* Main Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 text-center z-10">
             <div 
                onClick={() => onNavigate('list')}
                className="inline-block mb-5 cursor-pointer"
             >
                <div className="border border-white/30 bg-white/10 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-orange-50 shadow-lg hover:bg-white/20 transition-colors">
                    Smart Culture Guide
                </div>
            </div>
            
            <h1 
                onClick={() => onNavigate('list')}
                className="text-6xl md:text-8xl font-black drop-shadow-2xl font-[Noto Sans KR] mb-2 tracking-tighter flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-none cursor-pointer"
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-orange-100">BFP</span>
                <span className="hidden md:block w-3 h-3 rounded-full bg-orange-300 mt-4"></span>
                <span className="text-2xl md:text-4xl font-bold tracking-widest text-white/90 mt-2 md:mt-4">Busan Festival Planner</span>
            </h1>
            
            <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed drop-shadow mb-10 mt-4">
                당신의 취향을 저격할 부산의 모든 축제와 공연.<br/>
                스마트한 일정 관리로 여행을 더 완벽하게 디자인하세요.
            </p>

            {/* Quick Actions Grid - Functional Planner Elements */}
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                 {[
                    { icon: "Map", label: "지도 보기", desc: "위치 기반", action: 'map' },
                    { icon: "Ticket", label: "티켓 예매", desc: "빠른 예약", action: 'ticket' },
                    { icon: "Calendar", label: "나의 일정", desc: "스케줄 관리", action: 'schedule' },
                 ].map((item) => (
                     <button 
                        key={item.label} 
                        onClick={() => onNavigate(item.action as any)}
                        className="group relative flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/25 hover:scale-105 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-orange-500/20"
                     >
                        <div className="mb-2 text-white/90 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                            {item.icon === "Map" && <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7" /></svg>}
                            {item.icon === "Ticket" && <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
                            {item.icon === "Calendar" && <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        </div>
                        <span className="text-sm font-bold text-white">{item.label}</span>
                        <span className="text-[10px] text-white/60 mt-0.5 group-hover:text-white/80 transition-colors">{item.desc}</span>
                     </button>
                 ))}
            </div>
        </div>
        
        {/* Decorative Waves */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-0 opacity-50">
            <svg className="block w-full h-16 md:h-32 text-white" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="currentColor" fillOpacity="0.6" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full leading-none z-10">
            <svg className="block w-full h-12 md:h-24 text-slate-50" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
    </header>
  );
};

export default Header;