'use client';

import React from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  Zap, 
  FileText, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Trash2, 
  Play
} from 'lucide-react';
import { ProcessedMaterial, AppStats, AppLanguage } from '@/types';
import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';

interface DashboardOverviewProps {
  onOpenUpload: () => void;
  onTryDemo: () => void;
  recentMaterials: ProcessedMaterial[];
  stats: AppStats;
  onSelectMaterial: (material: ProcessedMaterial) => void;
  onStartQuiz: (material: ProcessedMaterial) => void;
  onDeleteMaterial: (id: string) => void;
  currentLanguage?: AppLanguage;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenUpload,
  onTryDemo,
  recentMaterials,
  stats,
  onSelectMaterial,
  onStartQuiz,
  onDeleteMaterial,
  currentLanguage = 'en',
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl"
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>PrepFlow AI • Exam Preparation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Turn your study material into <span className="text-indigo-600 dark:text-indigo-400">exam-ready knowledge.</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-semibold">
            Upload your lecture slides or text, and let PrepFlow AI transform busywork into structured revision notes and a personalized 5-question practice quiz in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2.5 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UploadCloud className="w-5 h-5 text-white" />
              <span>{t('uploadNewLecture', currentLanguage)}</span>
            </button>

            <button
              onClick={onTryDemo}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm transition flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>{t('tryDemo', currentLanguage)}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Drag & Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onClick={onOpenUpload}
        className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 dark:border-slate-800 dark:hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 dark:bg-slate-950/50 dark:hover:bg-slate-950 p-8 sm:p-12 text-center transition-all duration-300 shadow-xs"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
          <UploadCloud className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
          {t('dragDropText', currentLanguage)}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 font-semibold">
          {t('supportsText', currentLanguage)}
        </p>

        {/* Supported Formats Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {['PDF', 'DOCX', 'PPTX', 'TXT'].map((fmt) => (
            <span
              key={fmt}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-black tracking-wider"
            >
              {fmt}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.materialsProcessed}</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('materialsAnalyzed', currentLanguage)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.quizzesCompleted}</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('quizzesCompleted', currentLanguage)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.averageScorePercentage > 0 ? `${stats.averageScorePercentage}%` : 'N/A'}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('avgScore', currentLanguage)}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalStudyMinutes}m</div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Estimated Study Time</div>
          </div>
        </div>
      </div>

      {/* Recent Materials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recent Study Materials</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Your processed lectures, revision notes, and quizzes</p>
          </div>
        </div>

        {recentMaterials.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-xs">
            <FileText className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <div className="text-slate-900 dark:text-slate-200 font-black">No materials processed yet</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-semibold">
              Upload your first study document or click "Try Demo" to generate instant notes and a practice quiz.
            </p>
            <button
              onClick={onTryDemo}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 text-xs font-bold inline-flex items-center space-x-1.5 hover:bg-indigo-100 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Load Demo Lecture</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((item) => {
              const quizScore = item.latestQuizResult;

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -2 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4 group shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                        {item.personalization.subject}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMaterial(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer"
                        title="Delete material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-black text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                      {item.notes.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-semibold">
                      {item.notes.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {quizScore ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        Score: {quizScore.scorePercentage}%
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 font-semibold italic">Quiz Pending</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectMaterial(item)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 transition border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Notes</span>
                    </button>
                    <button
                      onClick={() => onStartQuiz(item)}
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Quiz</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
