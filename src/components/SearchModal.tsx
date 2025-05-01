import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { studyData } from '../data';
import { useStudy } from '../context/StudyContext';
import Input from './ui/Input';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'section' | 'content';
  chapterIndex: number;
  sectionIndex: number;
  contentIndex?: number;
  title: string;
  subtitle?: string;
  preview: string;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { setCurrentChapterIndex, setCurrentSectionIndex } = useStudy();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    if (newQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    
    const searchResults: SearchResult[] = [];
    const lowerQuery = newQuery.toLowerCase();
    
    studyData.forEach((data, chapterIndex) => {
      data.chapter.sections.forEach((section, sectionIndex) => {
        // Search in section titles
        if (section.title.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'section',
            chapterIndex,
            sectionIndex,
            title: section.title,
            preview: `${data.chapter.title.split(':')[0]} > ${section.title}`,
          });
        }
        
        // Search in content
        section.content.forEach((content, contentIndex) => {
          const searchableText = [
            content.subtitle || '',
            content.description || '',
            (content.items || [])
              .map(item => `${item.term}: ${item.definition}`)
              .join(' ')
          ].join(' ').toLowerCase();
          
          if (searchableText.includes(lowerQuery)) {
            searchResults.push({
              type: 'content',
              chapterIndex,
              sectionIndex,
              contentIndex,
              title: content.subtitle || section.title,
              subtitle: content.subtitle ? section.title : undefined,
              preview: content.description 
                ? content.description.substring(0, 100) + '...' 
                : 'Contains matching terms or definitions',
            });
          }
        });
      });
    });
    
    setResults(searchResults);
  };
  
  const handleResultClick = (result: SearchResult) => {
    setCurrentChapterIndex(result.chapterIndex);
    setCurrentSectionIndex(result.sectionIndex);
    onClose();
  };
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <Input
            className="flex-1"
            placeholder="Search for topics, terms, definitions..."
            value={query}
            onChange={handleSearch}
            autoFocus
          />
          <button
            className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-68px)]">
          {results.length === 0 && query.length > 1 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No results found for "{query}"
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <li 
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.type === 'section' ? 'Section' : 'Content'}
                      </span>
                    </div>
                    
                    {result.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {result.subtitle}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {result.preview}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;