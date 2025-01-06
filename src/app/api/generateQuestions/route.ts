import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

type Level = 'BASIC' | 'MEDIUM' | 'HARD'
type Format = 'WORD' | 'SENTENCE'

interface Question {
  text: string
  difficulty: Level
  format: Format
}

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function generatePrompt(format: Format, level: Level): string {
  const complexityLevel = {
    'BASIC': 'simple',
    'MEDIUM': 'intermediate',
    'HARD': 'advanced'
  }[level];

  if (format === 'WORD') {
    return `Generate 10 ${complexityLevel} English words. Each word should be on a new line. Do not include any additional text or explanations.`;
  } else {
    return `Generate 10 ${complexityLevel} English sentences. Each sentence should be grammatically correct and on a new line. The sentences should vary in structure and vocabulary. Do not include any additional text or explanations.`;
  }
}

async function generateQuestionsWithGemini(format: Format, level: Level): Promise<Question[]> {
  const prompt = generatePrompt(format, level);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const items = text.split('\n').filter(item => item.trim() !== '');

    return items.slice(0, 10).map(item => ({
      text: item.trim(),
      difficulty: level,
      format: format
    }));
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { level, format } = await request.json();

    if (format !== 'WORD' && format !== 'SENTENCE') {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    if (level !== 'BASIC' && level !== 'MEDIUM' && level !== 'HARD') {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const questions = await generateQuestionsWithGemini(format, level);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

