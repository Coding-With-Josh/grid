import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languagePrompts = {
  python: "Write clean, well-documented Python code with type hints and docstrings.",
  javascript: "Write clean, modern JavaScript code using ES6+ features.",
  typescript: "Write clean TypeScript code with proper type definitions and interfaces.",
  java: "Write clean, object-oriented Java code following best practices.",
  cpp: "Write clean, modern C++ code following best practices.",
  csharp: "Write clean C# code following .NET conventions and best practices.",
};

export async function POST(req: Request) {
  try {
    const { description, language } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert software developer. ${languagePrompts[language as keyof typeof languagePrompts]} 
          Include error handling, proper documentation, and follow language-specific best practices. 
          Return ONLY the code without any additional explanations.`
        },
        {
          role: "user",
          content: description
        }
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.3,
      max_tokens: 2000,
    });

    let code = completion.choices[0].message.content || "";
    
    // Clean up markdown code blocks if present
    code = code.replace(/\`\`\`[\w-]*\n/g, "").replace(/\`\`\`$/g, "");

    return NextResponse.json({
      code: code.trim(),
    });
  } catch (error) {
    console.error('Code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
