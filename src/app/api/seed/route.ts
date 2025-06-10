import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CodingChallenge from '@/models/CodingChallenge';
import BehavioralQuestion from '@/models/BehavioralQuestion';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    await CodingChallenge.deleteMany({});
    await BehavioralQuestion.deleteMany({});

    // Seed coding challenges
    const codingChallenges = [
      {
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "Easy",
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
        description: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
        difficulty: "Easy",
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
      },
      {
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets and in the correct order.",
        difficulty: "Easy",
        category: "Stack",
        starterCode: `function isValid(s) {
    // Your code here
    return false;
}`,
        solution: `function isValid(s) {
    const stack = [];
    const mapping = {')': '(', '}': '{', ']': '['};
    
    for (let char of s) {
        if (char in mapping) {
            if (stack.length === 0 || stack.pop() !== mapping[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
        testCases: [
          {
            input: '"()"',
            expectedOutput: 'true',
            description: 'Simple parentheses'
          },
          {
            input: '"()[]{}"',
            expectedOutput: 'true',
            description: 'Multiple bracket types'
          },
          {
            input: '"(]"',
            expectedOutput: 'false',
            description: 'Mismatched brackets'
          }
        ],
        timeLimit: 25
      },
      {
        title: "Maximum Subarray",
        description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
        difficulty: "Medium",
        category: "Dynamic Programming",
        starterCode: `function maxSubArray(nums) {
    // Your code here
    return 0;
}`,
        solution: `function maxSubArray(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}`,
        testCases: [
          {
            input: '[-2,1,-3,4,-1,2,1,-5,4]',
            expectedOutput: '6',
            description: 'Mixed positive and negative numbers'
          },
          {
            input: '[1]',
            expectedOutput: '1',
            description: 'Single element'
          },
          {
            input: '[5,4,-1,7,8]',
            expectedOutput: '23',
            description: 'Mostly positive numbers'
          }
        ],
        timeLimit: 35
      }
    ];

    // Seed behavioral questions
    const behavioralQuestions = [
      {
        question: "Tell me about a time when you had to lead a team through a difficult project.",
        category: "Leadership",
        tips: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on your specific actions and decisions",
          "Quantify the results when possible",
          "Show how you motivated and guided your team"
        ],
        starMethod: true
      },
      {
        question: "Describe a situation where you had to work with a difficult team member.",
        category: "Teamwork",
        tips: [
          "Show empathy and understanding",
          "Explain how you tried to understand their perspective",
          "Describe the steps you took to improve the relationship",
          "Focus on the positive outcome"
        ],
        starMethod: true
      },
      {
        question: "Tell me about a time when you had to solve a complex problem with limited resources.",
        category: "Problem Solving",
        tips: [
          "Clearly define the problem",
          "Explain your analytical approach",
          "Show creativity in finding solutions",
          "Demonstrate resourcefulness"
        ],
        starMethod: true
      },
      {
        question: "Describe a time when you had to communicate a complex technical concept to non-technical stakeholders.",
        category: "Communication",
        tips: [
          "Show how you adapted your communication style",
          "Explain the techniques you used to simplify concepts",
          "Demonstrate active listening",
          "Highlight the successful outcome"
        ],
        starMethod: true
      },
      {
        question: "Tell me about a time when you disagreed with your manager or team lead.",
        category: "Conflict Resolution",
        tips: [
          "Show respect for authority while standing your ground",
          "Explain your reasoning clearly",
          "Demonstrate willingness to compromise",
          "Focus on the professional resolution"
        ],
        starMethod: true
      },
      {
        question: "Describe a time when you failed at something important.",
        category: "General",
        tips: [
          "Be honest about the failure",
          "Take responsibility for your part",
          "Explain what you learned from the experience",
          "Show how you applied those lessons later"
        ],
        starMethod: true
      },
      {
        question: "Tell me about a time when you had to learn a new technology or skill quickly.",
        category: "General",
        tips: [
          "Describe your learning approach",
          "Show initiative and self-motivation",
          "Explain how you applied the new knowledge",
          "Demonstrate continuous learning mindset"
        ],
        starMethod: true
      },
      {
        question: "Describe a time when you had to make a decision with incomplete information.",
        category: "Problem Solving",
        tips: [
          "Explain your decision-making process",
          "Show how you gathered available information",
          "Describe how you managed risks",
          "Highlight the outcome and lessons learned"
        ],
        starMethod: true
      }
    ];

    // Insert the data
    await CodingChallenge.insertMany(codingChallenges);
    await BehavioralQuestion.insertMany(behavioralQuestions);

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      codingChallenges: codingChallenges.length,
      behavioralQuestions: behavioralQuestions.length
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
