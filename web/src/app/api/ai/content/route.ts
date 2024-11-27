import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { contentType, description } = await req.json();

    let prompt = '';
    let maxTokens = 500;

    switch (contentType) {
      case 'blog':
        prompt = `Write a blog post about: ${description}\n\nMake it engaging, well-structured, and SEO-friendly.`;
        maxTokens = 1000;
        break;
      case 'x':
        prompt = `Write a Twitter/X post about: ${description}\n\nMake it engaging and within 280 characters.`;
        maxTokens = 100;
        break;
      case 'instagram':
        prompt = `Write an Instagram post about: ${description}\n\nInclude relevant hashtags and make it engaging.`;
        maxTokens = 200;
        break;
      case 'email':
        prompt = `Write a professional email about: ${description}\n\nMake it concise and professional.`;
        maxTokens = 500;
        break;
      case 'script':
        prompt = `Write a video script about: ${description}\n\nInclude clear sections for visuals and audio.`;
        maxTokens = 1000;
        break;
      default:
        prompt = `Write content about: ${description}`;
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional content writer skilled in creating various types of content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo-1106",
      max_tokens: maxTokens,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
