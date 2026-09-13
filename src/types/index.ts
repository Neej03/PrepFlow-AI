export type Subject = 
  | 'Computer Science' 
  | 'Mathematics' 
  | 'Physics' 
  | 'Chemistry' 
  | 'Business' 
  | 'Other';

export type StudyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type StudyGoal = 'Quick Revision' | 'Exam Preparation' | 'Deep Understanding';

export interface PersonalizationSettings {
  subject: Subject;
  studyLevel: StudyLevel;
  studyGoal: StudyGoal;
}

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface KeyConcept {
  name: string;
  importance: PriorityLevel;
  description: string;
  simpleExplanation?: string;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface BulletPoint {
  topic: string;
  points: string[];
}

export interface Formula {
  name: string;
  formula: string;
  explanation: string;
  variables?: string;
}

export interface PracticalExample {
  scenario: string;
  explanation: string;
  solutionSteps?: string[];
}

export interface ExamPoint {
  point: string;
  priority: PriorityLevel;
  likelyQuestionType?: string;
  whyItMatters?: string;
}

export interface PracticalApplication {
  title: string;
  description: string;
}

export interface RevisionNotes {
  title: string;
  overview: string;
  keyConcepts: KeyConcept[];
  definitions: Definition[];
  bulletPoints: BulletPoint[];
  formulas: Formula[];
  examples: PracticalExample[];
  examPoints: ExamPoint[];
  rememberThis: string[];
  practicalApplications?: (string | PracticalApplication)[];
  furtherExploration?: string[];
  estimatedStudyTimeMinutes: number;
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // for mcq and true_false
  correctAnswer: string;
  explanation: string;
  topicTag: string;
}

export interface QuizSet {
  id: string;
  title: string;
  difficulty: 'Core Principles' | 'Applied Knowledge' | 'Exam Challenge' | 'Randomized Quiz';
  questions: QuizQuestion[];
  result?: QuizResult;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: string;
  isCorrect?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  answers: UserAnswer[];
  weakTopics: string[];
  strongTopics: string[];
  feedbackSummary: string;
  completedAt: string;
}

export interface ProcessedMaterial {
  id: string;
  fileName: string;
  fileType: string;
  createdAt: string;
  personalization: PersonalizationSettings;
  notes: RevisionNotes;
  quiz: QuizQuestion[];
  quizSets?: QuizSet[];
  latestQuizResult?: QuizResult;
  rawTextPreview?: string;
}

export interface AppStats {
  materialsProcessed: number;
  quizzesCompleted: number;
  averageScorePercentage: number;
  totalStudyMinutes: number;
}

export type AppTheme = 'dark' | 'light' | 'cyberpunk';

export interface UserSettings {
  customApiKey?: string;
  defaultSubject: Subject;
  defaultStudyLevel: StudyLevel;
  defaultStudyGoal: StudyGoal;
  autoSaveHistory: boolean;
  theme: AppTheme;
}
