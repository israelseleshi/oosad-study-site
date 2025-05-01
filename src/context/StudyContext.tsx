import React, { createContext, useContext, useState } from 'react';
import { studyData } from '../data';

interface StudyContextType {
  currentChapterIndex: number;
  setCurrentChapterIndex: (index: number) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (index: number) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  return (
    <StudyContext.Provider 
      value={{ 
        currentChapterIndex, 
        setCurrentChapterIndex,
        currentSectionIndex,
        setCurrentSectionIndex,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = (): StudyContextType => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};