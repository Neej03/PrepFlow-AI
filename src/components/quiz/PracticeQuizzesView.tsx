'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Play, 
  Sparkles, 
  Zap, 
  BookOpen,
  Loader2
} from 'lucide-react';
import { ProcessedMaterial, QuizSet } from '@/types';
import { motion } from 'framer-motion';

interface PracticeQuizzesViewProps {
  materials: ProcessedMaterial[];
  currentMaterial: ProcessedMaterial | null;
  onSelectQuizSet: (quizSet: QuizSet, material: ProcessedMaterial) => void;
  onOpenUpload: () => void;
  onGenerateNewRandomQuiz: (material: ProcessedMaterial) => Promise<QuizSet | null>;
}

export const PracticeQuizzesView: React.FC<PracticeQuizzesViewProps> = ({
  materials,
  currentMaterial,
  onSelectQuizSet,
  onOpenUpload,
  onGenerateNewRandomQuiz,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    currentMaterial?.id || materials[0]?.id || ''
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const activeMaterial = materials.find((m) => m.id === selectedMaterialId) || currentMaterial;

  const quizSets: QuizSet[] = activeMaterial?.quizSets || [
    {
      id: 'default_quiz_1',
      title: 'Quiz 1: Core Fundamentals',
      difficulty: 'Core Principles',
      questions: activeMaterial?.quiz || []
    }
  ];

  const handleGenerateRandom = async () => {
    if (!activeMaterial) return;
    setIsGenerating(true);
    try {
      const newQuiz = await onGenerateNewRandomQuiz(activeMaterial);
      if (newQuiz) {
        onSelectQuizSet(newQuiz, activeMaterial);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Practice Quiz Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Practice Quizzes</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Select pre-generated quiz sets or randomly generate new quiz challenges</p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Upload New Lecture</span>
        </button>
      </div>

      {materials.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <HelpCircle className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white">No Practice Quizzes Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto font-semibold">
            Upload your lecture material or load the demo to automatically generate 3 practice quiz sets!
          </p>
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Upload Material Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Material Selector Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-200">Active Study Document:</span>
            </div>

            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500 min-w-[260px] cursor-pointer"
            >
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.notes.title} ({m.personalization.subject})
                </option>
              ))}
            </select>
          </div>

          {/* Practice Quiz Sets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {quizSets.map((qs) => (
              <motion.div
                key={qs.id}
                whileHover={{ y: -3 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between space-y-4 shadow-md group relative overflow-hidden"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      {qs.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-extrabold">5 Qs</span>
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">
                    {qs.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                    {qs.difficulty === 'Core Principles'
                      ? 'Fundamental concepts, definitions, and core formulas.'
                      : qs.difficulty === 'Applied Knowledge'
                      ? 'Scenario applications, problem-solving derivations, and trade-offs.'
                      : qs.difficulty === 'Exam Challenge'
                      ? 'High-difficulty exam derivations and advanced analytical topics.'
                      : 'Randomized 5-question exam sprint.'}
                  </p>
                </div>

                <button
                  onClick={() => activeMaterial && onSelectQuizSet(qs, activeMaterial)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition shadow-md shadow-indigo-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Practice Quiz</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Random Quiz Generation Banner */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left max-w-lg">
              <div className="inline-flex items-center space-x-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>RANDOMIZED QUIZ GENERATOR</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Need more practice questions?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                Generate a brand-new, randomized 5-question quiz from <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{activeMaterial?.notes.title}</span> using Gemini AI!
              </p>
            </div>

            <button
              onClick={handleGenerateRandom}
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition shrink-0 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Random Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>🎲 Generate New Random Quiz</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
