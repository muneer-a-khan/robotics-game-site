// Database Type Definitions

export interface GameSessionData {
  id: string;
  userId?: string;
  circuitNumber: number;
  difficulty: string;
  completed: boolean;
  timeTaken?: number;
  isCorrect?: boolean;
  errorDetails?: any;
  createdAt: Date;
  completedAt?: Date;
}

export interface GameActionData {
  id?: string;
  sessionId: string;
  actionType: 'place' | 'remove' | 'rotate';
  componentType?: string;
  componentId?: string;
  snapPointIds?: string[];
  orientation?: number;
  timestamp?: Date;
}

export interface CircuitData {
  id: number;
  circuitNumber: number;
  difficulty: string;
  description?: string;
  targetComponents: any;
  targetConnections: any;
  timeLimit: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  circuitNumber: number;
  difficulty: string;
  timeTaken: number;
  isCorrect: boolean;
  createdAt: string;
}

