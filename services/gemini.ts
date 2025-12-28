
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type } from '@google/genai';
import { CITY_CONTEXTS } from '../data/cityContexts';
import { City, AppMode } from '../types';

// The API key is obtained exclusively from process.env.API_KEY.
// We initialize the client inside the functions to ensure the latest key is used.

const getUserLocation = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });
};

export const generateLocalResponse = async (
  city: City, 
  mode: AppMode, 
  userPrompt: string, 
  history: {role: string, content: string}[]
) => {
  // Always use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cityInfo = CITY_CONTEXTS[city];
  
  let mission = '';
  switch(mode) {
    case AppMode.FOOD:
      mission = 'STREET FOOD INTELLIGENCE. Suggest specific stalls, hidden gems, and timings. Provide actual locations that will show up as Google Maps links.';
      break;
    case AppMode.SLANG:
      mission = 'SLANG & CULTURAL TRANSLATION. Explain nuances, usage with friends vs elders, and risks of misuse.';
      break;
    case AppMode.TRAFFIC:
      mission = 'LOCAL TRAFFIC ESTIMATOR. Use your local knowledge of bottlenecks, peak hours, and secret shortcuts. CRITICAL: Mention specific junctions, roads, and landmarks by name so they can be linked to Google Maps for the user to navigate.';
      break;
    case AppMode.CULTURE:
      mission = 'CITY CULTURE EXPLAINER. Deep dive into the city\'s soul, traditions, etiquette, and "unwritten rules".';
      break;
  }

  const systemInstruction = `
    You are a REAL local resident of ${cityInfo.name} with 15+ years of experience.
    Your tone is informal, street-smart, and helpful. You are NOT a tourist guide or an AI.
    
    CONTEXT FOR ${cityInfo.name.toUpperCase()}:
    ${cityInfo.context}

    MISSION:
    1. Mode: ${mission}
    2. Answer ONLY using your deep local knowledge of ${cityInfo.name}.
    3. Use local slang naturally but explain it if needed.
    4. Provide SPECIFIC geographical names (roads, junctions, buildings) to trigger Map Grounding.
    5. Be opinionated! A real local has favorite spots and places they avoid.
  `;

  const contents = history.map(h => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  // Maps grounding is only supported in Gemini 2.5 series models.
  const useMaps = mode === AppMode.FOOD || mode === AppMode.TRAFFIC;
  const model = useMaps ? 'gemini-2.5-flash' : 'gemini-3-flash-preview';
  
  const tools: any[] = [];
  let toolConfig: any = undefined;

  if (useMaps) {
    tools.push({ googleMaps: {} });
    tools.push({ googleSearch: {} });
    
    const location = await getUserLocation();
    if (location) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        }
      };
    }
  } else {
     tools.push({ googleSearch: {} });
  }

  const response = await ai.models.generateContent({
    model: model,
    contents,
    config: {
      systemInstruction,
      temperature: 0.8,
      tools: tools.length > 0 ? tools : undefined,
      toolConfig: toolConfig,
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks.map((chunk: any) => {
    if (chunk.web) {
      return { title: chunk.web.title, uri: chunk.web.uri, type: 'web' };
    }
    if (chunk.maps) {
      return { title: chunk.maps.title || 'View on Maps', uri: chunk.maps.uri, type: 'maps' };
    }
    return null;
  }).filter((s: any) => s !== null);

  return {
    text: response.text,
    sources
  };
};

export const generateCityVisuals = async (city: City) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const cityInfo = CITY_CONTEXTS[city];
  
  const prompt = `A cinematic photograph of ${cityInfo.name}, India. Focus on street life and landmarks.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createPcmBlob(data: Float32Array): Blob {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodeAudio(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}
