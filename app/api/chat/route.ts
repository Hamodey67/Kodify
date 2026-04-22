import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, lang } = body;
    
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "Missing API Key" 
      }), { status: 500 });
    }

    const currentLangName = lang === 'ku' ? 'Kurdish' : lang === 'en' ? 'English' : 'Arabic';

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: `You are Kody, an AI assistant for Kodify. Language: ${currentLangName}. Use Iraqi dialect for Arabic. Be professional and concise.`,
      messages,
      temperature: 0.4,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Build/Runtime Error:", error);
    return new Response(JSON.stringify({ 
      error: "Error", 
      details: error.message 
    }), { status: 500 });
  }
}



