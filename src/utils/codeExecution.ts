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
    const testResults: TestResult[] = [];
    let passedTests = 0;

    for (const testCase of testCases) {
      try {
        // Create a function from the user's code
        const userFunction = createFunctionFromCode(code);
        
        // Parse the input
        let input;
        try {
          input = JSON.parse(testCase.input);
        } catch {
          // If JSON parsing fails, treat as string literal
          input = testCase.input.replace(/^"|"$/g, ''); // Remove quotes if they exist
        }
        
        // Execute the function with the correct parameters
        let actualOutput;
        if (Array.isArray(input)) {
          // For single array parameter (like twoSum test cases)
          actualOutput = userFunction([...input]); // Clone array to avoid mutation issues
        } else if (typeof input === 'object' && input !== null) {
          // For multiple parameters (like twoSum)
          if ('nums' in input && 'target' in input) {
            actualOutput = userFunction(input.nums, input.target);
          } else {
            actualOutput = userFunction(input);
          }
        } else {
          // For simple string/number inputs
          actualOutput = userFunction(input);
        }
        
        // Parse expected output
        let expectedOutput;
        try {
          expectedOutput = JSON.parse(testCase.expectedOutput);
        } catch {
          // If JSON parsing fails, treat as string literal
          expectedOutput = testCase.expectedOutput.replace(/^"|"$/g, ''); // Remove quotes if they exist
        }
        
        // Compare outputs
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
  try {
    // Clean the code and extract function
    const cleanCode = code.trim();
    
    // Look for function declaration
    const functionMatch = cleanCode.match(/function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*\}/);
    if (functionMatch) {
      const functionName = functionMatch[1];
      
      // Check if the function has a return statement
      const functionBody = functionMatch[0];
      if (!functionBody.includes('return')) {
        throw new Error(`Function ${functionName} is missing a return statement. Make sure to return a value.`);
      }
      
      // Create a safe execution context
      const wrappedCode = `
        ${cleanCode}
        return ${functionName};
      `;
      
      return new Function(wrappedCode)();
    }
    
    // Try arrow function format
    const arrowMatch = cleanCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*\}/);
    if (arrowMatch) {
      const functionName = arrowMatch[1];
      
      // Check for return statement in arrow function
      const functionBody = arrowMatch[0];
      if (!functionBody.includes('return') && !functionBody.includes('=>')) {
        throw new Error(`Arrow function ${functionName} is missing a return statement. Make sure to return a value.`);
      }
      
      const wrappedCode = `
        ${cleanCode}
        return ${functionName};
      `;
      
      return new Function(wrappedCode)();
    }
    
    throw new Error('Could not parse function from code. Make sure you define a proper function.');
  } catch (error) {
    throw new Error('Invalid function syntax: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Sample test cases for common problems
export const sampleChallenges = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "Easy" as const,
    category: "Array",
    starterCode: `function twoSum(nums, target) {
    // Your code here
    return [];
}`,
    solution: `function twoSum(nums, target) {
    // Use a hash map for O(n) solution
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
      },
      {
        input: '{"nums": [3, 3], "target": 6}',
        expectedOutput: '[0, 1]',
        description: 'Duplicate numbers: [3,3], target 6'
      }
    ],
    timeLimit: 30
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters. You can return a new array or modify the input array.",
    difficulty: "Easy" as const,
    category: "String",
    starterCode: `function reverseString(s) {
    // Your code here
    return s;
}`,
    solution: `function reverseString(s) {
    // Simple approach: reverse and return
    return s.split("").reverse().join("");
}`,
    testCases: [
      {
        input: '"hello"',
        expectedOutput: '"olleh"',
        description: 'Reverse "hello"'
      },
      {
        input: '"Hannah"',
        expectedOutput: '"hannaH"',
        description: 'Reverse "Hannah"'
      },
      {
        input: '"A"',
        expectedOutput: '"A"',
        description: 'Single character'
      }
    ],
    timeLimit: 20
  },
  {
    title: "Valid Palindrome",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    difficulty: "Easy" as const,
    category: "String",
    starterCode: `function isPalindrome(s) {
    // Your code here
    return false;
}`,
    solution: `function isPalindrome(s) {
    // Clean and compare with reverse
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`,
    testCases: [
      {
        input: '"A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        description: 'Classic palindrome with punctuation'
      },
      {
        input: '"race a car"',
        expectedOutput: 'false',
        description: 'Not a palindrome'
      },
      {
        input: '""',
        expectedOutput: 'true',
        description: 'Empty string is palindrome'
      }
    ],
    timeLimit: 25
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Easy" as const,
    category: "Array",
    starterCode: `function maxSubArray(nums) {
    // Your code here
    return 0;
}`,
    solution: `function maxSubArray(nums) {
    // Kadane's Algorithm
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        // Either extend the existing subarray or start a new one
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        // Update global maximum
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`,
    testCases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        description: 'Subarray [4,-1,2,1] has the largest sum = 6'
      },
      {
        input: '[1]',
        expectedOutput: '1',
        description: 'Single element'
      },
      {
        input: '[5,4,-1,7,8]',
        expectedOutput: '23',
        description: 'All positive results in sum of all elements'
      }
    ],
    timeLimit: 30
  },
  {
    title: "Remove Duplicates",
    description: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the length of the modified array.",
    difficulty: "Easy" as const,
    category: "Array",
    starterCode: `function removeDuplicates(nums) {
    // Your code here
    return 0;
}`,
    solution: `function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    // Two-pointer approach
    let writeIndex = 1; // Position to write next unique element
    
    for (let readIndex = 1; readIndex < nums.length; readIndex++) {
        if (nums[readIndex] !== nums[readIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }
    
    return writeIndex;
}`,
    testCases: [
      {
        input: '[1,1,2]',
        expectedOutput: '2',
        description: 'Array becomes [1,2,_], return length 2'
      },
      {
        input: '[0,0,1,1,1,2,2,3,3,4]',
        expectedOutput: '5',
        description: 'Array becomes [0,1,2,3,4,_,_,_,_,_], return length 5'
      },
      {
        input: '[1]',
        expectedOutput: '1',
        description: 'Single element array'
      }
    ],
    timeLimit: 25
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "Easy" as const,
    category: "Array",
    starterCode: `function containsDuplicate(nums) {
    // Your code here
    return false;
}`,
    solution: `function containsDuplicate(nums) {
    // Simple approach: compare array length with Set size
    return nums.length !== new Set(nums).size;
}`,
    testCases: [
      {
        input: '[1,2,3,1]',
        expectedOutput: 'true',
        description: 'Contains duplicate: 1 appears twice'
      },
      {
        input: '[1,2,3,4]',
        expectedOutput: 'false',
        description: 'All elements are distinct'
      },
      {
        input: '[1,1,1,3,3,4,3,2,4,2]',
        expectedOutput: 'true',
        description: 'Multiple duplicates'
      }
    ],
    timeLimit: 20
  }
];
