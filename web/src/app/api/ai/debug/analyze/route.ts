import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languageContexts = {
  python: "Python programming language context",
  javascript: "JavaScript/Node.js context",
  typescript: "TypeScript context",
  java: "Java programming language context",
  cpp: "C++ programming language context",
  csharp: "C# and .NET context",
};

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert software developer and debugger in the ${languageContexts[language as keyof typeof languageContexts]}. 
          Analyze the provided code and error message, then provide:
          1. A clear explanation of the issue
          2. A detailed solution
          3. Fixed code (if applicable)
          4. Prevention tips for avoiding similar issues
          Format your response as a JSON object with these keys: issue, solution, fixedCode (optional), prevention`
        },
        {
          role: "user",
          content: code
        }
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Clean up code blocks if present in fixedCode
    if (result.fixedCode) {
      result.fixedCode = result.fixedCode
        .replace(/\`\`\`[\w-]*\n/g, "")
        .replace(/\`\`\`$/g, "")
        .trim();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Debug analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze and debug code' },
      { status: 500 }
    );
  }
}
