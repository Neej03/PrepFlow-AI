import { NextRequest, NextResponse } from 'next/server';
import { generateRandomQuizWithGemini } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, title, personalization, customApiKey } = body;

    const quizSet = await generateRandomQuizWithGemini(
      content || title || 'Study Material',
      title || 'Lecture Material',
      personalization || { subject: 'Computer Science', studyLevel: 'Intermediate', studyGoal: 'Exam Preparation' },
      customApiKey
    );

    return NextResponse.json({ success: true, quizSet });
  } catch (error: any) {
    console.error('[Random Quiz API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate random quiz set.' },
      { status: 500 }
    );
  }
}
