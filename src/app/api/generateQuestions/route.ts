import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'

type Level = 'BASIC' | 'MEDIUM' | 'HARD'
type Format = 'WORD' | 'SENTENCE'

interface Question {
  id: string
  text: string
  difficulty: Level
  format: Format
}

// Fallback data for when API is unavailable
const fallbackQuestions = {
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
}

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
    return `Generate 10 ${complexityLevel} English sentences. Each sentence should be grammatically correct and on a new line.`;
  }
}

async function generateQuestionsWithGemini(format: Format, level: Level): Promise<Question[]> {
  try {
    const prompt = generatePrompt(format, level);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const items = text.split('\n').filter(item => item.trim() !== '');

    return items.slice(0, 10).map(item => ({
      id: uuidv4(),
      text: item.trim(),
      difficulty: level,
      format: format
    }));
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    // Return fallback questions when API fails
    const fallbackTexts = fallbackQuestions[format][level];
    return fallbackTexts.map(text => ({
      id: uuidv4(),
      text,
      difficulty: level,
      format: format
    }));
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

