import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const maxDuration = 30;

const apiKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { messages, lang } = await req.json();
    const currentLangName = lang === 'ku' ? 'Kurdish' : lang === 'en' ? 'English' : 'Arabic';

    // استخدام الموديل الأكثر توافقاً حالياً
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: `You are Kody, official AI for Kodify. Language: ${currentLangName}. Use Iraqi dialect for Arabic.` }]
      }
    });

    const prompt = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    
    const geminiStream = await chat.sendMessageStream(prompt);
    const stream = GoogleGenerativeAIStream(geminiStream);
    
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error("CRITICAL ERROR:", error.message);
    return new Response(JSON.stringify({ 
      error: "الخدمة قد تكون غير مدعومة في منطقتك حالياً أو هناك خلل في المفتاح", 
      details: error.message 
    }), { status: 500 });
  }
}
