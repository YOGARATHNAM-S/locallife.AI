
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { VoiceOverlay } from './components/VoiceOverlay';
import { City, AppMode } from './types';
import { getSetting, saveSetting } from './services/db';
import { CITY_CONTEXTS } from './data/cityContexts';

const App: React.FC = () => {
  const [city, setCity] = useState<City>(City.CHENNAI);
  const [mode, setMode] = useState<AppMode>(AppMode.FOOD);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const savedCity = await getSetting('city');
      const savedMode = await getSetting('mode');
      const savedTheme = await getSetting('theme');
      
      if (savedCity) setCity(savedCity);
      if (savedMode) setMode(savedMode);
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
        applyTheme(initialTheme);
      }
      setIsReady(true);
    };
    loadSettings();
  }, []);

  const applyTheme = (t: 'light' | 'dark') => {
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    saveSetting('theme', newTheme);
  };

  const handleCityChange = (newCity: City) => {
    setCity(newCity);
    saveSetting('city', newCity);
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    saveSetting('mode', newMode);
  };

  if (!isReady) return null;

  return (
    <Layout theme={theme} onToggleTheme={toggleTheme}>
      {/* Dynamic Control Deck */}
      <div className="px-6 py-6 space-y-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                Current Locale
              </label>
              <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md transition-colors">
                {Object.keys(CITY_CONTEXTS).length} Cities Available
              </span>
            </div>
            <div className="relative group">
              <select 
                value={city}
                onChange={(e) => handleCityChange(e.target.value as City)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl px-6 py-4.5 text-[15px] font-bold text-slate-900 dark:text-white focus:ring-8 focus:ring-indigo-500/5 outline-none appearance-none cursor-pointer transition-all pr-12"
              >
                {Object.values(CITY_CONTEXTS).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 transition-transform group-hover:translate-y-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Intelligence Focus
            </label>
            <div className="flex bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-2xl gap-1 border border-slate-200/40 dark:border-slate-700/40">
              {Object.values(AppMode).map((m) => (
                <button 
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`flex-1 text-[11px] font-bold py-3.5 rounded-xl transition-all duration-300 transform ${
                    mode === m 
                    ? 'bg-white dark:bg-slate-700 shadow-lg text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200/50 dark:ring-slate-600/50 translate-y-[-2px]' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {m.charAt(0) + m.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChatInterface city={city} mode={mode} />

      {/* Hero Voice Button - Adjusted Position to avoid overlap */}
      <div className="fixed bottom-36 right-8 z-40 sm:right-[calc(50%-13rem)]">
        <button 
          onClick={() => setIsVoiceActive(true)}
          className="group relative w-20 h-20 bg-indigo-600 dark:bg-indigo-500 text-white rounded-[28px] shadow-2xl shadow-indigo-200 dark:shadow-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-500 hover:rotate-3"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-indigo-700 rounded-[28px]"></div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-[28px] transition-opacity"></div>
          
          <svg className="relative z-10 w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-800 rounded-full"></div>
          <div className="absolute inset-[-8px] rounded-[36px] border-2 border-indigo-500/10 animate-ping [animation-duration:3s]"></div>
        </button>
      </div>

      {isVoiceActive && (
        <VoiceOverlay 
          city={city} 
          mode={mode} 
          onClose={() => setIsVoiceActive(false)} 
        />
      )}
    </Layout>
  );
};

export default App;
