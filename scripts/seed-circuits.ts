/**
 * Seed script to add sample circuit challenges to the database
 * Run with: npx tsx scripts/seed-circuits.ts
 */

import { PrismaClient } from '@prisma/client';
import { PhysicalComponent, Connection } from '../types/component.types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding circuit challenges...');

  // Circuit 1 - Easy: Build a circuit that lights up with the switch
  const circuit1Easy = {
    circuitNumber: 1,
    difficulty: 'easy',
    description: 'Build a circuit that lights up with the switch',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 90,
        connectionPoints: [
          { id: 'battery-1-cp-0', position: 'top-right' },
          { id: 'battery-1-cp-1', position: 'bottom-right' }
        ],
      },
      {
        id: 'switch-1',
        type: 'slide_switch',
        gridPosition: { x: 4, y: 2 },
        orientation: 0,
        connectionPoints: [
          { id: 'switch-1-cp-0', position: 'left' },
          { id: 'switch-1-cp-1', position: 'right' }
        ],
      },
      {
        id: 'led-1',
        type: 'led_yellow',
        gridPosition: { x: 4, y: 0 },
        orientation: 0,
        connectionPoints: [
          { id: 'led-1-cp-0', position: 'left' },
          { id: 'led-1-cp-1', position: 'right' }
        ],
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0',
        toConnectionPointId: 'switch-1-cp-0',
      },
      {
        id: 'wire-2',
        fromConnectionPointId: 'switch-1-cp-1',
        toConnectionPointId: 'led-1-cp-0',
      },
      {
        id: 'wire-3',
        fromConnectionPointId: 'led-1-cp-1',
        toConnectionPointId: 'battery-1-cp-1',
      },
    ],
  };

  // Circuit 1 - Hard: Build a circuit that emits red light with the resistor
  const circuit1Hard = {
    circuitNumber: 1,
    difficulty: 'hard',
    description: 'Build a circuit that emits red light with the resistor',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 90,
        connectionPoints: [
          { id: 'battery-1-cp-0', position: 'top-right' },
          { id: 'battery-1-cp-1', position: 'bottom-right' }
        ],
      },
      {
        id: 'resistor-1',
        type: 'resistor',
        gridPosition: { x: 4, y: 1 },
        orientation: 0,
        connectionPoints: [
          { id: 'resistor-1-cp-0', position: 'left' },
          { id: 'resistor-1-cp-1', position: 'right' }
        ],
      },
      {
        id: 'led-1',
        type: 'led_red',
        gridPosition: { x: 4, y: 3 },
        orientation: 0,
        connectionPoints: [
          { id: 'led-1-cp-0', position: 'left' },
          { id: 'led-1-cp-1', position: 'right' }
        ],
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0',
        toConnectionPointId: 'resistor-1-cp-0',
      },
      {
        id: 'wire-2',
        fromConnectionPointId: 'resistor-1-cp-1',
        toConnectionPointId: 'led-1-cp-0',
      },
      {
        id: 'wire-3',
        fromConnectionPointId: 'led-1-cp-1',
        toConnectionPointId: 'battery-1-cp-1',
      },
    ],
  };

  // Circuit 2 - Hard: Make a circuit that plays music on speaker
  const circuit2Hard = {
    circuitNumber: 2,
    difficulty: 'hard',
    description: 'Make a circuit that plays music on speaker',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 90,
        connectionPoints: [
          { id: 'battery-1-cp-0', position: 'top-right' },
          { id: 'battery-1-cp-1', position: 'bottom-right' }
        ],
      },
      {
        id: 'music-1',
        type: 'music_ic',
        gridPosition: { x: 4, y: 0 },
        orientation: 0,
        connectionPoints: [
          { id: 'music-1-cp-0', position: 'top-left' },
          { id: 'music-1-cp-1', position: 'top-right' },
          { id: 'music-1-cp-2', position: 'bottom-left' },
          { id: 'music-1-cp-3', position: 'bottom-right' },
          { id: 'music-1-cp-4', position: 'middle-right' }
        ],
      },
      {
        id: 'speaker-1',
        type: 'speaker',
        gridPosition: { x: 4, y: 3 },
        orientation: 0,
        connectionPoints: [
          { id: 'speaker-1-cp-0', position: 'left' },
          { id: 'speaker-1-cp-1', position: 'right' }
        ],
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0',
        toConnectionPointId: 'music-1-cp-0',
      },
      {
        id: 'wire-2',
        fromConnectionPointId: 'music-1-cp-4',
        toConnectionPointId: 'speaker-1-cp-0',
      },
      {
        id: 'wire-3',
        fromConnectionPointId: 'speaker-1-cp-1',
        toConnectionPointId: 'battery-1-cp-1',
      },
    ],
  };

  // Insert or update circuits
  try {
    await prisma.circuit.upsert({
      where: {
        circuitNumber_difficulty: {
          circuitNumber: 1,
          difficulty: 'easy',
        },
      },
      update: {
        description: circuit1Easy.description,
        targetComponents: circuit1Easy.targetComponents as any,
        targetConnections: circuit1Easy.targetConnections as any,
      },
      create: {
        circuitNumber: 1,
        difficulty: 'easy',
        description: circuit1Easy.description,
        targetComponents: circuit1Easy.targetComponents as any,
        targetConnections: circuit1Easy.targetConnections as any,
      },
    });
    console.log('✅ Circuit 1 (Easy) created');

    await prisma.circuit.upsert({
      where: {
        circuitNumber_difficulty: {
          circuitNumber: 1,
          difficulty: 'hard',
        },
      },
      update: {
        description: circuit1Hard.description,
        targetComponents: circuit1Hard.targetComponents as any,
        targetConnections: circuit1Hard.targetConnections as any,
      },
      create: {
        circuitNumber: 1,
        difficulty: 'hard',
        description: circuit1Hard.description,
        targetComponents: circuit1Hard.targetComponents as any,
        targetConnections: circuit1Hard.targetConnections as any,
      },
    });
    console.log('✅ Circuit 1 (Hard) created');

    await prisma.circuit.upsert({
      where: {
        circuitNumber_difficulty: {
          circuitNumber: 2,
          difficulty: 'hard',
        },
      },
      update: {
        description: circuit2Hard.description,
        targetComponents: circuit2Hard.targetComponents as any,
        targetConnections: circuit2Hard.targetConnections as any,
      },
      create: {
        circuitNumber: 2,
        difficulty: 'hard',
        description: circuit2Hard.description,
        targetComponents: circuit2Hard.targetComponents as any,
        targetConnections: circuit2Hard.targetConnections as any,
      },
    });
    console.log('✅ Circuit 2 (Hard) created');

    console.log('\n🎉 Successfully seeded all circuit challenges!');
  } catch (error) {
    console.error('❌ Error seeding circuits:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

