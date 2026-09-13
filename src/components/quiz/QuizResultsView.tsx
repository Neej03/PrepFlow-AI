'use client';

import React, { useEffect } from 'react';
import { 
  Award, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Download,
  Share2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { QuizResult, QuizQuestion } from '@/types';
import { motion } from 'framer-motion';

interface QuizResultsViewProps {
  result: QuizResult;
  questions: QuizQuestion[];
  materialTitle: string;
  onRetryQuiz: () => void;
  onBackToNotes: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  result,
  questions,
  materialTitle,
  onRetryQuiz,
  onBackToNotes,
}) => {
  const { scorePercentage, correctAnswers, totalQuestions, weakTopics, strongTopics, feedbackSummary } = result;

  useEffect(() => {
    if (scorePercentage >= 80) {
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    }
  }, [scorePercentage]);

  const getBadgeStyle = () => {
    if (scorePercentage >= 80) {
      return { label: 'EXAM READY', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
    if (scorePercentage >= 60) {
      return { label: 'PROFICIENT', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
    }
    return { label: 'NEEDS REVISION', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Score Banner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Quiz Performance Report</span>
        </div>

        <div className="space-y-2">
          <div className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            {scorePercentage}%
          </div>
          <p className="text-slate-300 font-medium text-sm sm:text-base">
            You answered <span className="text-white font-bold">{correctAnswers} out of {totalQuestions}</span> questions correctly.
          </p>
        </div>

        <div className="flex justify-center">
          <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border ${badgeStyle.color}`}>
            {badgeStyle.label}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          {feedbackSummary}
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={onRetryQuiz}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onBackToNotes}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center space-x-2 transition"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Review Revision Notes</span>
          </button>
        </div>
      </motion.div>

      {/* Weak Topics & Recommendations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weak Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-sm font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Weak Topics to Review</span>
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-xs text-emerald-400 font-medium">No weak topics detected! Perfect score.</p>
          ) : (
            <ul className="space-y-2">
              {weakTopics.map((topic, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{topic}</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">REVISE</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Strong Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-sm font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered Concepts</span>
          </div>
          {strongTopics.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">Review your answers below to strengthen topic mastery.</p>
          ) : (
            <ul className="space-y-2">
              {strongTopics.map((topic, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>{topic}</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">MASTERED</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Per-Question Detailed Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Detailed Answer Review</span>
        </h2>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnsObj = result.answers.find((a) => a.questionId === q.id);
            const userSelection = userAnsObj?.selectedOption || 'No answer submitted';
            const isCorrect = userAnsObj?.isCorrect;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border space-y-3 transition ${
                  isCorrect
                    ? 'bg-slate-950/50 border-slate-800'
                    : 'bg-slate-950/80 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {q.topicTag}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-100">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 font-semibold block mb-0.5">Your Answer:</span>
                    <span className={isCorrect ? 'text-emerald-300 font-medium' : 'text-rose-300 font-medium'}>
                      {userSelection}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 font-semibold block mb-0.5">Correct Answer:</span>
                    <span className="text-emerald-300 font-medium">{q.correctAnswer}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-indigo-300">Explanation: </span>
                  {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
