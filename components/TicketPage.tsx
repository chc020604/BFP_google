import React from 'react';
import { CultureEvent } from '../types';

interface TicketPageProps {
  events: CultureEvent[];
}

const TicketPage: React.FC<TicketPageProps> = ({ events }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <span className="inline-block px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold mb-2">
            Easy Booking
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">티켓 예매</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
            인기 축제와 공연 티켓을 가장 빠르고 간편하게 예매하세요.<br/>
            BFP 회원에게는 특별한 할인 혜택이 제공됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
            // Mock status randomization
            const status = Math.random() > 0.7 ? 'SOLDOUT' : Math.random() > 0.4 ? 'SELLING_FAST' : 'OPEN';
            
            return (
                <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 group flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 right-3">
                             {status === 'SOLDOUT' && <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">매진</span>}
                             {status === 'SELLING_FAST' && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">마감임박</span>}
                             {status === 'OPEN' && <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">예매중</span>}
                        </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="mb-4">
                            <p className="text-xs text-rose-500 font-bold mb-1">{event.category === 'FESTIVAL' ? '축제' : '공연'}</p>
                            <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{event.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{event.dateStart} ~ {event.dateEnd}</p>
                            <p className="text-sm text-slate-500">{event.location}</p>
                        </div>
                        
                        <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400">가격</p>
                                <p className="font-bold text-slate-800">{event.price || '무료'}</p>
                            </div>
                            <button 
                                disabled={status === 'SOLDOUT'}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors
                                    ${status === 'SOLDOUT' 
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200'}
                                `}
                            >
                                {status === 'SOLDOUT' ? '예매불가' : '예매하기'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TicketPage;