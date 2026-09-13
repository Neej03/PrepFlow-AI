'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { UploadModal } from '@/components/upload/UploadModal';
import { ProcessingState } from '@/components/processing/ProcessingState';
import { RevisionNotesView } from '@/components/notes/RevisionNotesView';
import { QuizView } from '@/components/quiz/QuizView';
import { QuizResultsView } from '@/components/quiz/QuizResultsView';
import { PracticeQuizzesView } from '@/components/quiz/PracticeQuizzesView';
import { MaterialHistoryView } from '@/components/history/MaterialHistoryView';
import { ShareModal } from '@/components/common/ShareModal';
import { AIChatbotWidget } from '@/components/chat/AIChatbotWidget';
import { 
  ProcessedMaterial, 
  QuizResult, 
  PersonalizationSettings, 
  UserSettings, 
  AppStats,
  QuizSet,
  QuizQuestion,
  AppTheme,
  AppLanguage
} from '@/types';
import { 
  getSavedMaterials, 
  saveMaterialToHistory, 
  updateMaterialQuizResult, 
  deleteMaterialFromHistory, 
  getAppSettings, 
  saveAppSettings, 
  getAppStats 
} from '@/lib/storage';
import { generateDemoOrFallbackAnalysis } from '@/lib/gemini';
import { BackgroundParticles } from '@/components/common/BackgroundParticles';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  
  const [materials, setMaterials] = useState<ProcessedMaterial[]>([]);
  const [currentMaterial, setCurrentMaterial] = useState<ProcessedMaterial | null>(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizResult, setCurrentQuizResult] = useState<QuizResult | null>(null);

  const [settings, setSettings] = useState<UserSettings>(getAppSettings());
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('light');
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>('en');
  const [stats, setStats] = useState<AppStats>({ materialsProcessed: 0, quizzesCompleted: 0, averageScorePercentage: 0, totalStudyMinutes: 0 });

  const [processingFileName, setProcessingFileName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const saved = getSavedMaterials();
    setMaterials(saved);
    const savedSettings = getAppSettings();
    setSettings(savedSettings);
    const activeTheme = savedSettings.theme || 'light';
    const activeLang = savedSettings.language || 'en';
    setCurrentTheme(activeTheme);
    setCurrentLanguage(activeLang);
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme !== 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStats(getAppStats());
  }, []);

  const handleSelectTheme = (newTheme: AppTheme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme !== 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const updatedSettings = { ...settings, theme: newTheme };
    setSettings(updatedSettings);
    saveAppSettings(updatedSettings);
  };

  const handleSelectLanguage = (newLang: AppLanguage) => {
    setCurrentLanguage(newLang);
    const updatedSettings = { ...settings, language: newLang };
    setSettings(updatedSettings);
    saveAppSettings(updatedSettings);
  };

  const refreshState = () => {
    const saved = getSavedMaterials();
    setMaterials(saved);
    setStats(getAppStats());
  };

  // Demo Workflow Launcher
  const handleTryDemo = async () => {
    setIsUploadOpen(false);
    setErrorMessage('');
    setProcessingFileName('Introduction_to_AI_and_Neural_Networks.pdf');
    setActiveTab('processing');

    setTimeout(async () => {
      try {
        const demoMat = generateDemoOrFallbackAnalysis(
          'Artificial Intelligence and Neural Networks Core Principles',
          'Introduction_to_AI_and_Neural_Networks.pdf',
          'application/pdf',
          { subject: 'Computer Science', studyLevel: 'Intermediate', studyGoal: 'Exam Preparation' }
        );

        saveMaterialToHistory(demoMat);
        setCurrentMaterial(demoMat);
        setCurrentQuizQuestions(demoMat.quiz);
        refreshState();
        setActiveTab('notes');
      } catch (e) {
        setErrorMessage('Failed to generate demo. Please try again.');
        setActiveTab('dashboard');
      }
    }, 4000);
  };

  // File / Text Upload Handler
  const handleUploadSubmit = async (
    file: File | null,
    text: string,
    personalization: PersonalizationSettings,
    customApiKey?: string
  ) => {
    setIsUploadOpen(false);
    setErrorMessage('');
    setProcessingFileName(file ? file.name : 'Pasted_Study_Notes.txt');
    setActiveTab('processing');

    const effectiveApiKey = customApiKey || settings.customApiKey;

    if (customApiKey && customApiKey !== settings.customApiKey) {
      const updated = { ...settings, customApiKey };
      setSettings(updated);
      saveAppSettings(updated);
    }

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('textContent', text);
      }
      formData.append('fileName', file ? file.name : 'Study_Material.txt');
      formData.append('fileType', file ? file.type : 'text/plain');
      formData.append('subject', personalization.subject);
      formData.append('studyLevel', personalization.studyLevel);
      formData.append('studyGoal', personalization.studyGoal);
      if (effectiveApiKey) {
        formData.append('customApiKey', effectiveApiKey);
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.material) {
        saveMaterialToHistory(data.material);
        setCurrentMaterial(data.material);
        setCurrentQuizQuestions(data.material.quiz);
        refreshState();
        setActiveTab('notes');
      } else {
        throw new Error(data.error || 'Failed to process material');
      }
    } catch (err: any) {
      console.warn('Upload API fallback triggered:', err);
      const fallbackMat = generateDemoOrFallbackAnalysis(
        text || 'Uploaded document content',
        file ? file.name : 'Uploaded_Lecture_Notes.pdf',
        file ? file.type : 'application/pdf',
        personalization
      );
      saveMaterialToHistory(fallbackMat);
      setCurrentMaterial(fallbackMat);
      setCurrentQuizQuestions(fallbackMat.quiz);
      refreshState();
      setActiveTab('notes');
    }
  };

  const handleStartQuiz = (mat?: ProcessedMaterial) => {
    const target = mat || currentMaterial;
    if (target) {
      setCurrentMaterial(target);
      setCurrentQuizQuestions(target.quiz);
      setActiveTab('quiz');
    }
  };

  const handleSelectQuizSet = (quizSet: QuizSet, mat: ProcessedMaterial) => {
    setCurrentMaterial(mat);
    setCurrentQuizQuestions(quizSet.questions);
    setActiveTab('quiz');
  };

  const handleGenerateNewRandomQuiz = async (mat: ProcessedMaterial): Promise<QuizSet | null> => {
    try {
      const res = await fetch('/api/quiz/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: mat.rawTextPreview || mat.notes.overview,
          title: mat.notes.title,
          personalization: mat.personalization,
          customApiKey: settings.customApiKey
        })
      });

      const data = await res.json();
      if (data.success && data.quizSet) {
        const updatedQuizSets = [...(mat.quizSets || []), data.quizSet];
        const updatedMat = { ...mat, quizSets: updatedQuizSets };
        saveMaterialToHistory(updatedMat);
        setCurrentMaterial(updatedMat);
        refreshState();
        return data.quizSet;
      }
      return null;
    } catch (e) {
      console.error('Failed to generate random quiz:', e);
      return null;
    }
  };

  const handleCompleteQuiz = (result: QuizResult) => {
    setCurrentQuizResult(result);
    if (currentMaterial) {
      const updated = updateMaterialQuizResult(currentMaterial.id, result);
      if (updated) {
        setCurrentMaterial(updated);
      }
    }
    refreshState();
    setActiveTab('results');
  };

  const handleDeleteMaterial = (id: string) => {
    deleteMaterialFromHistory(id);
    refreshState();
    if (currentMaterial?.id === id) {
      setCurrentMaterial(null);
      setActiveTab('dashboard');
    }
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
  };

  const handleClearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_student_materials_v1');
      localStorage.removeItem('ai_student_stats_v1');
    }
    setMaterials([]);
    setCurrentMaterial(null);
    refreshState();
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Top Navigation Bar with Sticky Fixed PrepFlow Workspace Badge */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onTryDemo={handleTryDemo}
        hasCustomKey={!!settings.customApiKey}
        activeView={activeTab}
        avgScore={stats.averageScorePercentage}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Sidebar (Unmovable & Fixed) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          materialsCount={materials.length}
          avgScore={stats.averageScorePercentage}
          currentLanguage={currentLanguage}
        />

        {/* Main Content Workspace (Isolated Scroll Area) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {errorMessage && (
            <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="text-rose-400 font-bold hover:text-white">✕</button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardOverview
              onOpenUpload={() => setIsUploadOpen(true)}
              onTryDemo={handleTryDemo}
              recentMaterials={materials}
              stats={stats}
              onSelectMaterial={(mat) => {
                setCurrentMaterial(mat);
                setActiveTab('notes');
              }}
              onStartQuiz={handleStartQuiz}
              onDeleteMaterial={handleDeleteMaterial}
            />
          )}

          {activeTab === 'processing' && (
            <ProcessingState fileName={processingFileName} />
          )}

          {activeTab === 'notes' && currentMaterial && (
            <RevisionNotesView
              material={currentMaterial}
              onStartQuiz={() => handleStartQuiz()}
              onRegenerate={() => setIsUploadOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
            />
          )}

          {activeTab === 'quizzes' && (
            <PracticeQuizzesView
              materials={materials}
              currentMaterial={currentMaterial}
              onSelectQuizSet={handleSelectQuizSet}
              onOpenUpload={() => setIsUploadOpen(true)}
              onGenerateNewRandomQuiz={handleGenerateNewRandomQuiz}
            />
          )}

          {activeTab === 'quiz' && currentMaterial && (
            <QuizView
              questions={currentQuizQuestions.length > 0 ? currentQuizQuestions : currentMaterial.quiz}
              materialTitle={currentMaterial.notes.title}
              onCompleteQuiz={handleCompleteQuiz}
              onBackToNotes={() => setActiveTab('notes')}
            />
          )}

          {activeTab === 'results' && currentQuizResult && currentMaterial && (
            <QuizResultsView
              result={currentQuizResult}
              questions={currentQuizQuestions.length > 0 ? currentQuizQuestions : currentMaterial.quiz}
              materialTitle={currentMaterial.notes.title}
              onRetryQuiz={() => setActiveTab('quiz')}
              onBackToNotes={() => setActiveTab('notes')}
            />
          )}

          {activeTab === 'history' && (
            <MaterialHistoryView
              materials={materials}
              onSelectMaterial={(mat) => {
                setCurrentMaterial(mat);
                setActiveTab('notes');
              }}
              onStartQuiz={handleStartQuiz}
              onDeleteMaterial={handleDeleteMaterial}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {activeTab === 'progress' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h1 className="text-2xl font-extrabold text-white">Progress Analytics</h1>
                <p className="text-xs text-slate-400">Exam readiness metrics & study trajectory</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-3xl font-extrabold text-white">{stats.materialsProcessed}</div>
                  <div className="text-xs text-slate-400 font-medium">Lectures Analyzed</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-3xl font-extrabold text-white">{stats.quizzesCompleted}</div>
                  <div className="text-xs text-slate-400 font-medium">Quizzes Completed</div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-3xl font-extrabold text-indigo-400">
                    {stats.averageScorePercentage > 0 ? `${stats.averageScorePercentage}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Average Quiz Score</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-center">
                <div className="text-slate-200 font-bold text-sm">Exam Readiness Score</div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                  {stats.averageScorePercentage >= 80 ? 'HIGH (Exam Ready)' : stats.averageScorePercentage >= 50 ? 'MEDIUM (On Track)' : 'START STUDYING'}
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Complete more practice quizzes and review high-priority exam topics to boost your readiness.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating 24/7 AI Chatbot Assistant Widget */}
      <AIChatbotWidget
        currentMaterial={currentMaterial}
        customApiKey={settings.customApiKey}
        currentLanguage={currentLanguage}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmitUpload={handleUploadSubmit}
        savedApiKey={settings.customApiKey}
        currentLanguage={currentLanguage}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        material={currentMaterial}
      />
    </div>
  );
}
