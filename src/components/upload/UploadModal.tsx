'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  BookOpen, 
  Target, 
  Layers, 
  AlertCircle,
  FileCheck,
  Check,
  Globe
} from 'lucide-react';
import { Subject, StudyLevel, StudyGoal, PersonalizationSettings, AppLanguage } from '@/types';
import { t, SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitUpload: (
    file: File | null,
    text: string,
    personalization: PersonalizationSettings,
    customApiKey?: string
  ) => void;
  savedApiKey?: string;
  currentLanguage?: AppLanguage;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSubmitUpload,
  savedApiKey = '',
  currentLanguage = 'en',
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [subject, setSubject] = useState<Subject>('Computer Science');
  const [studyLevel, setStudyLevel] = useState<StudyLevel>('Intermediate');
  const [studyGoal, setStudyGoal] = useState<StudyGoal>('Exam Preparation');
  const [language, setLanguage] = useState<AppLanguage>(currentLanguage);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

  if (!isOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'txt'];

    if (!ext || !validExts.includes(ext)) {
      setErrorMsg('Unsupported file format. Please upload a PDF, DOCX, PPTX, or TXT document.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('File size exceeds 20MB limit. Please upload a smaller document.');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'file' && !selectedFile) {
      setErrorMsg('Please select or drag a lecture file to upload.');
      return;
    }

    if (activeTab === 'text' && (!pastedText || pastedText.trim().length < 20)) {
      setErrorMsg('Please paste at least 20 characters of lecture notes or reading material.');
      return;
    }

    onSubmitUpload(
      activeTab === 'file' ? selectedFile : null,
      activeTab === 'text' ? pastedText : '',
      { subject, studyLevel, studyGoal, language }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs shrink-0">
              <Sparkles className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">{t('uploadModalTitle', language)}</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{t('uploadModalSub', language)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close upload modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mode Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                activeTab === 'file'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700 font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('uploadDocTab', language)}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700 font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t('pasteTextTab', language)}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* File Upload Zone */}
          {activeTab === 'file' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
              />
              
              {selectedFile ? (
                /* Selected File Card - Translucent Glass Card with High Contrast Typography */
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-md p-5 shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between gap-4">
                    {/* File Icon & Info */}
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
                        <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-900 dark:text-white text-base truncate tracking-tight">
                            {selectedFile.name}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                            {selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="text-slate-700 dark:text-slate-300">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-emerald-800 dark:text-emerald-400 font-extrabold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
                            <span>{t('readyForAi', language)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-black transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                      title="Remove selected file"
                    >
                      <X className="w-3.5 h-3.5 text-rose-700 dark:text-rose-300" />
                      <span>{t('removeBtn', language)}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Unselected Drag & Drop Area - Translucent Glass Dropzone */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-indigo-300/80 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 dark:bg-slate-950/40 dark:hover:bg-slate-950/60 backdrop-blur-sm p-8 text-center transition group shadow-xs hover:shadow-md"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3 shadow-xs">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="font-black text-slate-900 dark:text-white text-base tracking-tight mb-1">
                    {t('dragDropText', language)}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                    {t('supportsText', language)}
                  </div>

                  {/* Format Badges */}
                  <div className="flex items-center justify-center space-x-2">
                    {['PDF', 'DOCX', 'PPTX', 'TXT'].map((ext) => (
                      <span key={ext} className="text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs backdrop-blur-xs">
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={t('pastePlaceholder', language)}
                className="w-full h-44 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none font-mono font-medium shadow-xs transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}

          {/* AI Personalization Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('aiSettings', language)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('subjectLabel', language)}</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Study Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('studyLevelLabel', language)}</span>
                </label>
                <select
                  value={studyLevel}
                  onChange={(e) => setStudyLevel(e.target.value as StudyLevel)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              {/* Study Goal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('studyGoalLabel', language)}</span>
                </label>
                <select
                  value={studyGoal}
                  onChange={(e) => setStudyGoal(e.target.value as StudyGoal)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                >
                  <option value="Quick Revision">Quick Revision</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Deep Understanding">Deep Understanding</option>
                </select>
              </div>

              {/* Target Language */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{t('targetLangLabel', language)}</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {t('cancelBtn', language)}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white">{t('generateBtn', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
