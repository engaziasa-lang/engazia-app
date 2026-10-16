import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { jobDescription, skills, tone } = await req.json();
    
    // المتغير الجديد الخاص بمفتاح جوجل
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
         result: `[System Note: Please add GEMINI_API_KEY in Vercel]\n\nHi there,\n\nI just read your job posting and I'm confident I can help you achieve your goals. With my expertise in ${skills || 'the required technologies'}, I have a track record of delivering high-quality work.\n\nMy approach is highly ${tone.toLowerCase()}, ensuring we hit the ground running.\n\nLet's chat further about your specific needs.\n\nBest,\n[Your Name]` 
      });
    }

    // التعليمات الصارمة التي سنرسلها لـ Gemini
    const prompt = `You are an expert freelance copywriter. Write a highly-converting, concise, and engaging Upwork proposal based on the user's job description. Tone: ${tone}. Highlight these skills: ${skills}. Do not use robotic language. Keep it natural and professional. Job Description: ${jobDescription}`;

    // الاتصال المباشر بمحرك Gemini 1.5 Flash الأسرع
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
       console.error("Gemini API Error:", data);
       throw new Error("Failed to connect to Gemini");
    }

    // استخراج النص من رد جوجل
    const proposal = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ result: proposal });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to generate proposal' }, { status: 500 });
  }
}
