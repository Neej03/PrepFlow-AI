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
import { ProcessedMaterial, AppStats } from '@/types';
import { motion } from 'framer-motion';

interface DashboardOverviewProps {
  onOpenUpload: () => void;
  onTryDemo: () => void;
  recentMaterials: ProcessedMaterial[];
  stats: AppStats;
  onSelectMaterial: (material: ProcessedMaterial) => void;
  onStartQuiz: (material: ProcessedMaterial) => void;
  onDeleteMaterial: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onOpenUpload,
  onTryDemo,
  recentMaterials,
  stats,
  onSelectMaterial,
  onStartQuiz,
  onDeleteMaterial,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>PrepFlow AI • Exam Preparation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Turn your study material into <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">exam-ready knowledge.</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Upload your lecture slides or text, and let PrepFlow AI transform busywork into structured revision notes and a personalized 5-question practice quiz in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center space-x-2.5 transform hover:-translate-y-0.5"
            >
              <UploadCloud className="w-5 h-5 text-white" />
              <span>Upload Lecture Material</span>
            </button>

            <button
              onClick={onTryDemo}
              className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center space-x-2 hover:border-slate-600"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>See How It Works (Try Demo)</span>
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
        className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/80 p-8 sm:p-12 text-center transition-all duration-300 shadow-lg"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600/10 group-hover:bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
          <UploadCloud className="w-8 h-8 text-indigo-400" />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-1">
          Drag & Drop your lecture material here
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
          Upload PDF, DOCX, PPTX, or TXT files. PrepFlow AI will automatically generate structured notes & a 5-question practice quiz.
        </p>

        {/* Supported Formats Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {['PDF', 'DOCX', 'PPTX', 'TXT'].map((fmt) => (
            <span
              key={fmt}
              className="px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 text-xs font-semibold tracking-wider"
            >
              {fmt}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.materialsProcessed}</div>
            <div className="text-xs font-medium text-slate-400">Materials Processed</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.quizzesCompleted}</div>
            <div className="text-xs font-medium text-slate-400">Quizzes Completed</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">
              {stats.averageScorePercentage > 0 ? `${stats.averageScorePercentage}%` : 'N/A'}
            </div>
            <div className="text-xs font-medium text-slate-400">Average Quiz Score</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{stats.totalStudyMinutes}m</div>
            <div className="text-xs font-medium text-slate-400">Estimated Study Time</div>
          </div>
        </div>
      </div>

      {/* Recent Materials Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Recent Study Materials</h2>
            <p className="text-xs text-slate-400">Your processed lectures, revision notes, and quizzes</p>
          </div>
        </div>

        {recentMaterials.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-semibold">No materials processed yet</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Upload your first study document or click "Try Demo" to generate instant notes and a practice quiz.
            </p>
            <button
              onClick={onTryDemo}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold inline-flex items-center space-x-1.5 hover:bg-indigo-600/30 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {item.personalization.subject}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMaterial(item.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 transition p-1"
                        title="Delete material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-300 transition">
                      {item.notes.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.notes.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    {quizScore ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Score: {quizScore.scorePercentage}%
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Quiz Pending</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectMaterial(item)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Notes</span>
                    </button>
                    <button
                      onClick={() => onStartQuiz(item)}
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-sm"
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
