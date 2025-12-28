
import React from 'react';
import { Logo } from './Logo';

interface Props {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Layout: React.FC<Props> = ({ children, theme, onToggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto bg-white dark:bg-slate-900 modern-card relative overflow-hidden transition-colors duration-300">
      <header className="sticky top-0 z-40 glass-panel px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 nav-glow">
        <div className="flex items-center gap-4">
          <Logo size={40} className="hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none font-display">
              LocalLife<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
            </h1>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mt-1 opacity-70">
              STREET INTELLIGENCE
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* GitHub Link */}
          <a 
            href="https://github.com/YOGARATHNAM-S/locallife.AI.git" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="View Source on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>

          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50/10 dark:bg-slate-900/10">
        {children}
      </main>

      <footer className="py-4 px-8 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Version 3.2.1 • Secured
        </span>
        <div className="flex gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </footer>
    </div>
  );
};
