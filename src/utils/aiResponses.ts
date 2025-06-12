const SYSTEM_PROMPT = `A user will ask you to solve a task. You should first draft your thinking process (inner monologue) until you have derived the final answer. Afterwards, write a self-contained summary of your thoughts (i.e. your summary should be succinct but contain all the critical steps you needed to reach the conclusion). You should use Markdown to format your response. Write both your thoughts and summary in the same language as the task posed by the user. NEVER use \\boxed{} in your response.

Your thinking process must follow the template below:
<think>
Your thoughts or/and draft, like working through an exercise on scratch paper. Be as casual and as long as you want until you are confident to generate a correct answer.
</think>

Here, provide a concise summary that reflects your reasoning and presents a clear final answer to the user. Don't mention that this is a summary.`;

type InterviewStage = 'greeting' | 'introduction' | 'technical' | 'behavioral' | 'leadership' | 'closing';

const CURRENT_MODELS = [
  "https://api-inference.huggingface.co/pipeline/text-generation/facebook/opt-350m",
  "https://api-inference.huggingface.co/pipeline/text-generation/gpt2",
  "https://api-inference.huggingface.co/pipeline/text-generation/EleutherAI/gpt-neo-125M"
];

const generateFallbackResponse = (userMessage: string, stage: InterviewStage): string => {
  // Handle very short or unclear responses
  if (userMessage.length < 5) {
    return "I'd like to hear more about your experience. Could you elaborate on that?";
  }

  // Handle common short responses
  const shortResponses: { [key: string]: string } = {
    'hello': "Hello! I'm here to help you practice for your technical interviews. Could you tell me about your background in software development?",
    'hi': "Hi there! I'm your AI interview coach. Could you share a bit about your experience in software development?",
    'hey': "Hey! I'm here to help you prepare for technical interviews. What's your background in software development?",
    'how': "I'd like to understand your experience better. Could you tell me about your background in software development?",
    'what': "I'm interested in learning more about your experience. Could you share your background in software development?",
    'whats': "I'd like to know more about your experience. Could you tell me about your background in software development?"
  };

  // Check for short responses first
  const lowerMessage = userMessage.toLowerCase().trim();
  if (shortResponses[lowerMessage]) {
    return shortResponses[lowerMessage];
  }

  // Stage-specific responses
  const responses = {
    greeting: "Thanks for sharing! I'd like to learn more about your technical background. Can you walk me through a recent project you're particularly proud of?",
    introduction: "That's interesting! Could you tell me more about your role in that project and what technologies you used?",
    technical: "Thanks for sharing that. How do you stay current with new technologies? Can you give me an example of something new you learned recently?",
    behavioral: "I appreciate that perspective. Could you tell me about a time when you had to work with a difficult team member? How did you handle it?",
    leadership: "That's insightful. Have you ever had to make a difficult technical decision? How did you approach it?",
    closing: "Thank you for sharing. What questions do you have about the role or the company?"
  };

  // If the message is very short, use a more engaging prompt
  if (userMessage.length < 20) {
    return "I'd like to hear more details about your experience. Could you elaborate on that?";
  }

  // Use stage-specific response or default
  return responses[stage] || "That's interesting! Could you tell me more about that?";
};

export async function generateAIResponse(prompt: string): Promise<string> {
  const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
  
  if (!API_KEY) {
    console.error('Hugging Face API key not found in environment variables');
    return generateFallbackResponse(prompt, 'introduction');
  }

  // Try each model until one works
  for (const modelUrl of CURRENT_MODELS) {
    try {
      console.log(`Trying model: ${modelUrl}`);
      
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Interviewer: ${prompt}\nCandidate:`,
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      });

      console.log(`Response status for ${modelUrl}:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Success with model:', modelUrl, data);
        
        let generatedText = '';
        if (Array.isArray(data) && data[0]?.generated_text) {
          generatedText = data[0].generated_text;
        } else if (data.generated_text) {
          generatedText = data.generated_text;
        }
        
        if (generatedText && generatedText.length > 20) {
          // Clean up the response
          const cleaned = generatedText
            .replace(/Interviewer:.*?\nCandidate:/i, '')
            .replace(/Candidate:/i, '')
            .trim();
          
          if (cleaned.length > 15) {
            return cleaned;
          }
        }
      } else {
        const errorText = await response.text();
        console.log(`Model ${modelUrl} failed:`, response.status, errorText);
      }
    } catch (error) {
      console.log(`Error with model ${modelUrl}:`, error);
      continue;
    }
  }
  
  // If all models fail, use fallback
  console.log('All models failed, using fallback response');
  return generateFallbackResponse(prompt, 'introduction');
}

export async function testAPIConnection(): Promise<boolean> {
  try {
    await generateAIResponse('Test connection');
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
} 