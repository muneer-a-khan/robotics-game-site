// Create Game Session API

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { circuitNumber, difficulty } = await request.json();
    
    // Validate input
    if (!circuitNumber || !difficulty) {
      return NextResponse.json(
        { error: 'Circuit number and difficulty are required' },
        { status: 400 }
      );
    }
    
    // Create session
    const session = await prisma.gameSession.create({
      data: {
        circuitNumber,
        difficulty,
      },
    });
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

