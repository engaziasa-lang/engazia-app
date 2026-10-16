import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobDescription, skills, tone } = await req.json();
    
    // هذا المتغير سيبحث عن مفتاح الذكاء الاصطناعي الذي سنضعه لاحقاً في إعدادات Vercel
    const apiKey = process.env.OPENAI_API_KEY;

    // إذا لم نقم بوضع المفتاح بعد، سيعيد النظام رسالة تجريبية ذكية
    if (!apiKey) {
      return NextResponse.json({ 
         result: `[System Note: Please add OPENAI_API_KEY in Vercel to activate real AI]\n\nHi there,\n\nI just read your job posting and I'm confident I can help you achieve your goals. With my expertise in ${skills || 'the required technologies'}, I have a track record of delivering high-quality work.\n\nMy approach is highly ${tone.toLowerCase()}, ensuring we hit the ground running.\n\nLet's chat further about your specific needs.\n\nBest,\n[Your Name]` 
      });
    }

    // الاتصال الحقيقي بمحرك الذكاء الاصطناعي (GPT-4o-mini الأسرع والأرخص)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert freelance copywriter. Write a highly-converting, concise, and engaging Upwork proposal based on the user's job description. Tone: ${tone}. Highlight these skills: ${skills}. Do not use robotic language. Keep it natural and professional.`
          },
          {
            role: 'user',
            content: jobDescription
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // استخراج النص من رد الذكاء الاصطناعي
    const proposal = data.choices[0].message.content;

    // إرسال النتيجة للواجهة الأمامية
    return NextResponse.json({ result: proposal });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
