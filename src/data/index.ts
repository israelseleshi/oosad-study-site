import { StudyData } from '../types';
import chapter1Data from '../json/chapter1.json';
import chapter2Data from '../json/chapter2.json';
import chapter3Data from '../json/chapter3.json';

export const studyData: StudyData[] = [chapter1Data, chapter2Data, chapter3Data];

// Helper function to extract all terms for flashcards
export const extractFlashcards = () => {
  const flashcards: { term: string; definition: string; category: string }[] = [];
  
  studyData.forEach(data => {
    const chapterTitle = data.chapter.title.split(':')[0].trim();
    
    data.chapter.sections.forEach(section => {
      section.content.forEach(contentItem => {
        if (contentItem.items) {
          contentItem.items.forEach(item => {
            flashcards.push({
              term: item.term,
              definition: item.definition,
              category: `${chapterTitle} - ${section.title}`
            });
          });
        }
      });
    });
  });
  
  return flashcards;
};