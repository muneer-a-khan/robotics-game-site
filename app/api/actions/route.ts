import { NextResponse } from 'next/server';
import { 
  trackPlaceComponent, 
  trackRemoveComponent, 
  trackAddWire, 
  trackRemoveWire 
} from '@/utils/database';

export async function POST(request: Request) {
  try {
    const { actionType, sessionId, data } = await request.json();

    let result;
    switch (actionType) {
      case 'place_component':
        result = await trackPlaceComponent(
          sessionId,
          data.componentType,
          data.componentId,
          data.gridPosition,
          data.orientation
        );
        break;
      case 'remove_component':
        result = await trackRemoveComponent(sessionId, data.componentId);
        break;
      case 'add_wire':
        result = await trackAddWire(sessionId, data.wireData);
        break;
      case 'remove_wire':
        result = await trackRemoveWire(sessionId, data.wireData);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error tracking action:', error);
    return NextResponse.json(
      { error: 'Failed to track action' },
      { status: 500 }
    );
  }
}

