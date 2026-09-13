import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFileBuffer } from '@/lib/fileParser';
import { analyzeStudyMaterialWithGemini, generateDemoOrFallbackAnalysis } from '@/lib/gemini';
import { PersonalizationSettings } from '@/types';

export const maxDuration = 60; // Allow 60 seconds processing window for AI

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textContent = (formData.get('textContent') as string) || '';
    const isDemo = formData.get('isDemo') === 'true';

    const fileName = (formData.get('fileName') as string) || (file ? file.name : 'Lecture_Material.txt');
    const fileType = (formData.get('fileType') as string) || (file ? file.type : 'text/plain');
    const customApiKey = (formData.get('customApiKey') as string) || undefined;

    const personalization: PersonalizationSettings = {
      subject: (formData.get('subject') as any) || 'Computer Science',
      studyLevel: (formData.get('studyLevel') as any) || 'Intermediate',
      studyGoal: (formData.get('studyGoal') as any) || 'Exam Preparation',
      language: (formData.get('language') as any) || 'en',
    };

    if (isDemo) {
      const demoMaterial = generateDemoOrFallbackAnalysis(
        'Artificial Intelligence and Neural Networks Core Principles',
        'Introduction_to_AI_and_Neural_Networks.pdf',
        'application/pdf',
        personalization
      );
      return NextResponse.json({ success: true, material: demoMaterial });
    }

    let rawText = textContent;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      rawText = await extractTextFromFileBuffer(buffer, fileName, fileType);
    }

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'The uploaded file appears to be empty or unreadable. Please check the document and try again.' 
        },
        { status: 400 }
      );
    }

    const material = await analyzeStudyMaterialWithGemini(
      rawText,
      fileName,
      fileType,
      personalization,
      customApiKey
    );

    return NextResponse.json({ success: true, material });
  } catch (error: any) {
    console.error('Error processing study material:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Something went wrong while processing your study material. Please verify your file or try again.' 
      },
      { status: 500 }
    );
  }
}
