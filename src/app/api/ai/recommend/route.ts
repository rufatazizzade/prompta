import { NextResponse } from 'next/server';
import { getAIRecommendation } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const { taskDescription } = await request.json();
    if (!taskDescription) {
      return NextResponse.json({ error: 'Task description required' }, { status: 400 });
    }
    const recommendation = await getAIRecommendation(taskDescription);
    return NextResponse.json(recommendation);
  } catch (error) {
    console.error('Recommendation error:', error);
    return NextResponse.json({ error: 'Failed to get recommendation' }, { status: 500 });
  }
}
