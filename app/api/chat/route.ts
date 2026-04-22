import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: "Missing API Key", 
        details: "الرجاء التأكد من إضافة GOOGLE_GENERATIVE_AI_API_KEY في إعدادات Vercel" 
      }), { status: 500 });
    }

    const { messages, lang } = await req.json();
    const currentLangName = lang === 'ku' ? 'Kurdish' : lang === 'en' ? 'English' : 'Arabic (Iraqi dialect)';

    const KODIFY_SYSTEM_PROMPT = `
أنت "كودي" (Kody)، المساعد الذكي الرسمي لشركة Kodify (كوديفاي).
الشركة مقرها في العراق (بغداد وأربيل)، وتتخصص في: برمجيات، تقنية المعلومات، والأمن السيبراني.
مدراء ومؤسسي الشركة هم: أستاذ يمان (Yaman) وأستاذ ساسان (Sasan).

لغة الموقع الحالية المختارة من قبل المستخدم هي: ${currentLangName}.

قواعد التحدث:
- لا تقم بالترحيب أبداً. أجب على السؤال مباشرة.
- تحدث باللغة التي يفضلها المستخدم (${currentLangName}).
- إذا كانت اللغة المطلوبة هي العربية، استخدم اللهجة العراقية المحترمة والدافئة.
- إجاباتك يجب أن تكون قصيرة، مهنية، وغير معقدة.
- لا تقدم وعود قاطعة بل استخدم كلمات مثل "عادةً".
- لا تذكر منافسين.

الخدمات والأسعار:
1. ويب: 300$-2500$+
2. أنظمة ERP: 2000$-8000$+
3. موبايل: 1500$-5000$+
4. أمن سيبراني: 500$-2000$+

قاعدة إجبارية:
بعد كل سعر، قل: "للحصول على تسعيرة دقيقة، يحتاج فريقنا مراجعة متطلباتك بالضبط."

التواصل: 07710342727 | kodifyy0@gmail.com | kodify.it.com
    `;

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      system: KODIFY_SYSTEM_PROMPT,
      messages,
      temperature: 0.4,
      maxTokens: 500,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    return new Response(JSON.stringify({ 
      error: "خطأ في الاتصال بمزود الخدمة", 
      details: error.message 
    }), { status: 500 });
  }
}

