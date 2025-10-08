// Component Metadata Configuration

import { ComponentPattern, ComponentType } from '@/types/component.types';

export const COMPONENT_PATTERNS: Record<ComponentType, ComponentPattern> = {
  battery_holder: {
    type: 'battery_holder',
    displayName: 'Battery Holder',
    width: 2,  // 2 columns wide
    height: 2, // 2 rows high
    terminals: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // Connection points on each corner
    canRotate: false,
    maxCount: 1,
    image: '/photos/components/battery_holder.png',
    color: '#DC2626'
  },
  wire: {
    type: 'wire',
    displayName: 'Wire',
    width: 3,
    height: 1,
    terminals: ['center-left', 'center', 'center-right'],
    canRotate: true,
    maxCount: 20,
    image: '/photos/components/wire.png',
    color: '#2563EB'
  },
  led_yellow: {
    type: 'led_yellow',
    displayName: 'LED (Yellow)',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/yellow_LED.png',
    color: '#FBBF24'
  },
  led_red: {
    type: 'led_red',
    displayName: 'LED (Red)',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/red_LED.png',
    color: '#EF4444'
  },
  resistor: {
    type: 'resistor',
    displayName: 'Resistor',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/resistor.png',
    color: '#F59E0B'
  },
  lamp: {
    type: 'lamp',
    displayName: 'Lamp',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/lamp.png',
    color: '#FCD34D'
  },
  photoresistor: {
    type: 'photoresistor',
    displayName: 'Photoresistor',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/photoresistor.png',
    color: '#A78BFA'
  },
  music_ic: {
    type: 'music_ic',
    displayName: 'U1 Music',
    width: 2,
    height: 2,
    terminals: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/U1_Music.png',
    color: '#3B82F6'
  },
  alarm_ic: {
    type: 'alarm_ic',
    displayName: 'U2 Alarm',
    width: 2,
    height: 2,
    terminals: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/U2_Alarm.png',
    color: '#EF4444'
  },
  space_war_ic: {
    type: 'space_war_ic',
    displayName: 'U3 Space War',
    width: 2,
    height: 2,
    terminals: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/U3_Space_War.png',
    color: '#10B981'
  },
  speaker: {
    type: 'speaker',
    displayName: 'Speaker',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/speaker.png',
    color: '#6B7280'
  },
  slide_switch: {
    type: 'slide_switch',
    displayName: 'Slide Switch',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/slide_switch.png',
    color: '#8B5CF6'
  },
  press_switch: {
    type: 'press_switch',
    displayName: 'Press Switch',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/press_switch.png',
    color: '#06B6D4'
  },
  whistle_chip: {
    type: 'whistle_chip',
    displayName: 'Whistle Chip',
    width: 3,
    height: 1,
    terminals: ['left', 'right'],
    canRotate: true,
    maxCount: 2,
    image: '/photos/components/whistle_chip.png',
    color: '#EC4899'
  }
};

export const AVAILABLE_COMPONENTS: ComponentType[] = [
  'battery_holder',
  'wire',
  'led_yellow',
  'led_red',
  'resistor',
  'lamp',
  'photoresistor',
  'music_ic',
  'alarm_ic',
  'space_war_ic',
  'speaker',
  'slide_switch',
  'press_switch',
  'whistle_chip'
];

// Grid configuration
export const GRID_CONFIG = {
  ROWS: 5,      // A-E (up and down)
  COLS: 7,      // 1-7 (side by side)
  CELL_SIZE: 120, // pixels between snap points (increased for bigger board)
  ROW_LABELS: ['A', 'B', 'C', 'D', 'E'],
  COL_LABELS: ['1', '2', '3', '4', '5', '6', '7']
};

