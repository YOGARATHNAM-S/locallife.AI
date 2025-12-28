
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, City, AppMode } from '../types';
import { saveMessage, getHistory, clearHistory } from '../services/db';
import { generateLocalResponse, generateCityVisuals } from '../services/gemini';
import { CITY_CONTEXTS } from '../data/cityContexts';
import { Logo } from './Logo';

interface Props {
  city: City;
  mode: AppMode;
}

interface ExtendedChatMessage extends ChatMessage {
  sources?: { title: string; uri: string; type?: string }[];
}

export const ChatInterface: React.FC<Props> = ({ city, mode }) => {
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visualUrl, setVisualUrl] = useState<string | null>(null);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
    setVisualUrl(null);
  }, [city, mode]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading, visualUrl]);

  const loadHistory = async () => {
    const history = await getHistory(city, mode);
    setMessages(history);
  };

  const handleSend = async (e?: React.FormEvent, customPrompt?: string) => {
    e?.preventDefault();
    const promptValue = customPrompt || input;
    if (!promptValue.trim() || isLoading) return;

    const userMsg: ExtendedChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptValue,
      timestamp: Date.now(),
      city,
      mode
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);
    await saveMessage(userMsg);

    try {
      const historyForAI = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const result = await generateLocalResponse(city, mode, promptValue, historyForAI);
      
      const assistantMsg: ExtendedChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.text || "I'm having trouble connecting to the street right now. Try again in a bit?",
        timestamp: Date.now(),
        city,
        mode,
        sources: result.sources
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      await saveMessage(assistantMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVisual = async () => {
    setIsGeneratingVisual(true);
    try {
      const url = await generateCityVisuals(city);
      setVisualUrl(url);
    } catch (err) {
      console.error("Failed to generate visuals", err);
    } finally {
      setIsGeneratingVisual(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Wipe this session history?')) {
      await clearHistory(city, mode);
      setMessages([]);
    }
  };

  const getEmptyStateText = () => {
    switch(mode) {
      case AppMode.FOOD: return `Hungry in ${CITY_CONTEXTS[city].name}? Ask me where the real locals eat.`;
      case AppMode.SLANG: return `Let's decode the ${CITY_CONTEXTS[city].name} street lingo together.`;
      case AppMode.TRAFFIC: return `Traffic in ${CITY_CONTEXTS[city].name} is a beast. I'll help you tame it.`;
      case AppMode.CULTURE: return `What makes ${CITY_CONTEXTS[city].name} tick? Ask about the soul of the city.`;
      default: return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-300">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-10"
      >
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-7 modern-card relative overflow-hidden group transition-colors duration-300">
          <div className="absolute top-[-20px] right-[-20px] p-10 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
             <Logo size={160} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">{CITY_CONTEXTS[city].name} Local</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Active Intelligence</p>
                </div>
              </div>
              <button 
                onClick={handleClear}
                className="p-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            {!visualUrl && !isGeneratingVisual && (
              <button 
                onClick={handleGenerateVisual}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Visualize City Aura
              </button>
            )}

            {isGeneratingVisual && (
              <div className="w-full aspect-video bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-colors">
                <div className="w-10 h-10 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse transition-colors">Rendering Vibe...</p>
              </div>
            )}

            {visualUrl && (
              <div className="rounded-3xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-900 group">
                <img 
                  src={visualUrl} 
                  alt={`${city} visual`} 
                  className="w-full object-cover aspect-video hover:scale-105 transition-transform duration-1000" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {messages.length === 0 && !isGeneratingVisual && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-700">
            <div className="mb-8 relative float-icon">
              <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-950/40 blur-3xl rounded-full scale-150 transition-colors"></div>
              <Logo size={90} />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight font-display transition-colors">Start the Convo</h4>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed font-medium transition-colors">
              {getEmptyStateText()}
            </p>
          </div>
        )}

        {/* Message Thread */}
        <div className="space-y-12">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-8 duration-500`}
            >
              <div className={`
                max-w-[92%] px-6 py-4.5 text-[15px] font-medium leading-relaxed
                ${m.role === 'user' 
                  ? 'chat-bubble-me' 
                  : 'chat-bubble-ai'}
              `}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 transition-colors">
                    {m.sources.map((s, i) => (
                      <a 
                        key={i} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`text-[10px] font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm border ${
                          s.type === 'maps' 
                            ? 'bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-500 dark:border-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-600 hover:translate-y-[-2px]' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:translate-y-[-2px]'
                        }`}
                      >
                        {s.type === 'maps' ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            View on Map
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Explore Source
                          </>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-3 px-2">
                 <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${m.role === 'user' ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {m.role === 'user' ? 'CITIZEN' : 'LOCAL ENGINE'}
                 </span>
                 <span className="text-slate-200 dark:text-slate-800">•</span>
                 <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>
          ))}
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-4 px-2">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0s]"></div>
              <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]"></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse transition-colors">Consulting the streets...</span>
          </div>
        )}
      </div>

      {/* Re-sized Premium Input Bar */}
      <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100/60 dark:border-slate-800/60 shadow-[0_-10px_40px_-15px_rgba(15,23,42,0.05)] dark:shadow-none transition-colors duration-300">
        <form onSubmit={handleSend} className="relative group max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask a ${CITY_CONTEXTS[city].name} local expert...`}
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-[24px] pl-7 pr-16 py-6 text-[16px] font-semibold text-slate-900 dark:text-white focus:ring-[15px] focus:ring-indigo-500/5 dark:focus:ring-indigo-500/10 focus:border-indigo-400 dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-lg active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
