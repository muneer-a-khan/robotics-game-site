import { NextResponse } from 'next/server';
import { getCircuitChallenge } from '@/utils/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const circuitNumber = parseInt(searchParams.get('circuitNumber') || '1');
    const difficulty = searchParams.get('difficulty') || 'easy';

    if (!['easy', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }

    const circuit = await getCircuitChallenge(circuitNumber, difficulty as 'easy' | 'hard');
    
    if (!circuit) {
      return NextResponse.json({ error: 'Circuit not found' }, { status: 404 });
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

