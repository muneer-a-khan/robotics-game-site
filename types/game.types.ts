// Game State Type Definitions

import { PhysicalComponent, SnapPoint, Connection, ComponentType } from './component.types';

export type Difficulty = 'easy' | 'hard';

export interface GameState {
  // Session
  sessionId: string | null;
  currentCircuit: number;
  difficulty: Difficulty;
  
  // Board state
  snapGrid: SnapPoint[][];
  components: Map<string, PhysicalComponent>;
  connections: Connection[];
  
  // UI state
  selectedComponent: ComponentType | null;
  highlightedSnapPoints: string[];
  validationErrors: string[];
  
  // Timer
  timeRemaining: number;
  isPlaying: boolean;
  startTime: number | null;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { sessionId: string; difficulty: Difficulty; circuitNumber: number } }
  | { type: 'SELECT_COMPONENT'; payload: ComponentType | null }
  | { type: 'HIGHLIGHT_SNAP_POINTS'; payload: string[] }
  | { type: 'PLACE_COMPONENT'; payload: { component: PhysicalComponent; snapPointIds: string[] } }
  | { type: 'REMOVE_COMPONENT'; payload: string }
  | { type: 'ROTATE_COMPONENT'; payload: string }
  | { type: 'UPDATE_CONNECTIONS'; payload: Connection[] }
  | { type: 'SET_VALIDATION_ERRORS'; payload: string[] }
  | { type: 'TICK_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'NEXT_CIRCUIT'; payload: { circuitNumber: number } }
  | { type: 'RESET_GAME' };

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Circuit Graph Structure for LLM Validation
export interface CircuitNode {
  id: string;
  type: ComponentType;
  position: {
    x: number; // Grid position
    y: number; // Grid position
  };
  orientation: 0 | 90 | 180 | 270;
  terminals: {
    id: string;
    position: string; // 'left', 'right', 'top-left', etc.
    gridPosition: { x: number; y: number };
  }[];
}

export interface CircuitEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromTerminalId: string;
  toTerminalId: string;
}

export interface CircuitGraph {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  metadata: {
    circuitNumber: number;
    difficulty: Difficulty;
    timestamp: number;
    sessionId: string;
  };
}

export interface Circuit {
  id: number;
  circuitNumber: number;
  difficulty: Difficulty;
  description: string;
  targetComponents: PhysicalComponent[];
  targetConnections: Connection[];
  timeLimit: number;
}

