import { NextResponse } from 'next/server';
import { completeGameSession } from '@/utils/database';

export async function POST(request: Request) {
  try {
    const { sessionId, timeTaken, isCorrect } = await request.json();
    const session = await completeGameSession(sessionId, timeTaken, isCorrect);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}

