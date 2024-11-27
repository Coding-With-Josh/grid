import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPromptForEnhancement = (type: string, content: string, tone?: string) => {
  const prompts = {
    grammar: `Please improve the grammar, spelling, and style of the following text while maintaining its original meaning. Make it clear and professional:\n\n${content}`,
    tone: `Please rewrite the following text to have a ${tone} tone while maintaining its core message:\n\n${content}`,
    expand: `Please expand and elaborate on the following text, adding relevant details and examples while maintaining its core message:\n\n${content}`,
    summarize: `Please provide a concise summary of the following text, capturing its main points and key messages:\n\n${content}`,
  };

  return prompts[type as keyof typeof prompts] || prompts.grammar;
};

export async function POST(req: Request) {
  try {
    const { enhanceType, content, targetTone } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert content editor and writer. Your task is to enhance and improve content while maintaining its core message and intent."
        },
        {
          role: "user",
          content: getPromptForEnhancement(enhanceType, content, targetTone)
        }
      ],
      model: "gpt-3.5-turbo-1106",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const enhancedContent = completion.choices[0].message.content;

    return NextResponse.json({
      enhancedContent,
    });
  } catch (error) {
    console.error('Content enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance content' },
      { status: 500 }
    );
  }
}
