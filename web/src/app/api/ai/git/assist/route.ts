import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptForGitAction = (type: string, input: string) => {
  const prompts = {
    commit: `Generate a clear and descriptive commit message following conventional commit format for the following changes. 
    The message should have a type (feat, fix, docs, style, refactor, test, chore), an optional scope, and a clear description.
    Include a longer description in the body if necessary.
    Format your response as a JSON object with this key: commitMessage
    
    Changes to commit:
    ${input}`,
    
    analyze: `Analyze the following git changes and provide:
    1. A detailed analysis of the changes and their impact
    2. Potential concerns or issues to consider
    3. Suggestions for improvement or best practices
    Format your response as a JSON object with these keys: analysis (array), suggestions (array)
    
    Changes to analyze:
    ${input}`,
  };

  return prompts[type as keyof typeof prompts] || prompts.commit;
};

export async function POST(req: Request) {
  try {
    const { input, type } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert Git user with deep knowledge of version control best practices, conventional commits, and code review principles."
        },
        {
          role: "user",
          content: getPromptForGitAction(type, input)
        }
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error) {
    console.error('Git assist error:', error);
    return NextResponse.json(
      { error: 'Failed to process git request' },
      { status: 500 }
    );
  }
}
