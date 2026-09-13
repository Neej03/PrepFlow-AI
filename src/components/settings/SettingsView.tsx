'use client';

import React, { useState } from 'react';
import { Key, Eye, EyeOff, Save, Check, Trash2, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { UserSettings, Subject, StudyLevel, StudyGoal } from '@/types';

interface SettingsViewProps {
  settings: UserSettings;
  onSaveSettings: (newSettings: UserSettings) => void;
  onClearHistory: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onClearHistory,
}) => {
  const [apiKey, setApiKey] = useState(settings.customApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const [defaultSubject, setDefaultSubject] = useState<Subject>(settings.defaultSubject || 'Computer Science');
  const [defaultStudyLevel, setDefaultStudyLevel] = useState<StudyLevel>(settings.defaultStudyLevel || 'Intermediate');
  const [defaultStudyGoal, setDefaultStudyGoal] = useState<StudyGoal>(settings.defaultStudyGoal || 'Exam Preparation');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      customApiKey: apiKey,
      defaultSubject,
      defaultStudyLevel,
      defaultStudyGoal,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-400">Configure AI provider API keys, preferences, and local storage</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gemini API Key Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-sm font-bold text-indigo-400">
            <Key className="w-4 h-4" />
            <span>Gemini API Key Configuration</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The workspace defaults to the server-side environment key (<code className="text-indigo-300 bg-slate-950 px-1.5 py-0.5 rounded">GEMINI_API_KEY</code>). You may optionally provide a personal Gemini API Key below to use your own quota.
          </p>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Keys are stored strictly in your local browser storage and never logged.</span>
          </div>
        </div>

        {/* Default Personalization Defaults */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-sm font-bold text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <span>Default Study Personalization</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Subject</label>
              <select
                value={defaultSubject}
                onChange={(e) => setDefaultSubject(e.target.value as Subject)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Level</label>
              <select
                value={defaultStudyLevel}
                onChange={(e) => setDefaultStudyLevel(e.target.value as StudyLevel)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Default Goal</label>
              <select
                value={defaultStudyGoal}
                onChange={(e) => setDefaultStudyGoal(e.target.value as StudyGoal)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="Quick Revision">Quick Revision</option>
                <option value="Exam Preparation">Exam Preparation</option>
                <option value="Deep Understanding">Deep Understanding</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClearHistory}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 flex items-center space-x-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved Materials</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-indigo-600/30"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
