'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Play, 
  Award, 
  Clock, 
  Sparkles,
  FileText
} from 'lucide-react';
import { ProcessedMaterial } from '@/types';

interface MaterialHistoryViewProps {
  materials: ProcessedMaterial[];
  onSelectMaterial: (material: ProcessedMaterial) => void;
  onStartQuiz: (material: ProcessedMaterial) => void;
  onDeleteMaterial: (id: string) => void;
  onOpenUpload: () => void;
}

export const MaterialHistoryView: React.FC<MaterialHistoryViewProps> = ({
  materials,
  onSelectMaterial,
  onStartQuiz,
  onDeleteMaterial,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.notes.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubjectFilter === 'All' || m.personalization.subject === selectedSubjectFilter;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Material History</h1>
          <p className="text-xs text-slate-400">All saved study materials, notes, and quiz performances</p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md shadow-indigo-600/30 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upload New Lecture</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic title or file name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Subjects</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <div className="text-slate-300 font-bold">No saved study materials match your search</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting search filters or upload new lecture content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition group shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {item.personalization.subject}
                  </span>
                  <button
                    onClick={() => onDeleteMaterial(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition p-1"
                    title="Delete item"
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

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                {item.latestQuizResult ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Score: {item.latestQuizResult.scorePercentage}%
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
