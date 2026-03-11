
import { GoogleGenAI, Type } from "@google/genai";

export interface AppData {
  id: string;
  name: string;
  icon: string;
  category: string;
  rating: number;
  size: string;
  platform: 'macos' | 'windows' | 'android' | 'native' | 'linux';
  description?: string;
  developer?: string;
  version?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const StoreService = {
  async fetchAppleApps(query: string = 'popular'): Promise<AppData[]> {
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software&limit=20`);
      const data = await response.json();
      return data.results.map((item: any) => ({
        id: item.trackId.toString(),
        name: item.trackName,
        icon: item.artworkUrl100,
        category: item.primaryGenreName,
        rating: item.averageUserRating || 4.5,
        size: (item.fileSizeBytes / (1024 * 1024)).toFixed(1) + ' MB',
        platform: 'macos',
        description: item.description,
        developer: item.artistName
      }));
    } catch (error) {
      console.error('Error fetching Apple apps:', error);
      return [];
    }
  },

  async fetchGooglePlayApps(query: string = 'trending apps'): Promise<AppData[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: `List 10 ${query} on Google Play Store with real details.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                icon: { type: Type.STRING },
                category: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                size: { type: Type.STRING },
                description: { type: Type.STRING },
                developer: { type: Type.STRING }
              },
              required: ["id", "name", "icon", "category", "rating", "size"]
            }
          }
        }
      });

      const apps = JSON.parse(response.text || '[]');
      return apps.map((app: any) => ({ ...app, platform: 'android' }));
    } catch (error) {
      console.error('Error fetching Google Play apps:', error);
      return [];
    }
  },

  async fetchMSStoreApps(query: string = 'top windows apps'): Promise<AppData[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: `List 10 ${query} on Microsoft Store with real details.`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                icon: { type: Type.STRING },
                category: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                size: { type: Type.STRING },
                description: { type: Type.STRING },
                developer: { type: Type.STRING }
              },
              required: ["id", "name", "icon", "category", "rating", "size"]
            }
          }
        }
      });

      const apps = JSON.parse(response.text || '[]');
      return apps.map((app: any) => ({ ...app, platform: 'windows' }));
    } catch (error) {
      console.error('Error fetching MS Store apps:', error);
      return [];
    }
  },

  async fetchLinuxPackages(query: string): Promise<AppData[]> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: `List 5 real Linux debian packages matching "${query}" with their real metadata (version, size, description).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                version: { type: Type.STRING },
                category: { type: Type.STRING },
                size: { type: Type.STRING },
                description: { type: Type.STRING },
                developer: { type: Type.STRING }
              },
              required: ["id", "name", "version", "size", "description"]
            }
          }
        }
      });

      const pkgs = JSON.parse(response.text || '[]');
      return pkgs.map((p: any) => ({ ...p, platform: 'linux', icon: 'box' }));
    } catch (error) {
      console.error('Error fetching Linux packages:', error);
      return [];
    }
  }
};
