'use client';

import React, { useEffect } from 'react';
import { 
  Award, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle
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
      return { label: 'EXAM READY', color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' };
    }
    if (scorePercentage >= 60) {
      return { label: 'PROFICIENT', color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30' };
    }
    return { label: 'NEEDS REVISION', color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' };
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Score Banner Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Quiz Performance Report</span>
        </div>

        <div className="space-y-2">
          <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {scorePercentage}%
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold text-sm sm:text-base">
            You answered <span className="text-slate-900 dark:text-white font-extrabold">{correctAnswers} out of {totalQuestions}</span> questions correctly.
          </p>
        </div>

        <div className="flex justify-center">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${badgeStyle.color}`}>
            {badgeStyle.label}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium max-w-lg mx-auto bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          {feedbackSummary}
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={onRetryQuiz}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onBackToNotes}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-2 transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Review Revision Notes</span>
          </button>
        </div>
      </motion.div>

      {/* Weak Topics & Recommendations Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weak Topics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-sm font-black text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Weak Topics to Review</span>
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">No weak topics detected! Perfect score.</p>
          ) : (
            <ul className="space-y-2">
              {weakTopics.map((topic, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-950 border border-amber-200/60 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>{topic}</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">REVISE</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Strong Topics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-md">
          <div className="flex items-center space-x-2 text-sm font-black text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered Concepts</span>
          </div>
          {strongTopics.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review your answers below to strengthen topic mastery.</p>
          ) : (
            <ul className="space-y-2">
              {strongTopics.map((topic, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-950 border border-emerald-200/60 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                  <span>{topic}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">MASTERED</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Per-Question Detailed Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
                    ? 'bg-slate-50/60 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800'
                    : 'bg-rose-50/30 dark:bg-slate-950/80 border-rose-200 dark:border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Question {idx + 1}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {q.topicTag}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-extrabold text-slate-900 dark:text-white">{q.question}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Your Answer Box */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Your Answer:</span>
                    <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-black text-xs sm:text-sm' : 'text-rose-700 dark:text-rose-400 font-black text-xs sm:text-sm'}>
                      {userSelection}
                    </span>
                  </div>

                  {/* Correct Answer Box */}
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Correct Answer:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs sm:text-sm">
                      {q.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Explanation Box */}
                <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/20 text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-400">Explanation: </span>
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
