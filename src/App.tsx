import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { StudyProvider } from './context/StudyContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import SearchModal from './components/SearchModal';
import FlashcardPanel from './components/FlashcardPanel';
import ExamPage from './pages/ExamPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            setSearchOpen(prev => !prev);
            break;
          case 'f':
            e.preventDefault();
            setFlashcardsOpen(prev => !prev);
            break;
          case 'b':
            e.preventDefault();
            setSidebarOpen(prev => !prev);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StudyProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-theme">
            <Header 
              onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
              onSearchClick={() => setSearchOpen(true)}
              onFlashcardsClick={() => setFlashcardsOpen(true)}
            />
            
            <div className="flex flex-1 overflow-hidden">
              {location.pathname !== '/exam' && (
                <>
                  <Sidebar 
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                  
                  {sidebarOpen && (
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
                      onClick={() => setSidebarOpen(false)}
                    ></div>
                  )}
                </>
              )}
              
              <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                location.pathname !== '/exam' && sidebarOpen ? 'md:ml-72' : ''
              }`}>
                <Routes>
                  <Route path="/" element={<MainContent />} />
                  <Route path="/exam" element={<ExamPage />} />
                </Routes>
              </main>
            </div>
            
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            <FlashcardPanel isOpen={flashcardsOpen} onClose={() => setFlashcardsOpen(false)} />
          </div>
        </StudyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;