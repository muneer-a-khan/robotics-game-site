// Complete Game Session API

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, timeTaken, isCorrect, errorDetails } = await request.json();
    
    // Validate input
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Update session
    const session = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        timeTaken,
        isCorrect,
        errorDetails,
        completedAt: new Date(),
      },
    });
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    );
  }
}

