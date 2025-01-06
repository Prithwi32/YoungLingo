import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

type Level = 'BASIC' | 'MEDIUM' | 'HARD';
type Format = 'LETTER' | 'WORD' | 'SENTENCE';

interface Question {
  id: string;
  text: string;
  audioUrl: string;
  difficulty: Level;
  format: Format;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function generatePrompt(format: Format, level: Level): string {
  const complexityLevel = {
    'BASIC': 'simple',
    'MEDIUM': 'intermediate',
    'HARD': 'advanced',
  }[level];

  switch (format) {
    case 'LETTER':
      return level === 'HARD'
        ? `Generate 10 unique advanced combinations of English letters (e.g., "BZX", "QRM"). Each combination should be on a new line. Do not include any additional text or explanations.`
        : `Generate 10 unique ${complexityLevel} English letters. Each letter should be on a new line. Do not include any additional text or explanations.`;
    case 'WORD':
      return `Generate 10 unique ${complexityLevel} English words. Each word should be on a new line. Do not include any additional text or explanations.`;
    case 'SENTENCE':
      return `Generate 10 unique ${complexityLevel} English sentences. Each sentence should be grammatically correct and on a new line. The sentences should vary in structure and vocabulary. Do not include any additional text or explanations.`;
    default:
      throw new Error('Invalid format');
  }
}

async function generateQuestionsWithGemini(format: Format, level: Level): Promise<string[]> {
  const prompt = generatePrompt(format, level);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.split('\n').filter(item => item.trim() !== '').slice(0, 10);
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw error;
  }
}

async function textToSpeech(text: string): Promise<string> {
  const { stdout, stderr } = await execAsync(`python scripts/text_to_speech.py "${text}"`);
  if (stderr) {
    console.error('Error in Python script:', stderr);
    throw new Error('Failed to generate audio');
  }
  return `data:audio/mp3;base64,${stdout.trim()}`;
}

export async function POST(request: Request) {
  try {
    const { level, format } = await request.json();

    if (!['LETTER', 'WORD', 'SENTENCE'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    if (!['BASIC', 'MEDIUM', 'HARD'].includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const texts = await generateQuestionsWithGemini(format, level);
    const questions: Question[] = await Promise.all(texts.map(async (text) => ({
      id: uuidv4(),
      text,
      audioUrl: await textToSpeech(text),
      difficulty: level,
      format,
    })));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
