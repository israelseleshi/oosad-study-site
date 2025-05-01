import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, BookX, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Card from '../components/ui/Card';
import { ExamQuestion, ExamResult } from '../types';
import { useStudy } from '../context/StudyContext';
import chapter1Exam from '../json/chapter1-exam.json';
import chapter2Exam from '../json/chapter2-exam.json';
import chapter3Exam from '../json/chapter3-exam.json';

const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentChapterIndex } = useStudy();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [showWarning, setShowWarning] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const getExamData = () => {
    switch (currentChapterIndex) {
      case 0:
        return chapter1Exam;
      case 1:
        return chapter2Exam;
      case 2:
        return chapter3Exam;
      default:
        return null;
    }
  };

  const exam = getExamData()?.exam;

  // Filter out matching questions
  const filteredSections = exam?.sections.filter(section => 
    section.title !== 'Matching Questions'
  ) || [];

  // Calculate total questions and current question number
  const getTotalQuestions = () => {
    let total = 0;
    let current = 0;
    filteredSections.forEach((section, sIndex) => {
      section.questions?.forEach((_, qIndex) => {
        if (sIndex < currentSection || (sIndex === currentSection && qIndex <= currentQuestionIndex)) {
          current++;
        }
        total++;
      });
    });
    return { total, current };
  };

  const { total: totalQuestions, current: currentQuestionNumber } = getTotalQuestions();

  // Get question info by global index
  const getQuestionByGlobalIndex = (globalIndex: number) => {
    let count = 0;
    for (let sIndex = 0; sIndex < filteredSections.length; sIndex++) {
      const section = filteredSections[sIndex];
      for (let qIndex = 0; qIndex < section.questions.length; qIndex++) {
        if (count === globalIndex) {
          return {
            sectionIndex: sIndex,
            questionIndex: qIndex,
            question: section.questions[qIndex]
          };
        }
        count++;
      }
    }
    return null;
  };

  // Navigate to specific question
  const navigateToQuestion = (globalIndex: number) => {
    const questionInfo = getQuestionByGlobalIndex(globalIndex);
    if (questionInfo) {
      setCurrentSection(questionInfo.sectionIndex);
      setCurrentQuestionIndex(questionInfo.questionIndex);
      setQuestionSubmitted(false);
      setCurrentAnswer(selectedAnswers[questionInfo.question.id] || '');
    }
  };

  if (!exam) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Study
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <BookX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Exam Available
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There is no exam available for Chapter {currentChapterIndex + 1} at this time.
              Please continue studying the material or try another chapter.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Study
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = filteredSections[currentSection];
  const currentQuestion = currentSectionData?.questions?.[currentQuestionIndex];
  const answeredQuestions = Object.keys(selectedAnswers).length;

  const getCorrectAnswer = (questionId: number, sectionTitle: string) => {
    switch (sectionTitle) {
      case 'Multiple Choice Questions':
        return exam.answers.multipleChoice.find(a => a.id === questionId)?.answer;
      case 'True/False Questions':
        return exam.answers.trueFalse.find(a => a.id === questionId)?.answer;
      case 'Fill-in-the-Blank Questions':
        return exam.answers.fillInTheBlank.find(a => a.id === questionId)?.answer;
      default:
        return '';
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!examResult && timeLeft > 0) {
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
  }, [examResult, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setCurrentAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer) return;
    
    const correctAnswer = getCorrectAnswer(currentQuestion.id, currentSectionData.title);
    const isCorrect = currentAnswer.toLowerCase() === correctAnswer?.toLowerCase();
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: currentAnswer
    }));
    
    setScore(prev => isCorrect ? prev + 1 : prev);
    setQuestionSubmitted(true);
  };

  const calculateSectionScore = (sectionIndex: number) => {
    const section = filteredSections[sectionIndex];
    let correct = 0;
    let total = section.questions?.length ?? 0;

    section.questions?.forEach(question => {
      const answer = selectedAnswers[question.id];
      const correctAnswer = getCorrectAnswer(question.id, section.title);
      if (answer?.toLowerCase() === correctAnswer?.toLowerCase()) correct++;
    });

    return { correct, total };
  };

  const submitExam = () => {
    const sectionScores: { [key: string]: { correct: number; total: number } } = {};
    let totalCorrect = 0;
    let totalQuestions = 0;

    filteredSections.forEach((section, index) => {
      const score = calculateSectionScore(index);
      sectionScores[section.title] = score;
      totalCorrect += score.correct;
      totalQuestions += score.total;
    });

    setExamResult({
      totalQuestions,
      correctAnswers: totalCorrect,
      timeSpent: 3600 - timeLeft,
      date: new Date(),
      sectionScores
    });
    setShowAnswers(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (currentSectionData?.questions?.length ?? 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSection < filteredSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestionIndex(0);
    } else {
      setShowWarning(true);
    }
    setQuestionSubmitted(false);
    setCurrentAnswer('');
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestionIndex((filteredSections[currentSection - 1]?.questions?.length ?? 1) - 1);
    }
    setQuestionSubmitted(false);
    setCurrentAnswer('');
  };

  const renderQuestionBubbles = () => {
    let globalIndex = 0;
    return (
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {filteredSections.map((section) =>
          section.questions?.map((question) => {
            const currentGlobalIndex = globalIndex++;
            const isCurrentQuestion = 
              currentSection === getQuestionByGlobalIndex(currentGlobalIndex)?.sectionIndex &&
              currentQuestionIndex === getQuestionByGlobalIndex(currentGlobalIndex)?.questionIndex;
            
            const isAnswered = selectedAnswers[question.id] !== undefined;
            
            return (
              <button
                key={question.id}
                onClick={() => navigateToQuestion(currentGlobalIndex)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200 hover:scale-110
                  ${isAnswered 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                  ${isCurrentQuestion
                    ? 'ring-2 ring-blue-500 ring-offset-2'
                    : ''
                  }
                `}
              >
                {currentGlobalIndex + 1}
              </button>
            );
          })
        )}
      </div>
    );
  };

  const renderQuestionContent = () => {
    if (!currentQuestion) return null;

    const correctAnswer = getCorrectAnswer(currentQuestion.id, currentSectionData.title);
    const isCorrect = currentAnswer?.toLowerCase() === correctAnswer?.toLowerCase();

    switch (currentSectionData.title) {
      case 'Multiple Choice Questions':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.letter}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  questionSubmitted
                    ? option.letter === correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : option.letter === currentAnswer
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                    : currentAnswer === option.letter
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => !questionSubmitted && handleAnswerSelect(currentQuestion.id, option.letter)}
                disabled={questionSubmitted}
              >
                <span className="font-medium">{option.letter}.</span> {option.text}
              </button>
            ))}
          </div>
        );

      case 'True/False Questions':
        return (
          <div className="space-y-4">
            <div className="flex space-x-4">
              {['True', 'False'].map((option) => (
                <button
                  key={option}
                  className={`flex-1 p-4 text-center rounded-lg border transition-colors ${
                    questionSubmitted
                      ? option === correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : option === currentAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                      : currentAnswer === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => !questionSubmitted && handleAnswerSelect(currentQuestion.id, option)}
                  disabled={questionSubmitted}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      case 'Fill-in-the-Blank Questions':
        return (
          <div className="space-y-4">
            <input
              type="text"
              className={`w-full p-4 rounded-lg border transition-colors ${
                questionSubmitted
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              value={currentAnswer}
              onChange={(e) => !questionSubmitted && handleAnswerSelect(currentQuestion.id, e.target.value)}
              disabled={questionSubmitted}
              placeholder="Type your answer here..."
            />
            {questionSubmitted && !isCorrect && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Correct answer: {correctAnswer}
              </p>
            )}
          </div>
        );

      case 'Short Answer Questions':
        return (
          <div className="space-y-4">
            <textarea
              className={`w-full p-4 rounded-lg border transition-colors min-h-[200px] ${
                questionSubmitted
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              value={currentAnswer}
              onChange={(e) => !questionSubmitted && handleAnswerSelect(currentQuestion.id, e.target.value)}
              disabled={questionSubmitted}
              placeholder="Type your answer here..."
            />
            {questionSubmitted && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sample Answer:</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {correctAnswer}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Study
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 mr-2" />
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {answeredQuestions} of {totalQuestions} answered
              </div>
            </div>
          </div>

          {!examResult ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {exam.title}
                  </h1>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {currentSectionData.title}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Question {currentQuestionIndex + 1} of {currentSectionData.questions?.length ?? 0}
                    </span>
                  </div>
                  
                  {renderQuestionBubbles()}
                </div>

                <div className="space-y-6">
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {currentQuestionIndex + 1}. {currentQuestion.text}
                  </div>

                  {renderQuestionContent()}

                  <div className="flex flex-col space-y-4">
                    {!questionSubmitted && (
                      <Button
                        variant="primary"
                        onClick={handleSubmitAnswer}
                        disabled={!currentAnswer}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>
                    )}
                    
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentSection === 0 && currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {showWarning && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="flex items-center mb-4">
                      <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Submit Exam?
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      You have answered {answeredQuestions} out of {totalQuestions} questions. 
                      Are you sure you want to submit your exam?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowWarning(false)}
                      >
                        Continue Exam
                      </Button>
                      <Button
                        variant="primary"
                        onClick={submitExam}
                      >
                        Submit Exam
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Exam Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Time taken: {formatTime(examResult.timeSpent)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Final Score</h3>
                    <div className="text-4xl font-bold mb-4">
                      {Math.round((examResult.correctAnswers / examResult.totalQuestions) * 100)}%
                    </div>
                    <p className="text-lg">
                      {examResult.correctAnswers} correct out of {examResult.totalQuestions} questions
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(examResult.sectionScores).map(([section, score]) => (
                    <Card key={section} className="p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {section}
                      </h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {score.correct} / {score.total}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round((score.correct / score.total) * 100)}%
                        </span>
                      </div>
                      <ProgressBar
                        value={score.correct}
                        max={score.total}
                        size="sm"
                        color={
                          (score.correct / score.total) >= 0.7
                            ? 'green'
                            : (score.correct / score.total) >= 0.5
                            ? 'blue'
                            : 'purple'
                        }
                      />
                    </Card>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Return to Study
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;