// Define types for the study content structure
export interface Term {
  term: string;
  definition: string;
}

export interface ContentItem {
  subtitle?: string;
  description?: string;
  items?: Term[];
}

export interface Section {
  title: string;
  content: ContentItem[];
}

export interface Chapter {
  title: string;
  sections: Section[];
}

export interface StudyData {
  chapter: Chapter;
}

// Types for flashcards
export interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Error boundary types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Exam types
export interface ExamOption {
  letter: string;
  text: string;
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: ExamOption[];
}

export interface ExamSection {
  title: string;
  count: number;
  questions: ExamQuestion[];
}

export interface ExamData {
  exam: {
    title: string;
    instructions: string;
    sections: ExamSection[];
    answers: {
      multipleChoice: { id: number; answer: string }[];
      fillInTheBlank: { id: number; answer: string }[];
      trueFalse: { id: number; answer: string }[];
      shortAnswer: { id: number; answer: string }[];
      matching: { id: number; answer: string }[];
    };
  };
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: Date;
  sectionScores: {
    [key: string]: {
      correct: number;
      total: number;
    };
  };
}