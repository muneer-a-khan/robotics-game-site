// Component Type Definitions for Physical Snap Circuits

export type ComponentType = 
  | 'battery_holder'
  | 'wire'
  | 'led_yellow'
  | 'led_red'
  | 'resistor'
  | 'lamp'
  | 'photoresistor'
  | 'music_ic'
  | 'alarm_ic'
  | 'space_war_ic'
  | 'speaker'
  | 'slide_switch'
  | 'press_switch'
  | 'whistle_chip';

export type ComponentState = 
  | 'toolbox'      // In component drawer
  | 'selected'     // Selected for placement
  | 'placing'      // Being positioned
  | 'placed'       // On board, not active
  | 'active'       // On board, part of circuit
  | 'invalid';     // Incorrectly placed

export type TerminalPosition = 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-right' | 'center-left' | 'center-right' | 'center';

export interface SnapPoint {
  id: string;
  row: number;      // 0-6 (A-G)
  col: number;      // 0-9 (1-10)
  x: number;        // pixel position
  y: number;        // pixel position
  occupied: boolean;
  componentId?: string;
}

export interface SnapTerminal {
  id: string;
  componentId: string;
  position: TerminalPosition;
  snapPoint: SnapPoint;
  connectedTo?: string; // other terminal ID
  isOccupied: boolean;
}

export interface PhysicalComponent {
  id: string;
  type: ComponentType;
  state: ComponentState;
  snapPoints: SnapPoint[];      // Points it occupies
  terminals: SnapTerminal[];    // Connection points
  orientation: 0 | 90 | 180 | 270;
  isLocked: boolean;            // Battery is locked
  image: string;                // Path to component image
  customPosition?: {            // For line-based placement
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Connection {
  id: string;
  from: string;           // terminal ID
  to: string;             // terminal ID
  fromComponent: string;  // component ID
  toComponent: string;    // component ID
}

export interface ComponentPattern {
  type: ComponentType;
  displayName: string;
  width: number;          // snap points occupied
  height: number;         // snap points occupied
  terminals: TerminalPosition[];
  canRotate: boolean;
  maxCount: number;
  image: string;
  color: string;          // fallback color
}

