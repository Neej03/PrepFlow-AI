import { ProcessedMaterial, QuizResult, UserSettings, AppStats } from '@/types';

const STORAGE_KEYS = {
  MATERIALS: 'ai_student_materials_v1',
  SETTINGS: 'ai_student_settings_v1',
  STATS: 'ai_student_stats_v1',
};

export const DEFAULT_SETTINGS: UserSettings = {
  customApiKey: '',
  defaultSubject: 'Computer Science',
  defaultStudyLevel: 'Intermediate',
  defaultStudyGoal: 'Exam Preparation',
  autoSaveHistory: true,
  theme: 'light',
  language: 'en',
};

export function getSavedMaterials(): ProcessedMaterial[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading saved materials from LocalStorage:', e);
    return [];
  }
}

export function saveMaterialToHistory(material: ProcessedMaterial): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedMaterials();
    const updated = [material, ...existing.filter(m => m.id !== material.id)];
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated.slice(0, 30)));
    updateAppStats(updated);
  } catch (e) {
    console.error('Error saving material:', e);
  }
}

export function updateMaterialQuizResult(materialId: string, result: QuizResult): ProcessedMaterial | null {
  if (typeof window === 'undefined') return null;
  try {
    const existing = getSavedMaterials();
    let updatedMat: ProcessedMaterial | null = null;
    const updated = existing.map(mat => {
      if (mat.id === materialId) {
        updatedMat = { ...mat, latestQuizResult: result };
        return updatedMat;
      }
      return mat;
    });
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(updated));
    updateAppStats(updated);
    return updatedMat;
  } catch (e) {
    console.error('Error updating quiz result:', e);
    return null;
  }
}

export function deleteMaterialFromHistory(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedMaterials();
    const filtered = existing.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(filtered));
    updateAppStats(filtered);
  } catch (e) {
    console.error('Error deleting material:', e);
  }
}

export function getAppSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function getAppStats(): AppStats {
  if (typeof window === 'undefined') {
    return { materialsProcessed: 0, quizzesCompleted: 0, averageScorePercentage: 0, totalStudyMinutes: 0 };
  }
  const materials = getSavedMaterials();
  return computeStatsFromMaterials(materials);
}

function computeStatsFromMaterials(materials: ProcessedMaterial[]): AppStats {
  const materialsProcessed = materials.length;
  const quizzes = materials.map(m => m.latestQuizResult).filter((q): q is QuizResult => !!q);
  const quizzesCompleted = quizzes.length;
  
  const totalScorePct = quizzes.reduce((sum, q) => sum + q.scorePercentage, 0);
  const averageScorePercentage = quizzesCompleted > 0 ? Math.round(totalScorePct / quizzesCompleted) : 0;
  
  const totalStudyMinutes = materials.reduce((sum, m) => sum + (m.notes.estimatedStudyTimeMinutes || 15), 0);

  return {
    materialsProcessed,
    quizzesCompleted,
    averageScorePercentage,
    totalStudyMinutes
  };
}

function updateAppStats(materials: ProcessedMaterial[]): void {
  const stats = computeStatsFromMaterials(materials);
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {}
}
