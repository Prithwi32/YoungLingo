import { NextResponse } from 'next/server';

function calculateSimilarity(str1: string, str2: string): number {
  const normalizedStr1 = str1.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Remove punctuation
  const normalizedStr2 = str2.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // Remove punctuation

  if (normalizedStr1 === normalizedStr2) {
    return 1.0;
  }

  if (!normalizedStr1 || !normalizedStr2) {
    return 0.0;
  }

  const longer = normalizedStr1.length > normalizedStr2.length ? normalizedStr1 : normalizedStr2;
  const shorter = normalizedStr1.length > normalizedStr2.length ? normalizedStr2 : normalizedStr1;
  const longerLength = longer.length;

  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string): number {
  const costs = new Array(s2.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= s1.length; i++) {
    let prevCost = i;
    for (let j = 1; j <= s2.length; j++) {
      const currentCost = s1[i - 1] === s2[j - 1] ? costs[j - 1] : Math.min(costs[j - 1], prevCost, costs[j]) + 1;
      costs[j - 1] = prevCost;
      prevCost = currentCost;
    }
    costs[s2.length] = prevCost;
  }
  return costs[s2.length];
}

export async function POST(request: Request) {
  try {
    const { userAnswer, correctAnswer } = await request.json();

    if (!userAnswer || !correctAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const similarity = calculateSimilarity(userAnswer, correctAnswer);
    const accuracy = Math.round(similarity * 100);

    return NextResponse.json({ accuracy });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
