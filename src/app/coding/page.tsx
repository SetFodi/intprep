'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, RotateCcw, CheckCircle, XCircle, Clock, Brain } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { sampleChallenges, executeCode, CodeExecutionResult } from '@/utils/codeExecution';

export default function CodingPage() {
  const [currentChallenge, setCurrentChallenge] = useState(sampleChallenges[0]);
  const [code, setCode] = useState(currentChallenge.starterCode);
  const [timeLeft, setTimeLeft] = useState(currentChallenge.timeLimit * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const resetChallenge = () => {
    setCode(currentChallenge.starterCode);
    setTimeLeft(currentChallenge.timeLimit * 60);
    setIsRunning(false);
    setResult(null);
    setShowSolution(false);
  };

  const runCode = () => {
    if (!isRunning) {
      startTimer();
    }
    const executionResult = executeCode(code, currentChallenge.testCases);
    setResult(executionResult);
  };

  const submitChallenge = async () => {
    if (!result || !result.success) {
      alert('Please run your code first and ensure it passes the tests.');
      return;
    }

    try {
      const response = await fetch('/api/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'coding_challenge',
          category: currentChallenge.category,
          details: `Completed ${currentChallenge.title}`,
          score: result.score,
          duration: Math.round((currentChallenge.timeLimit * 60 - timeLeft) / 60), // Time spent in minutes
        }),
      });

      if (response.ok) {
        alert(`Challenge submitted! Score: ${result.score}%`);
      } else {
        console.error('Failed to submit challenge');
        alert('Failed to submit challenge. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      alert('Error submitting challenge. Please try again.');
    }
  };

  const switchChallenge = (index: number) => {
    const newChallenge = sampleChallenges[index];
    setCurrentChallenge(newChallenge);
    setCode(newChallenge.starterCode);
    setTimeLeft(newChallenge.timeLimit * 60);
    setIsRunning(false);
    setResult(null);
    setShowSolution(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-semibold text-slate-900 dark:text-white">InterviewAI</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/coding"
                  className="border-blue-500 text-slate-900 dark:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Coding
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-900 dark:text-white">{currentChallenge.title}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentChallenge.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  currentChallenge.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                  'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {currentChallenge.difficulty}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {currentChallenge.category}
                </span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6">{currentChallenge.description}</p>

              {/* Timer */}
              <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-slate-400 dark:text-slate-300 mr-2" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Time Limit: {currentChallenge.timeLimit} min</span>
                </div>
                <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Test Cases */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {currentChallenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-white dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600">
                      <div className="text-xs text-slate-600 dark:text-slate-300 mb-1">Example {index + 1}:</div>
                      <div className="text-sm text-slate-700 dark:text-slate-200">
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Output:</strong> {testCase.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">Other Challenges</h3>
                <div className="space-y-2">
                  {sampleChallenges.map((challenge, index) => (
                    <button
                      key={index}
                      onClick={() => switchChallenge(index)}
                      className={`w-full text-left p-2 rounded-md text-sm ${
                        challenge.title === currentChallenge.title
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {challenge.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={resetChallenge}
                  className="flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center px-3 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {showSolution ? 'Hide' : 'Show'} Solution
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor and Results */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Code Editor</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={runCode}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </button>
                    {result && result.success && (
                      <button
                        onClick={submitChallenge}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Challenge
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <Editor
                    height="400px"
                    defaultLanguage="javascript"
                    value={showSolution ? currentChallenge.solution : code}
                    onChange={(value) => !showSolution && setCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: showSolution,
                    }}
                    theme="vs-dark"
                  />
                </div>

                {/* Results */}
                {result && (
                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Test Results</h4>
                    {result.success ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Score</span>
                          <span className={`text-lg font-bold ${
                            (result.score || 0) >= 80 ? 'text-green-600 dark:text-green-400' :
                            (result.score || 0) >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {result.score}%
                          </span>
                        </div>
                        {result.testResults?.map((testResult, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center">
                              {testResult.passed ? (
                                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                              )}
                              <span className="text-sm text-slate-700 dark:text-slate-300">Test Case {index + 1}</span>
                            </div>
                            <span className={`text-sm ${testResult.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {testResult.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex">
                          <XCircle className="h-5 w-5 text-red-400 mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Execution Error</h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{result.error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
