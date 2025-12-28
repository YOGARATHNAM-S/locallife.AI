
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { City, AppMode } from '../types';
import { CITY_CONTEXTS } from '../data/cityContexts';
import { decodeBase64, decodeAudioData, createPcmBlob } from '../services/gemini';

interface Props {
  city: City;
  mode: AppMode;
  onClose: () => void;
}

export const VoiceOverlay: React.FC<Props> = ({ city, mode, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('Syncing Local Soul...');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startSession();
    return () => stopSession();
  }, []);

  const startSession = async () => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const cityInfo = CITY_CONTEXTS[city];
      
      const systemInstruction = `
        You are a REAL local from ${cityInfo.name} with deep street knowledge. 
        Context: ${cityInfo.context}
        
        CRITICAL FIRST STEP: When the connection starts, IMMEDIATELY welcome the user with your authentic native greeting: "${cityInfo.nativeGreeting}". 
        Then, briefly ask how you can help them with ${mode === AppMode.FOOD ? 'local eats' : 'local lingo'}.
        
        TONE RULES:
        - Sound human, warm, and authentic. 
        - Use regional mannerisms (e.g., "Macha", "Bhai", "Ji").
        - Keep responses short for voice (under 15 words if possible).
        - DO NOT sound like a robot or a help desk.
      `;

      setStatus('Connecting to Mic...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputAudioCtx;
      outputAudioContextRef.current = outputAudioCtx;

      setStatus('Opening Gateway...');
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setStatus('Local is Listening');
            
            // Initiate the stream from the mic
            const source = inputAudioCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioCtx.destination);

            // Send an initial silent turn-trigger to get the greeting
            sessionPromise.then(session => {
                // By sending a tiny bit of silence or just a ping, the model with the above instruction
                // will realize the session is live and start its "Greeting" turn.
                session.sendRealtimeInput({ 
                  media: { 
                    data: btoa(String.fromCharCode(...new Uint8Array(100).fill(0))), 
                    mimeType: 'audio/pcm;rate=16000' 
                  } 
                });
            });
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const outCtx = outputAudioContextRef.current;
              if (!outCtx) return;

              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), outCtx, 24000, 1);
              
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch(e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error('Session Error:', e);
            setError('Connection failed. Mic or Network issue?');
          },
          onclose: () => {
            setStatus('Connection closed');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: cityInfo.recommendedVoice 
              } 
            }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to start voice session');
    }
  };

  const stopSession = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f97316_0%,#0f172a_100%)] opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Voice Core */}
      <div className="relative mb-16 z-10">
        <div className={`
          w-48 h-48 rounded-[60px] border-2 border-white/10 flex items-center justify-center transition-all duration-700
          ${isSpeaking ? 'scale-110 rotate-3 shadow-[0_0_80px_rgba(249,115,22,0.4)]' : 'scale-100 rotate-0 shadow-none'}
        `}>
          {/* Animated Rings */}
          <div className={`absolute inset-0 border-2 border-orange-400/30 rounded-[60px] animate-ping [animation-duration:3s] ${isSpeaking ? 'block' : 'hidden'}`}></div>
          <div className={`absolute inset-0 border-2 border-red-400/20 rounded-[60px] animate-ping [animation-duration:4s] [animation-delay:1s] ${isSpeaking ? 'block' : 'hidden'}`}></div>
          
          <div className={`
            w-36 h-36 rounded-[45px] bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl transition-all duration-500
            ${isConnecting ? 'animate-pulse scale-95' : 'scale-100'}
          `}>
             <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 text-white transition-transform ${isSpeaking ? 'scale-110' : 'scale-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
             </svg>
          </div>
        </div>
      </div>

      <div className="text-center z-10">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight font-royal">
          {CITY_CONTEXTS[city].name} Swag
        </h2>
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-orange-300 font-bold uppercase tracking-[0.2em] text-[10px] opacity-80">
            {CITY_CONTEXTS[city].nativeGreeting}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {isSpeaking && <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div></div>}
            <p className={`text-white font-medium text-xs transition-opacity duration-300 ${isSpeaking ? 'opacity-100' : 'opacity-60'}`}>
              {isSpeaking ? 'Local is speaking...' : status}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/20 text-rose-200 px-6 py-4 rounded-3xl text-sm mt-8 border border-rose-500/30 backdrop-blur-md animate-bounce">
          {error}
        </div>
      )}

      <div className="absolute bottom-12 inset-x-8 z-10 flex flex-col items-center gap-6">
        {!isConnecting && !isSpeaking && (
          <p className="text-white/40 text-sm font-medium animate-pulse">Go ahead, talk to me boss...</p>
        )}
        <button 
          onClick={onClose}
          className="w-full max-w-xs py-5 rounded-[24px] bg-white text-slate-900 font-extrabold text-xs uppercase tracking-widest hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl"
        >
          End Conversation
        </button>
      </div>
    </div>
  );
};
