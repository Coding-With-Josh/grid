import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type AIProvider = 'openai' | 'anthropic';

export async function generateWithFallback(params: {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: 'text' | 'json';
}) {
  const { prompt, maxTokens = 1000, temperature = 0.7, responseFormat = 'text' } = params;

  try {
    // Try OpenAI first
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo-1106",
      temperature,
      max_tokens: maxTokens,
      response_format: responseFormat === 'json' ? { type: "json_object" } : undefined,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.warn('OpenAI API error, falling back to Claude:', error);

    // Fallback to Claude
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: maxTokens,
      temperature,
      system: responseFormat === 'json' 
        ? "You are a helpful AI assistant. Always respond in valid JSON format."
        : "You are a helpful AI assistant.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.content[0].text;
  }
}
