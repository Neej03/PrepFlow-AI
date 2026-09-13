'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { AppTheme, AppLanguage } from '@/types';
import { t } from '@/lib/i18n';

interface NavbarProps {
  onOpenUpload: () => void;
  onTryDemo: () => void;
  hasCustomKey: boolean;
  activeView: string;
  avgScore?: number;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  currentLanguage: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onTryDemo,
  hasCustomKey,
  activeView,
  avgScore = 0,
  currentTheme,
  onSelectTheme,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 px-4 lg:px-8 py-3 flex items-center justify-between transition-all shadow-sm">
      {/* Brand Logo & Name */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
        <div className="relative group">
          <img 
            src="/logo.png" 
            alt="PrepFlow AI Logo" 
            className="h-10 w-10 rounded-xl object-cover border border-indigo-500/40 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform" 
          />
          <div className="absolute inset-0 rounded-xl bg-indigo-500/20 blur-md pointer-events-none group-hover:bg-indigo-500/30 transition-all" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
              PrepFlow<span className="text-indigo-600 dark:text-indigo-400 font-bold ml-0.5">AI</span>
            </span>
            <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shadow-xs">
              PRO
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:block">
            {t('welcomeSub', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Fixed Anchor Workspace Score Badge */}
      <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 flex items-center justify-center font-extrabold text-xs text-indigo-700 dark:text-indigo-300 overflow-hidden shrink-0">
          <img src="/logo.png" alt="PrepFlow AI Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="text-left">
          <div className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{t('workspace', currentLanguage)}</div>
          <div className="text-[11px] font-bold text-indigo-600 dark:text-sky-400">
            {t('avgScore', currentLanguage)}: {mounted ? (avgScore > 0 ? `${avgScore}%` : '53%') : '53%'}
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <LanguageSelector currentLanguage={currentLanguage} onSelectLanguage={onSelectLanguage} />

        {/* Theme Selector */}
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={onSelectTheme} />

        {/* Try Demo CTA */}
        <button
          onClick={onTryDemo}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <span>{t('tryDemo', currentLanguage)}</span>
        </button>

        {/* Primary CTA */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="hidden xs:inline">{t('uploadNewLecture', currentLanguage)}</span>
          <span className="xs:hidden">{t('uploadBtn', currentLanguage)}</span>
        </button>
      </div>
    </header>
  );
};
