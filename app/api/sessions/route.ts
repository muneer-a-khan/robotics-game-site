import { NextResponse } from 'next/server';
import { createGameSession } from '@/utils/database';

export async function POST(request: Request) {
  try {
    const { circuitNumber, difficulty, userId } = await request.json();
    const session = await createGameSession(circuitNumber, difficulty, userId);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

