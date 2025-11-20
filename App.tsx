import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import DateSelector from './components/DateSelector';
import EventGrid from './components/EventGrid';
import EventDetail from './components/EventDetail';
import GlobalMapView from './components/GlobalMapView';
import TicketPage from './components/TicketPage';
import MySchedule from './components/MySchedule';
import { EventCategory, DateSelection, CultureEvent } from './types';
import { fetchEventsFromGemini } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { User } from '@supabase/supabase-js';

type ViewState = 'list' | 'detail' | 'map' | 'ticket' | 'schedule';

const App: React.FC = () => {
  // State initialization
  const today = new Date();
  const [dateSelection, setDateSelection] = useState<DateSelection>({
    year: today.getFullYear(),
    month: today.getMonth(), // 0-indexed
    day: today.getDate(),
  });

  const [activeCategory, setActiveCategory] = useState<EventCategory>(EventCategory.FESTIVAL);
  const [events, setEvents] = useState<CultureEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Navigation State
  const [view, setView] = useState<ViewState>('list');
  const [selectedEvent, setSelectedEvent] = useState<CultureEvent | null>(null);
  
  // Cache structure: year-month-category -> events[]
  const [cache, setCache] = useState<Record<string, CultureEvent[]>>({});

  // User & Saved Events State
  const [user, setUser] = useState<User | null>(null);
  const [savedEvents, setSavedEvents] = useState<CultureEvent[]>([]);

  // 1. Initialize Auth & Load Initial Data
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Load Saved Events (Strategy: DB if logged in, LocalStorage if guest)
  useEffect(() => {
    const loadSavedEvents = async () => {
      if (user) {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('user_schedules')
          .select('event_data')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching schedules:', error);
        } else if (data) {
          // Extract event_data from rows
          setSavedEvents(data.map((row: any) => row.event_data));
        }
      } else {
        // Fetch from LocalStorage (Guest mode)
        try {
          const saved = localStorage.getItem('bfp_saved_events');
          setSavedEvents(saved ? JSON.parse(saved) : []);
        } catch (e) {
          console.error("Failed to parse saved events", e);
          setSavedEvents([]);
        }
      }
    };

    loadSavedEvents();
  }, [user]);

  // 3. Handle Save/Remove Logic
  const handleToggleSave = async (event: CultureEvent) => {
    const isAlreadySaved = savedEvents.some(e => e.id === event.id);

    // Optimistic UI update
    let newSavedEvents = isAlreadySaved 
      ? savedEvents.filter(e => e.id !== event.id)
      : [...savedEvents, event];
    
    setSavedEvents(newSavedEvents);

    if (user) {
      // Supabase Sync
      if (isAlreadySaved) {
        // Delete: Since we store JSON, we need to find the row where event_data->>id matches
        // However, Supabase JSON filtering can be tricky. 
        // Alternative: Delete based on user_id and a filter on the JSON column.
        // Note: This query assumes event_data->>'id' works.
        const { error } = await supabase
          .from('user_schedules')
          .delete()
          .eq('user_id', user.id)
          .eq('event_data->>id', event.id); // Cast ID to string comparison
        
        if (error) console.error("Delete error:", error);

      } else {
        // Insert
        const { error } = await supabase
          .from('user_schedules')
          .insert({
            user_id: user.id,
            event_data: event
          });

        if (error) console.error("Insert error:", error);
      }
    } else {
      // LocalStorage Sync
      localStorage.setItem('bfp_saved_events', JSON.stringify(newSavedEvents));
    }
  };

  const savedEventIds = useMemo(() => new Set(savedEvents.map(e => e.id)), [savedEvents]);

  // Fetch events when month or category changes
  const loadEvents = useCallback(async () => {
    const { year, month } = dateSelection;
    const cacheKey = `${year}-${month}-${activeCategory}`;

    // Check cache first
    if (cache[cacheKey]) {
      setEvents(cache[cacheKey]);
      return;
    }

    setLoading(true);
    try {
      const fetchedEvents = await fetchEventsFromGemini(year, month, activeCategory);
      setEvents(fetchedEvents);
      setCache(prev => ({ ...prev, [cacheKey]: fetchedEvents }));
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [dateSelection.year, dateSelection.month, activeCategory, cache]);

  // Trigger fetch on relevant state changes
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Navigation Handlers
  const handleEventClick = (event: CultureEvent) => {
    setSelectedEvent(event);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedEvent(null);
    setView('list');
  };

  const handleNavigate = (newView: ViewState) => {
      setView(newView);
      window.scrollTo(0, 0);
  };

  // Calculate which days have events for the calendar dots
  const activeDays = useMemo(() => {
    const days = new Set<number>();
    events.forEach(event => {
      const start = new Date(event.dateStart);
      const end = new Date(event.dateEnd);
      const daysInMonth = new Date(dateSelection.year, dateSelection.month + 1, 0).getDate();
      
      for(let d = 1; d <= daysInMonth; d++) {
        const current = new Date(dateSelection.year, dateSelection.month, d);
        current.setHours(0,0,0,0);
        const s = new Date(start); s.setHours(0,0,0,0);
        const e = new Date(end); e.setHours(0,0,0,0);
        
        if (current >= s && current <= e) {
          days.add(d);
        }
      }
    });
    return days;
  }, [events, dateSelection.year, dateSelection.month]);

  // Filter displayed events based on selected day AND search query
  const displayedEvents = events.filter(event => {
    const start = new Date(event.dateStart);
    const end = new Date(event.dateEnd);
    const current = new Date(dateSelection.year, dateSelection.month, dateSelection.day);
    
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    current.setHours(0,0,0,0);

    const isDateMatch = current >= start && current <= end;
    
    if (!searchQuery.trim()) return isDateMatch;

    const query = searchQuery.toLowerCase();
    const isSearchMatch = 
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query);

    return isDateMatch && isSearchMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[Noto Sans KR]">
      <Header 
        onNavigate={handleNavigate} 
        user={user} 
        onLoginRequest={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
        onLogoutRequest={() => supabase.auth.signOut()}
      />
      
      <main className="flex-grow w-full">
        {view === 'list' && (
            <>
                {/* Filters & Calendar (Only in List View) */}
                <div className="bg-white/80 backdrop-blur-md shadow-sm pt-4 pb-2 sticky top-0 z-30 border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                        <CategoryTabs 
                            activeCategory={activeCategory} 
                            onSelectCategory={setActiveCategory} 
                        />
                        
                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <input 
                                type="text" 
                                placeholder="행사명 또는 장소 검색..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border-none text-slate-700 focus:ring-2 focus:ring-rose-300 focus:bg-white transition-all text-sm"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    
                    <DateSelector 
                        selection={dateSelection} 
                        onDateChange={setDateSelection} 
                        activeDays={activeDays}
                    />
                </div>

                {/* Event Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-20">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
                            <span className="w-1.5 h-6 md:h-8 bg-gradient-to-b from-orange-400 to-rose-500 rounded-full mr-3"></span>
                            {dateSelection.month + 1}월 {dateSelection.day}일
                            {searchQuery && <span className="text-base font-normal text-slate-500 ml-2">검색 결과</span>}
                        </h3>
                        <span className="text-sm text-slate-500 font-medium">
                            <span className="text-rose-500 font-bold text-lg">{displayedEvents.length}</span>건
                        </span>
                    </div>
                    
                    <EventGrid 
                        events={displayedEvents} 
                        loading={loading} 
                        hasSearch={!!searchQuery} 
                        onEventClick={handleEventClick}
                        savedEventIds={savedEventIds}
                        onToggleSave={handleToggleSave}
                    />
                </div>
            </>
        )}

        {view === 'detail' && selectedEvent && (
            <EventDetail 
                event={selectedEvent} 
                onBack={handleBackToList}
                isSaved={savedEventIds.has(selectedEvent.id)}
                onToggleSave={() => handleToggleSave(selectedEvent)}
            />
        )}

        {view === 'map' && (
            <GlobalMapView events={events} />
        )}

        {view === 'ticket' && (
            <TicketPage events={events} />
        )}

        {view === 'schedule' && (
            <MySchedule 
                savedEvents={savedEvents}
                onRemove={(event) => handleToggleSave(event)}
            />
        )}
      </main>

      <footer className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 text-white/60 py-12 mt-auto animate-gradient-slow">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 
            onClick={() => handleNavigate('list')}
            className="text-2xl font-black text-white mb-4 font-[Noto Sans KR] tracking-widest opacity-80 cursor-pointer inline-block"
          >
            BFP
          </h2>
          <p className="text-sm mb-6 text-white/70">Busan Festival Planner</p>
          <div className="flex justify-center space-x-6 mb-6 text-xs md:text-sm">
            <a href="#" className="hover:text-rose-400 transition-colors">서비스 소개</a>
            <a href="#" className="hover:text-rose-400 transition-colors">이용약관</a>
            <a href="#" className="hover:text-rose-400 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-rose-400 transition-colors">고객센터</a>
          </div>
          <p className="text-[10px] opacity-50">&copy; 2025 BFP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;