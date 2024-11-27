import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptForReview = (type: string, code: string) => {
  const prompts = {
    general: `Review the following code and provide:
    1. A brief summary of what the code does
    2. A list of potential issues or code smells
    3. Specific suggestions for improvement
    4. Improved version of the code (if applicable)
    Format your response as a JSON object with these keys: summary, issues (array), suggestions (array), improvedCode (optional)
    
    Code to review:
    ${code}`,
    
    security: `Perform a security review of the following code. Look for:
    1. Common security vulnerabilities
    2. Potential attack vectors
    3. Data handling issues
    4. Authentication/authorization concerns
    5. Input validation problems
    Provide specific examples and fixes where applicable.
    Format your response as a JSON object with these keys: summary, issues (array), suggestions (array), improvedCode (optional)
    
    Code to review:
    ${code}`,
  };

  return prompts[type as keyof typeof prompts] || prompts.general;
};

export async function POST(req: Request) {
  try {
    const { code, type } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer with deep knowledge of software development best practices, design patterns, and security principles."
        },
        {
          role: "user",
          content: getPromptForReview(type, code)
        }
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Clean up code blocks if present in improvedCode
    if (result.improvedCode) {
      result.improvedCode = result.improvedCode
        .replace(/\`\`\`[\w-]*\n/g, "")
        .replace(/\`\`\`$/g, "")
        .trim();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Code review error:', error);
    return NextResponse.json(
      { error: 'Failed to review code' },
      { status: 500 }
    );
  }
}
