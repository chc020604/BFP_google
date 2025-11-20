
import { CultureEvent, EventCategory, TransportInfo } from "../types";

// API Key provided by user (Hex format)
const API_KEY = "b8d739cbc545016d0ed2ef1cae6fa233afe0aa3115cfde4629e646a935502669";
const BASE_URL = "https://apis.data.go.kr/B551011/KorService1";

// Helper to format date as YYYYMMDD
const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

// Calculate date range: Last Month ~ 10 Months Later
const getDateRange = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1); 
  const endDate = new Date(now.getFullYear(), now.getMonth() + 10, 0);  
  
  return {
    start: formatDate(startDate),
    end: formatDate(endDate)
  };
};

export const fetchBusanFestivals = async (): Promise<CultureEvent[]> => {
  const { start } = getDateRange();
  
  // Params for TourAPI
  // Note: serviceKey is usually the first parameter.
  // We use 'AppTest' for MobileApp to adhere to data.go.kr test guidelines.
  const queryParams = [
    `serviceKey=${API_KEY}`, 
    `numOfRows=100`,
    `pageNo=1`,
    `MobileOS=ETC`,
    `MobileApp=AppTest`, 
    `_type=json`,
    `arrange=A`,
    `eventStartDate=${start}`,
    `areaCode=6`, // Busan
    `contentTypeId=15` // Festival
  ];

  const queryString = queryParams.join('&');
  const targetUrl = `${BASE_URL}/searchFestival1?${queryString}`;
  
  // Proxy strategy: Try multiple proxies in order to bypass CORS
  // These proxies forward the request to the data.go.kr server
  const proxies = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];

  for (const createProxyUrl of proxies) {
    try {
        const proxyUrl = createProxyUrl(targetUrl);
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
            continue;
        }
        
        const text = await response.text();

        if (!text) continue;

        // Check for XML error responses (common with data.go.kr errors)
        if (text.trim().startsWith('<')) {
            // This usually means the API Key was rejected or a limit was reached
            console.warn("Received XML response from API (likely error):", text.substring(0, 100));
            continue; 
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            continue;
        }

        const responseBody = json.response?.body;
        const items = responseBody?.items?.item;

        if (items) {
            const itemsArray = Array.isArray(items) ? items : [items];

            const events: CultureEvent[] = itemsArray.map((item: any) => ({
                id: item.contentid || String(Math.random()),
                title: item.title,
                dateStart: item.eventstartdate ? `${item.eventstartdate.slice(0,4)}-${item.eventstartdate.slice(4,6)}-${item.eventstartdate.slice(6,8)}` : '',
                dateEnd: item.eventenddate ? `${item.eventenddate.slice(0,4)}-${item.eventenddate.slice(4,6)}-${item.eventenddate.slice(6,8)}` : '',
                location: item.addr1 || '부산광역시',
                imageUrl: item.firstimage || item.firstimage2 || `https://via.placeholder.com/400x500?text=No+Image`,
                category: EventCategory.FESTIVAL, 
                description: item.addr2 || item.title,
                price: '무료 (상세정보 참조)',
                cast: '-',
                coordinates: {
                    lat: parseFloat(item.mapy) || 35.1795543,
                    lng: parseFloat(item.mapx) || 129.0756416
                },
                transport: {
                    parking: [],
                    subway: '정보 없음',
                    bus: []
                }
            }));
            
            return events;
        } else {
             return [];
        }

    } catch (error) {
        console.warn("Proxy network error:", error);
    }
  }

  return [];
};

export const fetchNearbyPlaces = (lat: number, lng: number): Promise<TransportInfo> => {
  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        resolve({ parking: [], bus: [], subway: '정보 없음' });
        return;
    }

    const places = new window.kakao.maps.services.Places();
    const loc = new window.kakao.maps.LatLng(lat, lng);
    
    const transport: TransportInfo = { parking: [], bus: [], subway: '' };
    
    let completed = 0;
    const TOTAL_TASKS = 2; 
    
    const checkDone = () => {
        completed++;
        if (completed >= TOTAL_TASKS) resolve(transport);
    };

    places.categorySearch('PK6', (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
            transport.parking = result.slice(0, 3).map((p: any) => ({
                name: p.place_name,
                type: '주차장', 
                address: p.road_address_name || p.address_name
            }));
        }
        checkDone();
    }, { location: loc, radius: 1000 }); 

    places.categorySearch('SW8', (result: any[], status: any) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            const nearest = result[0];
            transport.subway = `${nearest.place_name} (도보 약 ${Math.round(nearest.distance / 60)}분)`;
        } else {
            transport.subway = "도보 15분 내 지하철역 없음";
        }
        checkDone();
    }, { location: loc, radius: 1500 });
  });
};

export const fetchWeather = async (lat: number, lng: number) => {
    return { temp: 18, condition: '맑음' }; 
};
