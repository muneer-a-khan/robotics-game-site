/**
 * Seed script to add sample circuit challenges to the database
 * Run with: npx tsx scripts/seed-circuits.ts
 */

import { PrismaClient } from '@prisma/client';
import { Component, Wire, getConnectionPointsForType } from '../types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding circuit challenges...');

  // Circuit 1 - Easy: Build a circuit that lights up with the switch
  const circuit1Easy: {
    circuitNumber: number;
    difficulty: string;
    description: string;
    targetComponents: Component[];
    targetConnections: Wire[];
  } = {
    circuitNumber: 1,
    difficulty: 'easy',
    description: 'Build a circuit that lights up with the switch',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 }, // Far left, centered vertically (3x2 size)
        orientation: 0,
        connectionPoints: getConnectionPointsForType('battery_holder', 'battery-1'),
      },
      {
        id: 'switch-1',
        type: 'slide_switch',
        gridPosition: { x: 4, y: 2 }, // Middle of board
        orientation: 0,
        connectionPoints: getConnectionPointsForType('slide_switch', 'switch-1'),
      },
      {
        id: 'led-1',
        type: 'led_yellow',
        gridPosition: { x: 4, y: 0 }, // Top middle
        orientation: 0,
        connectionPoints: getConnectionPointsForType('led_yellow', 'led-1'),
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0', // Top-right corner of battery
        toConnectionPointId: 'switch-1-cp-0', // Left side of switch
      },
      {
        id: 'wire-2',
        fromConnectionPointId: 'switch-1-cp-1', // Right side of switch
        toConnectionPointId: 'led-1-cp-0', // Left side of LED
      },
      {
        id: 'wire-3',
        fromConnectionPointId: 'led-1-cp-1', // Right side of LED
        toConnectionPointId: 'battery-1-cp-1', // Bottom-right corner of battery (completing circuit)
      },
    ],
  };

  // Circuit 1 - Hard: Build a circuit that emits red light with the resistor
  const circuit1Hard: typeof circuit1Easy = {
    circuitNumber: 1,
    difficulty: 'hard',
    description: 'Build a circuit that emits red light with the resistor',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('battery_holder', 'battery-1'),
      },
      {
        id: 'resistor-1',
        type: 'resistor',
        gridPosition: { x: 4, y: 1 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('resistor', 'resistor-1'),
      },
      {
        id: 'led-1',
        type: 'led_red',
        gridPosition: { x: 4, y: 3 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('led_red', 'led-1'),
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0', // Top-right corner
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
        toConnectionPointId: 'battery-1-cp-1', // Bottom-right corner
      },
    ],
  };

  // Circuit 2 - Hard: Make a circuit that plays music on speaker
  const circuit2Hard: typeof circuit1Easy = {
    circuitNumber: 2,
    difficulty: 'hard',
    description: 'Make a circuit that plays music on speaker',
    targetComponents: [
      {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('battery_holder', 'battery-1'),
      },
      {
        id: 'music-1',
        type: 'music_ic',
        gridPosition: { x: 4, y: 0 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('music_ic', 'music-1'),
      },
      {
        id: 'speaker-1',
        type: 'speaker',
        gridPosition: { x: 4, y: 3 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('speaker', 'speaker-1'),
      },
    ],
    targetConnections: [
      {
        id: 'wire-1',
        fromConnectionPointId: 'battery-1-cp-0', // Top-right corner
        toConnectionPointId: 'music-1-cp-0', // Top-left of music IC
      },
      {
        id: 'wire-2',
        fromConnectionPointId: 'music-1-cp-4', // Middle-right of music IC
        toConnectionPointId: 'speaker-1-cp-0',
      },
      {
        id: 'wire-3',
        fromConnectionPointId: 'speaker-1-cp-1',
        toConnectionPointId: 'battery-1-cp-1', // Bottom-right corner
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

