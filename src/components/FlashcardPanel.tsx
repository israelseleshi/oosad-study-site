import React, { useState, useEffect } from 'react';
import { X, RotateCw } from 'lucide-react';
import Button from './ui/Button';
import { extractFlashcards } from '../data';
import Card from './ui/Card';
import { useStudy } from '../context/StudyContext';

interface FlashcardPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Flashcard {
  term: string;
  definition: string;
  category: string;
}

const FlashcardPanel: React.FC<FlashcardPanelProps> = ({ isOpen, onClose }) => {
  const { currentChapterIndex } = useStudy();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const allFlashcards = extractFlashcards();
    const chapterTitle = `Chapter ${currentChapterIndex + 1}`;
    const currentChapterFlashcards = allFlashcards.filter(card => 
      card.category.startsWith(chapterTitle)
    );
    
    const shuffled = [...currentChapterFlashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [currentChapterIndex]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(flashcards.length - 1);
    }
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (!isOpen || flashcards.length === 0) return null;

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Flashcards</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleShuffle}
              className="flex items-center"
            >
              <RotateCw className="w-4 h-4 mr-1" />
              Shuffle
            </Button>
          </div>
          
          <div 
            className="min-h-[300px] cursor-pointer mx-auto max-w-sm"
            onClick={handleCardClick}
          >
            <div className="relative w-full min-h-[300px] perspective-1000 transition-transform duration-500">
              <Card className={`absolute w-full min-h-[300px] transition-all duration-500 ease-in-out backface-visibility-hidden ${isFlipped ? 'rotate-y-180 transform-style-3d' : ''}`}>
                <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {currentCard.category}
                  </span>
                  <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">
                    {currentCard.term}
                  </h3>
                  <p className="text-sm text-blue-500 dark:text-blue-400 mt-4">
                    Click to reveal definition
                  </p>
                </div>
              </Card>
              
              <Card className={`absolute w-full min-h-[300px] transition-all duration-500 ease-in-out backface-visibility-hidden rotate-y-180 transform-style-3d ${isFlipped ? 'rotate-y-0' : ''}`}>
                <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-center text-gray-700 dark:text-gray-300">
                    {currentCard.definition}
                  </p>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <Button 
              variant="outline"
              onClick={handlePrevCard}
            >
              Previous
            </Button>
            
            <Button 
              variant="primary"
              onClick={handleNextCard}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPanel;