import { prisma } from '@/lib/prisma';
import { Component, Wire, ActionType, ComponentType, GridPosition, Orientation, Circuit } from '@/types';

/**
 * Create a new game session
 */
export async function createGameSession(
  circuitNumber: number,
  difficulty: 'easy' | 'hard',
  userId?: string
) {
  try {
    const session = await prisma.gameSession.create({
      data: {
        circuitNumber,
        difficulty,
        userId,
      },
    });
    return session;
  } catch (error) {
    console.error('Error creating game session:', error);
    throw error;
  }
}

/**
 * Track a component placement action in real-time
 */
export async function trackPlaceComponent(
  sessionId: string,
  componentType: ComponentType,
  componentId: string,
  gridPosition: GridPosition,
  orientation: Orientation
) {
  try {
    const action = await prisma.gameAction.create({
      data: {
        sessionId,
        actionType: 'place_component',
        componentType,
        componentId,
        gridPosition,
        orientation,
      },
    });
    return action;
  } catch (error) {
    console.error('Error tracking component placement:', error);
    throw error;
  }
}

/**
 * Track a component removal action in real-time
 */
export async function trackRemoveComponent(
  sessionId: string,
  componentId: string
) {
  try {
    const action = await prisma.gameAction.create({
      data: {
        sessionId,
        actionType: 'remove_component',
        componentId,
      },
    });
    return action;
  } catch (error) {
    console.error('Error tracking component removal:', error);
    throw error;
  }
}

/**
 * Track a wire connection action in real-time
 */
export async function trackAddWire(
  sessionId: string,
  wireData: {
    fromId: string;
    toId: string;
    fromPort?: string;
    toPort?: string;
  }
) {
  try {
    const action = await prisma.gameAction.create({
      data: {
        sessionId,
        actionType: 'add_wire',
        wireData,
      },
    });
    return action;
  } catch (error) {
    console.error('Error tracking wire connection:', error);
    throw error;
  }
}

/**
 * Track a wire removal action in real-time
 */
export async function trackRemoveWire(
  sessionId: string,
  wireData: {
    fromId: string;
    toId: string;
  }
) {
  try {
    const action = await prisma.gameAction.create({
      data: {
        sessionId,
        actionType: 'remove_wire',
        wireData,
      },
    });
    return action;
  } catch (error) {
    console.error('Error tracking wire removal:', error);
    throw error;
  }
}

/**
 * Complete a game session with validation results
 */
export async function completeGameSession(
  sessionId: string,
  timeTaken: number,
  isCorrect: boolean
) {
  try {
    const session = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        timeTaken,
        isCorrect,
        completedAt: new Date(),
      },
    });
    return session;
  } catch (error) {
    console.error('Error completing game session:', error);
    throw error;
  }
}

/**
 * Get all game sessions with their actions
 */
export async function getGameSessions(userId?: string) {
  try {
    const sessions = await prisma.gameSession.findMany({
      where: userId ? { userId } : {},
      include: {
        actions: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return sessions;
  } catch (error) {
    console.error('Error fetching game sessions:', error);
    throw error;
  }
}

/**
 * Get a single session with all actions
 */
export async function getSessionWithActions(sessionId: string) {
  try {
    const session = await prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        actions: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
    return session;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
}

/**
 * Get leaderboard - fastest correct completions
 */
export async function getLeaderboard(limit: number = 20) {
  try {
    const sessions = await prisma.gameSession.findMany({
      where: {
        isCorrect: true,
        completed: true,
      },
      orderBy: {
        timeTaken: 'asc',
      },
      take: limit,
    });
    return sessions;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Get circuit challenge by circuit number and difficulty
 */
export async function getCircuitChallenge(
  circuitNumber: number,
  difficulty: 'easy' | 'hard'
): Promise<Circuit | null> {
  try {
    const circuit = await prisma.circuit.findUnique({
      where: {
        circuitNumber_difficulty: {
          circuitNumber,
          difficulty,
        },
      },
    });

    if (!circuit) return null;

    return {
      id: circuit.id,
      circuitNumber: circuit.circuitNumber,
      difficulty: circuit.difficulty as 'easy' | 'hard',
      description: circuit.description || undefined,
      targetComponents: circuit.targetComponents as Component[],
      targetWires: circuit.targetConnections as Wire[],
      timeLimit: circuit.timeLimit,
    };
  } catch (error) {
    console.error('Error fetching circuit challenge:', error);
    throw error;
  }
}

/**
 * Create or update a circuit challenge (for admin purposes)
 */
export async function saveCircuitChallenge(
  circuitNumber: number,
  difficulty: 'easy' | 'hard',
  description: string,
  targetComponents: Component[],
  targetWires: Wire[],
  timeLimit: number = 180
) {
  try {
    const circuit = await prisma.circuit.upsert({
      where: {
        circuitNumber_difficulty: {
          circuitNumber,
          difficulty,
        },
      },
      update: {
        description,
        targetComponents,
        targetConnections: targetWires,
        timeLimit,
      },
      create: {
        circuitNumber,
        difficulty,
        description,
        targetComponents,
        targetConnections: targetWires,
        timeLimit,
      },
    });
    return circuit;
  } catch (error) {
    console.error('Error saving circuit challenge:', error);
    throw error;
  }
}

