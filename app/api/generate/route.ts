import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobDescription, skills, tone } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ result: "⚠️ خطأ: مفتاح GEMINI_API_KEY غير موجود في Vercel إطلاقاً." });
    }

    const prompt = `You are an expert freelance copywriter. Write a highly-converting, concise, and engaging Upwork proposal based on the user's job description. Tone: ${tone}. Highlight these skills: ${skills}. Do not use robotic language. Keep it natural and professional. Job Description: ${jobDescription}`;

    // التحديث إلى الإصدار المطلوب من جوجل: gemini-3.8-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
       return NextResponse.json({ 
         result: `❌ رفض من سيرفر جوجل (Gemini API Error):\n\n${data.error?.message || 'خطأ غير معروف'}` 
       });
    }

    const proposal = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ result: proposal });

  } catch (error: any) {
    return NextResponse.json({ result: `❌ الانهيار الداخلي (Server Crash):\n\n${error.message}` });
  }
}
