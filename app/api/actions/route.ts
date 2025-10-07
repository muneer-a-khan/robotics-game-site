// Record Game Actions API

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, actions } = await request.json();
    
    // Validate input
    if (!sessionId || !actions || !Array.isArray(actions)) {
      return NextResponse.json(
        { error: 'Session ID and actions array are required' },
        { status: 400 }
      );
    }
    
    // Batch insert actions
    await prisma.gameAction.createMany({
      data: actions.map((action: any) => ({
        sessionId,
        actionType: action.actionType,
        componentType: action.componentType,
        componentId: action.componentId,
        snapPointIds: action.snapPointIds,
        orientation: action.orientation,
        timestamp: action.timestamp || new Date(),
      })),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording actions:', error);
    return NextResponse.json(
      { error: 'Failed to record actions' },
      { status: 500 }
    );
  }
}

