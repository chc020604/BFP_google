import { GoogleGenAI, Type } from "@google/genai";
import { CultureEvent, EventCategory } from "../types";
import { MOCK_EVENTS } from "../constants";

export const fetchEventsFromGemini = async (
  year: number,
  month: number,
  category: EventCategory
): Promise<CultureEvent[]> => {
  const apiKey = process.env.API_KEY;
  
  // Fallback if no API key
  if (!apiKey) {
    console.warn("No API Key found. Using mock data.");
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_EVENTS.filter(e => e.category === category)), 800);
    });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Generate 6 realistic cultural events for Busan, South Korea.
    Year: ${year}
    Month: ${month + 1}
    Category: ${category === EventCategory.PERFORMANCE ? 'Performance/Exhibition (Art, Music, Theater)' : 'Festival/Event (Fireworks, Outdoor, Community)'}
    
    Ensure the dates are within this specific month.
    Use realistic location names in Busan (e.g., BEXCO, Gwangalli, Busan Cultural Center).
    Provide realistic pricing, cast info (or '-').
    For coordinates, provide approximate lat/lng for the location.
    
    IMPORTANT: Provide DETAILED transport info.
    - Parking: List 2-3 nearby parking lots with name, type (Public/Private/Paid), and approximate address.
    - Bus: List 2 nearby bus stops and the bus route numbers that stop there.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              dateStart: { type: Type.STRING, description: "YYYY-MM-DD format" },
              dateEnd: { type: Type.STRING, description: "YYYY-MM-DD format" },
              location: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              category: { type: Type.STRING, enum: [EventCategory.PERFORMANCE, EventCategory.FESTIVAL] },
              description: { type: Type.STRING },
              price: { type: Type.STRING },
              cast: { type: Type.STRING },
              coordinates: {
                  type: Type.OBJECT,
                  properties: {
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER }
                  }
              },
              transport: {
                  type: Type.OBJECT,
                  properties: {
                      parking: { 
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  name: { type: Type.STRING },
                                  type: { type: Type.STRING },
                                  address: { type: Type.STRING }
                              }
                          }
                      },
                      subway: { type: Type.STRING },
                      bus: { 
                          type: Type.ARRAY,
                          items: {
                              type: Type.OBJECT,
                              properties: {
                                  stopName: { type: Type.STRING },
                                  routes: { 
                                      type: Type.ARRAY,
                                      items: { type: Type.STRING }
                                  }
                              }
                          }
                      }
                  }
              }
            },
            required: ["id", "title", "dateStart", "dateEnd", "location", "imageUrl", "category", "description"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return MOCK_EVENTS;
    
    const data = JSON.parse(text) as CultureEvent[];
    // Ensure categories align exactly and add placeholder images
    return data.map(e => ({
        ...e,
        imageUrl: `https://picsum.photos/400/500?random=${Math.random()}`, 
        category: category 
    }));

  } catch (error) {
    console.error("Gemini API failed:", error);
    return MOCK_EVENTS.filter(e => e.category === category);
  }
};