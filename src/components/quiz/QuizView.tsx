'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  BookOpen
} from 'lucide-react';
import { QuizQuestion, UserAnswer, QuizResult } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizViewProps {
  questions: QuizQuestion[];
  materialTitle: string;
  onCompleteQuiz: (result: QuizResult) => void;
  onBackToNotes: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  materialTitle,
  onCompleteQuiz,
  onBackToNotes,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const isMcqOrTf = currentQuestion.type === 'mcq' || currentQuestion.type === 'true_false';

  const selectedAnswer = isMcqOrTf
    ? answers[currentQuestion.id] || ''
    : shortAnswers[currentQuestion.id] || '';

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleTextChange = (text: string) => {
    setShortAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    const finalAnswers: UserAnswer[] = [];
    const weakTopicSet = new Set<string>();
    const strongTopicSet = new Set<string>();

    questions.forEach((q) => {
      const userAns = q.type === 'short_answer'
        ? (shortAnswers[q.id] || '').trim()
        : answers[q.id] || '';

      let isCorrect = false;
      if (q.type === 'mcq' || q.type === 'true_false') {
        isCorrect = userAns.toLowerCase().startsWith(q.correctAnswer.charAt(0).toLowerCase()) ||
                    userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
      } else {
        isCorrect = userAns.length > 10;
      }

      if (isCorrect) {
        correctCount++;
        strongTopicSet.add(q.topicTag);
      } else {
        weakTopicSet.add(q.topicTag);
      }

      finalAnswers.push({
        questionId: q.id,
        selectedOption: userAns,
        isCorrect,
      });
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      answers: finalAnswers,
      weakTopics: Array.from(weakTopicSet),
      strongTopics: Array.from(strongTopicSet),
      feedbackSummary:
        scorePct >= 80
          ? 'Outstanding mastery of lecture topics! You are exam-ready.'
          : scorePct >= 60
          ? 'Good understanding of core principles. Review weak topics to push score higher.'
          : 'Further revision recommended before taking the final exam.',
      completedAt: new Date().toISOString(),
    };

    onCompleteQuiz(result);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Quiz Header & Progress */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToNotes}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center space-x-1.5 font-bold transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Back to Notes</span>
          </button>
          <div className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>5-Question AI Practice Quiz</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-900 dark:text-slate-300">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
              {currentQuestion.topicTag}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {/* Question Text */}
          <div className="space-y-2">
            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {currentQuestion.type === 'mcq'
                ? 'Multiple Choice'
                : currentQuestion.type === 'true_false'
                ? 'True / False'
                : 'Short Answer / Conceptual'}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          {isMcqOrTf ? (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((option, idx) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-2xl text-left text-xs sm:text-sm font-bold transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs font-black'
                        : 'bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-950/60 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span>{option}</span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-transparent'
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Type your answer / explanation below:
              </label>
              <textarea
                value={selectedAnswer}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Write your explanation or answer..."
                className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 resize-none font-medium"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                currentIndex === 0
                  ? 'text-slate-400 bg-slate-100 dark:bg-slate-950 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                  : 'text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition shadow-md ${
                !selectedAnswer
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transform hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              <span>{isLastQuestion ? 'Submit Quiz' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
