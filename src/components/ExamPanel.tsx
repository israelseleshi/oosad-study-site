import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './ui/Button';
import { ExamQuestion, ExamResult } from '../types';
import { useStudy } from '../context/StudyContext';

interface ExamPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExamPanel: React.FC<ExamPanelProps> = ({ isOpen, onClose }) => {
  const { currentChapterIndex } = useStudy();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

  useEffect(() => {
    if (isOpen) {
      // Reset exam state when opened
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setExamResult(null);
      setTimeLeft(1800);
      // TODO: Load questions for current chapter
    }
  }, [isOpen, currentChapterIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && !examResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, examResult, timeLeft]);

  const submitExam = () => {
    // TODO: Calculate results
    setExamResult({
      totalQuestions: questions.length,
      correctAnswers: 0,
      timeSpent: 1800 - timeLeft,
      date: new Date()
    });
  };

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Chapter {currentChapterIndex + 1} Exam
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Time Left: {formatTime(timeLeft)}
            </span>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!examResult ? (
            <div className="space-y-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              
              {/* Question content will go here */}
              <div className="text-lg font-medium text-gray-900 dark:text-white">
                Sample question text
              </div>
              
              <div className="space-y-3">
                {['Option A', 'Option B', 'Option C', 'Option D'].map((option, index) => (
                  <button
                    key={index}
                    className={`w-full p-4 text-left rounded-lg border ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (currentQuestionIndex === questions.length - 1) {
                      submitExam();
                    } else {
                      setCurrentQuestionIndex(prev => prev + 1);
                      setSelectedAnswer(null);
                    }
                  }}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Exam Results
              </h3>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Score: {examResult.correctAnswers} / {examResult.totalQuestions}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Time taken: {formatTime(examResult.timeSpent)}
                </p>
                <Button variant="primary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPanel;