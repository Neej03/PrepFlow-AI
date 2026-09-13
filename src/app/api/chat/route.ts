import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;
const DEFAULT_GEMINI_KEY = 'AIzaSyDd1uwMkbkoXoSz_FNlL61NRqxFYSqexC0';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, materialContext, customApiKey, language = 'en' } = body;

    const langNames: Record<string, string> = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', hi: 'Hindi', zh: 'Chinese'
    };
    const targetLang = langNames[language] || 'English';

    const apiKey = customApiKey || process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY;

    const systemPrompt = `You are PrepFlow AI, an elite academic AI tutor and study assistant. 
Your goal is to help students master their course material, answer any academic or conceptual questions, explain complex topics simply, provide problem-solving examples, and prepare them for exams.

${materialContext ? `CURRENT STUDY MATERIAL CONTEXT:
Document Title: "${materialContext.title}"
Overview: "${materialContext.overview}"
Key Concepts: ${JSON.stringify(materialContext.keyConcepts || [])}
Definitions: ${JSON.stringify(materialContext.definitions || [])}

When relevant, reference concepts from this study material in your answers. But if the student asks any general question outside of this material, answer thoroughly and accurately.` : ''}

CRITICAL RESPONSE STYLE:
- CRITICAL: Write your entire response in ${targetLang}.
- Be encouraging, clear, and academically precise.
- Use bullet points, bold key terms, and code/math blocks where helpful.
- Keep answers structured and easy to read.`;

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history for Gemini API
    const formattedPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n` +
      messages.map((m: any) => `${m.role === 'user' ? 'Student' : 'PrepFlow AI'}: ${m.content}`).join('\n\n') +
      `\n\nPrepFlow AI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });

    const replyText = response.text || 'I am here to help you study! What concept would you like to explore?';

    return NextResponse.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error('[Gemini Chat API Error]:', error);
    return NextResponse.json(
      {
        success: true,
        reply: "I'm here to help you study! Break complex concepts down into core principles and review high-priority exam topics."
      }
    );
  }
}
