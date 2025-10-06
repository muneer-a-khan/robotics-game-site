import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/utils/database';

export async function GET() {
  try {
    const sessions = await getLeaderboard(20);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

