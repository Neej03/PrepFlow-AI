'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette, Moon, Sun, Sparkles, Leaf, Gem, Check } from 'lucide-react';
import { AppTheme } from '@/types';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelectTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: { id: AppTheme; name: string; icon: React.ElementType; bgPreview: string; activeColor: string; label: string }[] = [
    {
      id: 'light',
      name: 'Academic Light',
      icon: Sun,
      bgPreview: 'bg-white border-slate-300',
      activeColor: 'text-amber-500',
      label: 'Clean & Crisp',
    },
    {
      id: 'dark',
      name: 'Dark Obsidian',
      icon: Moon,
      bgPreview: 'bg-slate-950 border-slate-700',
      activeColor: 'text-indigo-400',
      label: 'Luxurious Midnight',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      icon: Sparkles,
      bgPreview: 'bg-purple-950 border-cyan-500',
      activeColor: 'text-cyan-400',
      label: 'Futuristic Vibe',
    },
    {
      id: 'emerald',
      name: 'Emerald Scholar',
      icon: Leaf,
      bgPreview: 'bg-emerald-950 border-emerald-500',
      activeColor: 'text-emerald-400',
      label: 'Botanical Focus',
    },
    {
      id: 'amethyst',
      name: 'Midnight Amethyst',
      icon: Gem,
      bgPreview: 'bg-fuchsia-950 border-purple-500',
      activeColor: 'text-purple-400',
      label: 'Deep Royal Glow',
    },
  ];

  const currentThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];
  const ActiveIcon = currentThemeObj.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-200 transition-all shadow-sm cursor-pointer"
        title="Switch UI Theme"
      >
        <Palette className={`w-3.5 h-3.5 ${currentThemeObj.activeColor}`} />
        <span className="hidden md:inline">{currentThemeObj.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span>Choose Theme</span>
            <span className="text-[10px] text-indigo-400 font-bold">{themes.length} Themes</span>
          </div>

          <div className="space-y-1">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/25 text-white border border-indigo-500/50 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-4 h-4 rounded-full border ${theme.bgPreview} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-2.5 h-2.5 ${theme.activeColor}`} />
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-xs leading-tight">{theme.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{theme.label}</div>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

