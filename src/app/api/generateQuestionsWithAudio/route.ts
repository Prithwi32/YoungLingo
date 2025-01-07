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

// Fallback data for when API is unavailable
const fallbackQuestions = {
  LETTER: {
    BASIC: [
      'A', 'B', 'C', 'D', 'E',
      'F', 'G', 'H', 'I', 'J'
    ],
    MEDIUM: [
      'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T'
    ],
    HARD: [
      'BZX', 'QRM', 'WKP', 'YVF', 'HJN',
      'DLT', 'CGS', 'NXZ', 'PMQ', 'VWY'
    ]
  },
  WORD: {
    BASIC: [
      'cat', 'dog', 'house', 'book', 'tree',
      'fish', 'bird', 'car', 'sun', 'moon'
    ],
    MEDIUM: [
      'elephant', 'computer', 'mountain', 'library', 'ocean',
      'butterfly', 'telephone', 'umbrella', 'calendar', 'diamond'
    ],
    HARD: [
      'extraordinary', 'sophisticated', 'phenomenon', 'magnificent', 'revolutionary',
      'philosophical', 'unprecedented', 'enthusiastic', 'determination', 'consciousness'
    ]
  },
  SENTENCE: {
    BASIC: [
      'The cat sits on the mat.',
      'I like to read books.',
      'The sun is bright today.',
      'She walks to school.',
      'They play in the park.',
      'He drinks water.',
      'The bird flies high.',
      'We eat breakfast together.',
      'The dog runs fast.',
      'The flowers are beautiful.'
    ],
    MEDIUM: [
      'The curious student asked many interesting questions during the lecture.',
      'She carefully examined the ancient artifact in the museum.',
      'The chef prepared a delicious meal using fresh ingredients.',
      'The mountain climbers reached the summit before sunset.',
      'The musician practiced diligently for the upcoming concert.',
      'The scientist conducted experiments in the laboratory.',
      'The artist painted a stunning landscape of the valley.',
      'The detective solved the mysterious case last week.',
      'The gardener planted colorful flowers in the garden.',
      'The writer published her first novel this year.'
    ],
    HARD: [
      'Despite the challenging circumstances, she persevered and achieved her goals through dedication and hard work.',
      'The revolutionary technological advancement transformed the way people communicate across the globe.',
      'The professor\'s comprehensive analysis of the complex phenomenon led to groundbreaking discoveries.',
      'The intricate relationship between environmental factors and economic development requires careful consideration.',
      'The symphony orchestra delivered a magnificent performance that captivated the audience throughout the evening.',
      'The archaeological expedition uncovered remarkable artifacts that shed light on ancient civilizations.',
      'The innovative solution proposed by the team addressed multiple aspects of the persistent problem.',
      'The documentary film explored the profound impact of climate change on indigenous communities.',
      'The philosophical debate about consciousness continues to intrigue scholars across different disciplines.',
      'The unprecedented collaboration between scientists worldwide accelerated the development of crucial research.'
    ]
  }
};

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
  try {
    const prompt = generatePrompt(format, level);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.split('\n').filter(item => item.trim() !== '').slice(0, 10);
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    // Return fallback questions when API fails
    return fallbackQuestions[format][level];
  }
}

async function textToSpeech(text: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(`python scripts/text_to_speech.py "${text}"`);
    if (stderr) {
      console.error('Error in Python script:', stderr);
      throw new Error('Failed to generate audio');
    }
    return `data:audio/mp3;base64,${stdout.trim()}`;
  } catch (error) {
    console.error('Error generating audio:', error);
    return 'data:audio/mp3;base64,'; // Return an empty audio data URL as fallback
  }
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
    const questions: Question[] = [];

    for (const text of texts) {
      const audioUrl = await textToSpeech(text);
      questions.push({
        id: uuidv4(),
        text,
        audioUrl,
        difficulty: level,
        format,
      });
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

