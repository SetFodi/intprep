import { TestCase } from '@/types';

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  testResults?: TestResult[];
  score?: number;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  error?: string;
}

export function executeCode(code: string, testCases: TestCase[]): CodeExecutionResult {
  try {
    // This is a simplified code execution simulator
    // In a real application, you'd want to use a sandboxed environment
    
    const testResults: TestResult[] = [];
    let passedTests = 0;

    for (const testCase of testCases) {
      try {
        // Create a function from the user's code
        const userFunction = createFunctionFromCode(code);
        
        // Parse the input (assuming it's JSON format for simplicity)
        const input = JSON.parse(testCase.input);
        
        // Execute the function
        const actualOutput = userFunction(input);
        
        // Compare with expected output
        const expectedOutput = JSON.parse(testCase.expectedOutput);
        const passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
        
        if (passed) passedTests++;
        
        testResults.push({
          testCase,
          passed,
          actualOutput: JSON.stringify(actualOutput),
        });
      } catch (error) {
        testResults.push({
          testCase,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const score = Math.round((passedTests / testCases.length) * 100);

    return {
      success: true,
      testResults,
      score,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Code execution failed',
    };
  }
}

function createFunctionFromCode(code: string): Function {
  // This is a very basic implementation
  // In production, you'd want proper sandboxing and security measures
  
  try {
    // Extract function name and create executable function
    const functionMatch = code.match(/function\s+(\w+)\s*\([^)]*\)\s*{[\s\S]*}/);
    if (functionMatch) {
      const functionCode = functionMatch[0];
      const functionName = functionMatch[1];
      
      // Create a safe execution context
      const safeEval = new Function('return ' + functionCode)();
      return safeEval;
    }
    
    // Try arrow function format
    const arrowMatch = code.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[\s\S]*}/);
    if (arrowMatch) {
      const functionCode = arrowMatch[0];
      const functionName = arrowMatch[1];
      
      const safeEval = new Function(functionCode + '; return ' + functionName)();
      return safeEval;
    }
    
    throw new Error('Could not parse function from code');
  } catch (error) {
    throw new Error('Invalid function syntax');
  }
}

// Sample test cases for common problems
export const sampleChallenges = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy" as const,
    category: "Array",
    starterCode: `function twoSum(nums, target) {
    // Your code here
    return [];
}`,
    solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    testCases: [
      {
        input: '{"nums": [2, 7, 11, 15], "target": 9}',
        expectedOutput: '[0, 1]',
        description: 'Basic case: [2,7,11,15], target 9'
      },
      {
        input: '{"nums": [3, 2, 4], "target": 6}',
        expectedOutput: '[1, 2]',
        description: 'Case: [3,2,4], target 6'
      }
    ],
    timeLimit: 30
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    difficulty: "Easy" as const,
    category: "String",
    starterCode: `function reverseString(s) {
    // Your code here
    return s;
}`,
    solution: `function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
    return s;
}`,
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        description: 'Reverse "hello"'
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        description: 'Reverse "Hannah"'
      }
    ],
    timeLimit: 20
  }
];
