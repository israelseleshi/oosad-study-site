import React from 'react';
import { useStudy } from '../context/StudyContext';
import { studyData } from '../data';
import ContentSection from './ContentSection';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Button from './ui/Button';

const MainContent: React.FC = () => {
  const { 
    currentChapterIndex, 
    setCurrentChapterIndex,
    currentSectionIndex,
    setCurrentSectionIndex
  } = useStudy();
  
  const currentChapter = studyData[currentChapterIndex]?.chapter;
  const currentSection = currentChapter?.sections[currentSectionIndex];

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setCurrentSectionIndex(studyData[currentChapterIndex - 1].chapter.sections.length - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSectionIndex < currentChapter.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else if (currentChapterIndex < studyData.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setCurrentSectionIndex(0);
    }
  };

  if (!currentSection) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No section selected.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {currentChapter.title}
        </h1>
        <div className="h-1 w-32 bg-blue-500 rounded"></div>
      </div>
      
      <ContentSection 
        section={currentSection}
        chapterIndex={currentChapterIndex}
        sectionIndex={currentSectionIndex}
      />
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevSection}
          disabled={currentChapterIndex === 0 && currentSectionIndex === 0}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNextSection}
          disabled={
            currentChapterIndex === studyData.length - 1 && 
            currentSectionIndex === currentChapter.sections.length - 1
          }
          className="flex items-center"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MainContent;