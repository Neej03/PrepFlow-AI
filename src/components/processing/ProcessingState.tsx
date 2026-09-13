'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, BookOpen, Brain, HelpCircle, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessingStateProps {
  fileName?: string;
}

const STEPS = [
  { id: 1, label: 'Reading your material...', icon: BookOpen, detail: 'Parsing document structure & extracting raw text' },
  { id: 2, label: 'Understanding key concepts...', icon: Brain, detail: 'Prioritizing high-probability exam concepts & definitions' },
  { id: 3, label: 'Creating revision notes...', icon: FileCheck, detail: 'Structuring bullet explanations, formulas, and examples' },
  { id: 4, label: 'Generating practice questions...', icon: HelpCircle, detail: 'Constructing 5 targeted MCQ, True/False, and short-answer questions' },
];

const STUDY_TIPS = [
  "Tip: Spaced repetition within 24 hours increases long-term retention by 80%.",
  "Tip: Focus on HIGH priority concepts first for maximum exam score impact.",
  "Tip: Reviewing explanations after quiz completion reinforces conceptual mastery.",
  "Tip: You can export your structured notes directly to PDF for offline study."
];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ fileName }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 2200);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % STUDY_TIPS.length);
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 max-w-2xl mx-auto text-center space-y-8">
      {/* Glowing Orb Animation */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 animate-pulse flex items-center justify-center shadow-2xl shadow-indigo-500/50">
          <Sparkles className="w-12 h-12 text-white animate-spin-slow" />
        </div>
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none" />
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Analysis in Progress
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
          Processing <span className="font-semibold text-indigo-300">{fileName || 'your study document'}</span> with Gemini AI...
        </p>
      </div>

      {/* Step-by-Step Progress List */}
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 text-left shadow-xl">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-4 p-3.5 rounded-2xl transition-all ${
                isCurrent
                  ? 'bg-indigo-600/15 border border-indigo-500/30'
                  : isDone
                  ? 'bg-slate-950/40 opacity-80'
                  : 'opacity-40'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold ${isCurrent ? 'text-indigo-200' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                  {step.label}
                </div>
                <div className="text-xs text-slate-400 font-normal mt-0.5 truncate">
                  {step.detail}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Study Tips */}
      <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-indigo-300/80 bg-indigo-950/40 px-4 py-2 rounded-full border border-indigo-500/20 font-medium"
          >
            {STUDY_TIPS[tipIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
