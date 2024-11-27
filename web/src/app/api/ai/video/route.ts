import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Replicate from 'replicate';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { description, addVoiceover } = await req.json();

    // First, generate a detailed script/description using GPT-4
    const scriptCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional video script writer. Create detailed scene descriptions that can be used for video generation."
        },
        {
          role: "user",
          content: `Write a detailed scene-by-scene description for a video about: ${description}`
        }
      ],
      model: "gpt-3.5-turbo-1106",
      max_tokens: 500,
    });

    const enhancedDescription = scriptCompletion.choices[0].message.content;

    // Generate video using Replicate's text-to-video model
    const video = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: enhancedDescription,
          num_frames: 50,
          fps: 24,
        }
      }
    );

    let voiceover = null;
    if (addVoiceover) {
      // Generate voiceover using OpenAI's text-to-speech
      const speech = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: enhancedDescription || description,
      });

      // Convert the speech response to base64
      const audioBuffer = Buffer.from(await speech.arrayBuffer());
      voiceover = audioBuffer.toString('base64');
    }

    return NextResponse.json({
      videoUrl: video,
      voiceover,
      script: enhancedDescription,
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
