import React from 'react';
import { Menu, Moon, Search, Sun, BookOpen, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onFlashcardsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onSearchClick, 
  onFlashcardsClick,
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm transition-theme">
      <div className="container mx-auto px-2 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            className="md:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            OOSAD Study
          </h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFlashcardsClick}
            className="flex items-center space-x-1"
            aria-label="Open flashcards"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Flashcards</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/exam')}
            className="flex items-center space-x-1"
            aria-label="Take exam"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Exam</span>
          </Button>

          <button 
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors duration-200"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;