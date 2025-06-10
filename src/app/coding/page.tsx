'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Code, Clock, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Brain className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">InterviewPrep</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/coding"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Coding
                </Link>
                <Link
                  href="/behavioral"
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Behavioral
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
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">{currentChallenge.title}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentChallenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  currentChallenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentChallenge.difficulty}
                </span>
              </div>
              
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {currentChallenge.category}
                </span>
              </div>

              <p className="text-gray-700 mb-6">{currentChallenge.description}</p>

              {/* Timer */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Time Limit: {currentChallenge.timeLimit} min</span>
                </div>
                <div className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Test Cases */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Test Cases</h3>
                <div className="space-y-3">
                  {currentChallenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-md">
                      <div className="text-xs text-gray-600 mb-1">Example {index + 1}:</div>
                      <div className="text-sm">
                        <div><strong>Input:</strong> {testCase.input}</div>
                        <div><strong>Output:</strong> {testCase.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenge Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Other Challenges</h3>
                <div className="space-y-2">
                  {sampleChallenges.map((challenge, index) => (
                    <button
                      key={index}
                      onClick={() => switchChallenge(index)}
                      className={`w-full text-left p-2 rounded-md text-sm ${
                        challenge.title === currentChallenge.title
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'hover:bg-gray-100'
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
                  className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showSolution ? 'Hide' : 'Show'} Solution
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor and Results */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Code Editor</h3>
                  <button
                    onClick={runCode}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </button>
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
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Test Results</h4>
                    {result.success ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Overall Score</span>
                          <span className={`text-lg font-bold ${
                            (result.score || 0) >= 80 ? 'text-green-600' :
                            (result.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.score}%
                          </span>
                        </div>
                        {result.testResults?.map((testResult, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              {testResult.passed ? (
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                              )}
                              <span className="text-sm">Test Case {index + 1}</span>
                            </div>
                            <span className={`text-sm ${testResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                              {testResult.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                          <XCircle className="h-5 w-5 text-red-400 mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800">Execution Error</h4>
                            <p className="text-sm text-red-700 mt-1">{result.error}</p>
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
