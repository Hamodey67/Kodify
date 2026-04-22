import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const prompt = messages[messages.length - 1].content;
    const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();

    // استخدام النسخة المستقرة v1 والرابط الكامل للموديل
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });


    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "خطأ من جوجل");
    }

    const text = data.candidates[0].content.parts[0].text;
    return new Response(text);

  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: "فشل الاتصال المباشر", 
      details: error.message 
    }), { status: 500 });
  }
}

