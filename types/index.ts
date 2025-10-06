// Component Types - Specific to snap circuits
export type ComponentType = 
  | 'battery_holder'
  | 'wire'          // Wire component
  | 'led_yellow'    // LED_1
  | 'led_red'       // LED_2
  | 'resistor'
  | 'lamp'
  | 'photoresistor'
  | 'music_ic'      // U_1 blue
  | 'alarm_ic'      // U_2 red
  | 'space_war_ic'  // U_3 green
  | 'speaker'
  | 'slide_switch'
  | 'press_switch'
  | 'whistle_chip';

// Orientation (0, 90, 180, 270 degrees)
export type Orientation = 0 | 90 | 180 | 270;

// Grid position (7 columns x 5 rows)
export interface GridPosition {
  x: number; // 0-6
  y: number; // 0-4
}

// Connection point on a component
export interface ConnectionPoint {
  id: string;
  componentId: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-right';
  gridOffset?: { x: number; y: number }; // Offset from component position
}

// Component on the board
export interface Component {
  id: string;
  type: ComponentType;
  gridPosition: GridPosition;
  orientation: Orientation;
  connectionPoints: ConnectionPoint[];
}

// Wire connection between two connection points
export interface Wire {
  id: string;
  fromConnectionPointId: string;
  toConnectionPointId: string;
}

// Difficulty level
export type Difficulty = 'easy' | 'hard';

// Circuit challenge (from database)
export interface Circuit {
  id: number;
  circuitNumber: number;
  difficulty: Difficulty;
  description?: string;
  targetComponents: Component[];
  targetWires: Wire[];
  timeLimit: number; // in seconds
}

// Game state
export interface GameState {
  sessionId: string | null;
  currentCircuit: number; // 1, 2, or 3
  difficulty: Difficulty;
  components: Component[];
  wires: Wire[];
  timeRemaining: number;
  isPlaying: boolean;
  startTime: number | null;
}

// Action types for real-time tracking
export type ActionType = 
  | 'place_component'
  | 'remove_component'
  | 'add_wire'
  | 'remove_wire';

export interface GameAction {
  id: string;
  sessionId: string;
  actionType: ActionType;
  componentType?: ComponentType;
  componentId?: string;
  gridPosition?: GridPosition;
  orientation?: Orientation;
  wireData?: {
    fromId: string;
    toId: string;
    fromPort?: string;
    toPort?: string;
  };
  timestamp: Date;
}

// Component metadata - defines connection points for each component type
export interface ComponentMetadata {
  type: ComponentType;
  displayName: string;
  maxCount: number; // Max 2 per circuit
  connectionPoints: Array<{
    position: ConnectionPoint['position'];
    gridOffset?: { x: number; y: number };
  }>;
  imagePath?: string;
  color: string; // Fallback color for boxes
}

// Helper function to get connection points for a component type
export function getConnectionPointsForType(type: ComponentType, componentId: string): ConnectionPoint[] {
  const metadata = COMPONENT_METADATA[type];
  return metadata.connectionPoints.map((cp, index) => ({
    id: `${componentId}-cp-${index}`,
    componentId,
    position: cp.position,
    gridOffset: cp.gridOffset,
  }));
}

// Component size information
export interface ComponentSize {
  width: number; // cells across
  height: number; // cells up/down
}

export const COMPONENT_SIZES: Record<ComponentType, ComponentSize> = {
  battery_holder: { width: 2, height: 2 }, // 4 cells (2x2 on board, extends left off-board)
  wire: { width: 3, height: 1 }, // 3x1 cells - same as other components
  music_ic: { width: 3, height: 2 }, // 6 cells
  alarm_ic: { width: 3, height: 2 }, // 6 cells
  space_war_ic: { width: 3, height: 2 }, // 6 cells
  // All other components: 3 cells horizontal
  led_yellow: { width: 3, height: 1 },
  led_red: { width: 3, height: 1 },
  resistor: { width: 3, height: 1 },
  lamp: { width: 3, height: 1 },
  photoresistor: { width: 3, height: 1 },
  speaker: { width: 3, height: 1 },
  slide_switch: { width: 3, height: 1 },
  press_switch: { width: 3, height: 1 },
  whistle_chip: { width: 3, height: 1 },
};

// Component metadata configuration
export const COMPONENT_METADATA: Record<ComponentType, ComponentMetadata> = {
  battery_holder: {
    type: 'battery_holder',
    displayName: 'Battery Holder',
    maxCount: 1, // Only one battery
    connectionPoints: [
      { position: 'top-right' }, // Top corner of right side
      { position: 'bottom-right' }, // Bottom corner of right side
    ],
    color: '#DC2626', // red
  },
  wire: {
    type: 'wire',
    displayName: 'Wire',
    maxCount: 20, // Allow many wires
    connectionPoints: [
      { position: 'left' }, // Start point
      { position: 'right' }, // End point
    ],
    color: '#2563EB', // blue
  },
  led_yellow: {
    type: 'led_yellow',
    displayName: 'LED (Yellow)',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#FBBF24', // yellow
  },
  led_red: {
    type: 'led_red',
    displayName: 'LED (Red)',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#EF4444', // red
  },
  resistor: {
    type: 'resistor',
    displayName: 'Resistor',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#F59E0B', // orange
  },
  lamp: {
    type: 'lamp',
    displayName: 'Lamp',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#FCD34D', // amber
  },
  photoresistor: {
    type: 'photoresistor',
    displayName: 'Photoresistor',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#A78BFA', // purple
  },
  music_ic: {
    type: 'music_ic',
    displayName: 'U1 Music',
    maxCount: 2,
    connectionPoints: [
      { position: 'top-left' },
      { position: 'top-right' },
      { position: 'bottom-left' },
      { position: 'bottom-right' },
      { position: 'middle-right' }, // One in middle on right side
    ],
    color: '#3B82F6', // blue
  },
  alarm_ic: {
    type: 'alarm_ic',
    displayName: 'U2 Alarm',
    maxCount: 2,
    connectionPoints: [
      { position: 'top-left' },
      { position: 'top-right' },
      { position: 'bottom-left' },
      { position: 'bottom-right' },
      { position: 'middle-right' }, // One in middle on right side
    ],
    color: '#EF4444', // red
  },
  space_war_ic: {
    type: 'space_war_ic',
    displayName: 'U3 Space War',
    maxCount: 2,
    connectionPoints: [
      { position: 'top-left' },
      { position: 'top-right' },
      { position: 'bottom-left' },
      { position: 'bottom-right' },
      { position: 'middle-right' }, // One in middle on right side
    ],
    color: '#10B981', // green
  },
  speaker: {
    type: 'speaker',
    displayName: 'Speaker',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#6B7280', // gray
  },
  slide_switch: {
    type: 'slide_switch',
    displayName: 'Slide Switch',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#8B5CF6', // violet
  },
  press_switch: {
    type: 'press_switch',
    displayName: 'Press Switch',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#06B6D4', // cyan
  },
  whistle_chip: {
    type: 'whistle_chip',
    displayName: 'Whistle Chip',
    maxCount: 2,
    connectionPoints: [
      { position: 'left' },
      { position: 'right' },
    ],
    color: '#EC4899', // pink
  },
};

