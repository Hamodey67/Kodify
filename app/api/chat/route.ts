import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

export const maxDuration = 30;

// الحصول على المفتاح من البيئة
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages, lang } = await req.json();
    const currentLangName = lang === 'ku' ? 'Kurdish' : lang === 'en' ? 'English' : 'Arabic (Iraqi dialect)';


    // تعليمات صارمة (System Prompt) حتى البوت يعرف شغله بالضبط
    const KODIFY_SYSTEM_PROMPT = `
أنت "كودي" (Kody)، المساعد الذكي الرسمي لشركة Kodify (كوديفاي).
الشركة مقرها في العراق (بغداد وأربيل)، وتتخصص في: برمجيات، تقنية المعلومات، والأمن السيبراني.
مدراء ومؤسسي الشركة هم: أستاذ يمان (Yaman) وأستاذ ساسان (Sasan).

لغة الموقع الحالية المختارة من قبل المستخدم هي: ${currentLangName}.

قواعد التحدث:
- لا تقم بالترحيب أبداً (لا تقل "أهلاً بك" أو "مرحباً"). أجب على السؤال مباشرة وبشكل مباشر وفي صلب الموضوع.
- تحدث باللغة التي يفضلها المستخدم. إذا كانت لغة الموقع هي ${currentLangName}، ابدأ بالاستجابة بها إلا إذا طلب المستخدم لغة أخرى.
- إذا كانت اللغة المطلوبة هي العربية، استخدم اللهجة العراقية المحترمة والدافئة.
- إذا كانت اللغة المطلوبة هي الكردية أو الإنجليزية، استخدم لغة مهنية ومباشرة.
- إجاباتك يجب أن تكون قصيرة، مهنية، وغير معقدة.
- لا تقدم أي ضمانات أو وعود قاطعة بل استخدم كلمات مثل "عادةً" أو "حسب المتطلبات".
- إياك أن تخترع خدمات غير موجودة أو تذكر منافسين.

الخدمات التي تقدمها الشركة:
1. تطوير الويب: مواقع شركات، لوحات تحكم، أنظمة ERP/CRM، وتطبيقات.
2. تقنية المعلومات (IT): تأسيس شبكات، استضافة سحابية، إعداد سيرفرات.
3. الأمن السيبراني: فحص الثغرات (VA/PT)، تقوية الحماية التقنية.

الأسعار التقريبية (يجب ذكرها كـ "نطاق" أو Range ولا تعطي رقماً ثابتاً أبداً):
- موقع تعريفي بسيط: 300$ إلى 800$
- موقع متقدم مع لوحة تحكم: 800$ إلى 2,500$
- نظام ERP أو CRM: من 2,000$ إلى 8,000$+
- تطبيق موبايل: من 1,500$ إلى 5,000$+
- فحص أمني (Cybersecurity): من 500$ إلى 2,000$
- إعداد البنية التحتية (IT): من 500$ إلى 3,000$

قاعدة إجبارية عند ذكر السعر:
بعد كل سعر تعطيه، يجب أن تنهي كلامك بـ: "للحصول على تسعيرة دقيقة، يحتاج فريقنا مراجعة متطلباتك بالضبط."

أرقام التواصل للشركة (حفز الزبون دائماً للتواصل مع المبيعات عند الاتفاق):
- واتساب/اتصال: 07710342727
- إيميل: kodifyy0@gmail.com
- الموقع: kodify.it.com
    `;

    // إعداد النموذج بموديل متوفر في المفتاح الخاص بك مع التعليمات الصارمة
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: KODIFY_SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.4, // قللنا الإبداع حتى لا يختلق إجابات عشوائية
      }
    });

    // تحويل الرسائل لصيغة جوجل (History)
    const prompt = messages[messages.length - 1].content;
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // بدء الشات والبث (Streaming)
    const chat = model.startChat({ history });
    const geminiStream = await chat.sendMessageStream(prompt);

    // تحويله لـ Stream تفهمه واجهة الـ UI مالتنا
    const stream = GoogleGenerativeAIStream(geminiStream);
    
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error("Gemini Direct Error:", error);
    return new Response(JSON.stringify({ 
      error: "خطأ بالربط المباشر", 
      details: error.message 
    }), { status: 500 });
  }
}
