// Get Leaderboard API

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const difficulty = searchParams.get('difficulty');
    const circuitNumber = searchParams.get('circuitNumber');
    
    // Build where clause
    const where: any = {
      completed: true,
      isCorrect: true,
    };
    
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    if (circuitNumber) {
      where.circuitNumber = parseInt(circuitNumber);
    }
    
    // Fetch sessions
    const sessions = await prisma.gameSession.findMany({
      where,
      orderBy: {
        timeTaken: 'asc',
      },
      take: limit,
      select: {
        id: true,
        circuitNumber: true,
        difficulty: true,
        timeTaken: true,
        isCorrect: true,
        createdAt: true,
      },
    });
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

