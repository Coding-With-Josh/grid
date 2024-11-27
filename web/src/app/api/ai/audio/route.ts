import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const voiceMap = {
  'male1': 'echo',
  'male2': 'fable',
  'female1': 'nova',
  'female2': 'shimmer',
};

export async function POST(req: Request) {
  try {
    const { text, voiceType } = await req.json();

    // First, enhance the text if needed using GPT-4
    const enhancedTextCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional voice script writer. Enhance the given text to sound more natural when spoken, while maintaining the original meaning."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "gpt-4-turbo-preview",
      max_tokens: 500,
    });

    const enhancedText = enhancedTextCompletion.choices[0].message.content;

    // Generate speech using OpenAI's text-to-speech
    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: voiceMap[voiceType] || 'alloy',
      input: enhancedText || text,
    });

    // Convert the speech response to base64
    const audioBuffer = Buffer.from(await speech.arrayBuffer());
    const audioBase64 = audioBuffer.toString('base64');

    return NextResponse.json({
      audio: audioBase64,
      enhancedText,
    });
  } catch (error) {
    console.error('Audio generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
