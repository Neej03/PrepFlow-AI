'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  materialsCount: number;
  avgScore: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  materialsCount,
  avgScore,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Material', icon: UploadCloud, action: onOpenUpload },
    { id: 'history', label: 'My Materials', icon: BookOpen, badge: materialsCount ? String(materialsCount) : undefined },
    { id: 'quizzes', label: 'Practice Quizzes', icon: HelpCircle },
    { id: 'progress', label: 'Progress Analytics', icon: TrendingUp },
  ];

  return (
    <aside className="sticky top-0 h-[calc(100vh-65px)] w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 flex flex-col justify-between hidden md:flex shrink-0 p-4 self-start z-20 overflow-y-auto shadow-xs">
      <div className="space-y-6">
        {/* Fixed PrepFlow AI Workflow Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>PREPFLOW AI WORKFLOW</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
            Transform slides into notes & 5-question quizzes in seconds.
          </p>
          <button
            onClick={onOpenUpload}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-600/30 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Lecture</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <div className="px-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/40 shadow-xs font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
