import React from 'react';
import { studyData } from '../data';
import { useStudy } from '../context/StudyContext';
import { Book, ChevronDown, ChevronRight, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    currentChapterIndex, 
    setCurrentChapterIndex,
    currentSectionIndex,
    setCurrentSectionIndex,
  } = useStudy();
  
  const [expandedChapters, setExpandedChapters] = React.useState<number[]>([0]);
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  
  const toggleChapter = (index: number) => {
    setExpandedChapters(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };
  
  const handleSectionClick = (chapterIndex: number, sectionIndex: number) => {
    setCurrentChapterIndex(chapterIndex);
    setCurrentSectionIndex(sectionIndex);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  
  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:flex hidden"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isSidebarVisible ? 'md:translate-x-0' : 'md:-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Book className="w-5 h-5 mr-2" />
            OOSAD Study
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            onClick={onClose}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">CHAPTERS</h3>
          <nav className="space-y-1">
            {studyData.map((data, chapterIndex) => {
              const isExpanded = expandedChapters.includes(chapterIndex);
              const isActive = currentChapterIndex === chapterIndex;
              
              return (
                <div key={`chapter-${chapterIndex}`} className="space-y-1">
                  <button
                    className={`
                      w-full flex items-center justify-between p-2 rounded-md
                      transition-colors duration-200 break-words text-left
                      ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 
                      'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                    `}
                    onClick={() => toggleChapter(chapterIndex)}
                  >
                    <div className="flex items-center min-w-0">
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4 flex-shrink-0 mr-2" /> : 
                        <ChevronRight className="w-4 h-4 flex-shrink-0 mr-2" />
                      }
                      <span className="text-sm font-medium truncate">
                        Chapter {chapterIndex + 1}
                      </span>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-6 pl-2 border-l border-gray-200 dark:border-gray-700 space-y-1 mt-1">
                      {data.chapter.sections.map((section, sectionIndex) => {
                        const isActive = currentChapterIndex === chapterIndex && currentSectionIndex === sectionIndex;
                        
                        return (
                          <button
                            key={`section-${chapterIndex}-${sectionIndex}`}
                            className={`
                              w-full flex items-center p-2 rounded-md text-left
                              transition-colors duration-200 text-sm break-words
                              ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 
                              'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                            `}
                            onClick={() => handleSectionClick(chapterIndex, sectionIndex)}
                          >
                            <span className="flex-1">
                              {section.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;