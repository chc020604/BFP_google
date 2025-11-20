export enum EventCategory {
  PERFORMANCE = 'PERFORMANCE', // 공연/전시
  FESTIVAL = 'FESTIVAL'       // 축제/행사
}

export interface ParkingInfo {
  name: string;
  type: string; // e.g., '공영', '민영', '유료'
  address: string;
}

export interface BusInfo {
  stopName: string;
  routes: string[];
}

export interface TransportInfo {
  parking?: ParkingInfo[];
  subway?: string;
  bus?: BusInfo[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CultureEvent {
  id: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  imageUrl: string;
  category: EventCategory;
  description: string;
  
  // Detailed Info
  price?: string;
  cast?: string; // 출연진
  coordinates?: Coordinates;
  transport?: TransportInfo;
}

export interface DateSelection {
  year: number;
  month: number; // 0-11
  day: number;
}

// Supabase Database Definition
export interface Database {
  public: {
    Tables: {
      user_schedules: {
        Row: {
          id: string;
          user_id: string;
          event_data: CultureEvent; // JSONB storage for full event details
          created_at: string;
        };
        Insert: {
          user_id: string;
          event_data: CultureEvent;
          created_at?: string;
        };
        Delete: {
          id: string;
        }
      };
    };
  };
}
