// Get Circuit Configuration API

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const circuitNumber = parseInt(searchParams.get('circuitNumber') || '1');
    const difficulty = searchParams.get('difficulty') || 'easy';
    
    // Fetch circuit
    const circuit = await prisma.circuit.findUnique({
      where: {
        circuitNumber_difficulty: {
          circuitNumber,
          difficulty,
        },
      },
    });
    
    if (!circuit) {
      return NextResponse.json(
        { error: 'Circuit not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(circuit);
  } catch (error) {
    console.error('Error fetching circuit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch circuit' },
      { status: 500 }
    );
  }
}

