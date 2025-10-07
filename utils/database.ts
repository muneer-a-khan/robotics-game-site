import { prisma } from '@/lib/prisma';
import { ComponentType } from '@/types/component.types';
import { Difficulty } from '@/types/game.types';

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

// Note: These tracking functions are now handled by the API routes
// The database schema has been updated to match the new architecture

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
  difficulty: Difficulty
) {
  try {
    const circuit = await prisma.circuit.findUnique({
      where: {
        circuitNumber_difficulty: {
          circuitNumber,
          difficulty,
        },
      },
    });

    return circuit;
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
  difficulty: Difficulty,
  description: string,
  targetComponents: any,
  targetConnections: any,
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
        targetConnections,
        timeLimit,
      },
      create: {
        circuitNumber,
        difficulty,
        description,
        targetComponents,
        targetConnections,
        timeLimit,
      },
    });
    return circuit;
  } catch (error) {
    console.error('Error saving circuit challenge:', error);
    throw error;
  }
}

