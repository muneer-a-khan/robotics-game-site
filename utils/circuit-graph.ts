// Circuit Graph Utilities
// Converts circuit state to graph structure for LLM validation

import { PhysicalComponent, Connection } from '@/types/component.types';
import { CircuitNode, CircuitEdge, CircuitGraph, Difficulty } from '@/types/game.types';
import { GRID_CONFIG } from '@/config/components.config';

/**
 * Convert circuit components and connections to a graph structure
 */
export function createCircuitGraph(
  components: PhysicalComponent[],
  connections: Connection[],
  circuitNumber: number,
  difficulty: Difficulty,
  sessionId: string
): CircuitGraph {
  
  // Convert components to nodes
  const nodes: CircuitNode[] = components.map(component => {
    // Calculate grid position from component position
    const gridX = component.customPosition ? Math.round(component.customPosition.x / GRID_CONFIG.CELL_SIZE) : 0;
    const gridY = component.customPosition ? Math.round(component.customPosition.y / GRID_CONFIG.CELL_SIZE) : 0;
    
    // Extract terminal information
    const terminals = component.terminals.map(terminal => ({
      id: terminal.id,
      position: terminal.position,
      gridPosition: {
        x: Math.round(terminal.snapPoint.x / GRID_CONFIG.CELL_SIZE),
        y: Math.round(terminal.snapPoint.y / GRID_CONFIG.CELL_SIZE)
      }
    }));
    
    return {
      id: component.id,
      type: component.type,
      position: {
        x: gridX,
        y: gridY
      },
      orientation: component.orientation,
      terminals
    };
  });
  
  // Convert connections to edges
  const edges: CircuitEdge[] = connections.map(connection => ({
    id: connection.id,
    fromNodeId: connection.fromComponent,
    toNodeId: connection.toComponent,
    fromTerminalId: connection.from,
    toTerminalId: connection.to
  }));
  
  return {
    nodes,
    edges,
    metadata: {
      circuitNumber,
      difficulty,
      timestamp: Date.now(),
      sessionId
    }
  };
}

/**
 * Format circuit graph for LLM API consumption
 */
export function formatCircuitForLLM(circuitGraph: CircuitGraph): string {
  const { nodes, edges, metadata } = circuitGraph;
  
  const formattedData = {
    circuit: {
      number: metadata.circuitNumber,
      difficulty: metadata.difficulty,
      timestamp: metadata.timestamp,
      sessionId: metadata.sessionId
    },
    components: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      orientation: node.orientation,
      terminals: node.terminals.map(terminal => ({
        id: terminal.id,
        position: terminal.position,
        gridPosition: terminal.gridPosition
      }))
    })),
    connections: edges.map(edge => ({
      id: edge.id,
      from: {
        componentId: edge.fromNodeId,
        terminalId: edge.fromTerminalId
      },
      to: {
        componentId: edge.toNodeId,
        terminalId: edge.toTerminalId
      }
    })),
    summary: {
      totalComponents: nodes.length,
      totalConnections: edges.length,
      componentTypes: [...new Set(nodes.map(n => n.type))],
      gridBounds: {
        minX: Math.min(...nodes.map(n => n.position.x)),
        maxX: Math.max(...nodes.map(n => n.position.x)),
        minY: Math.min(...nodes.map(n => n.position.y)),
        maxY: Math.max(...nodes.map(n => n.position.y))
      }
    }
  };
  
  return JSON.stringify(formattedData, null, 2);
}

/**
 * Create a human-readable description of the circuit
 */
export function describeCircuit(circuitGraph: CircuitGraph): string {
  const { nodes, edges, metadata } = circuitGraph;
  
  const componentCounts = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const componentList = Object.entries(componentCounts)
    .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
    .join(', ');
  
  return `Circuit ${metadata.circuitNumber} (${metadata.difficulty}): ${componentList}, ${edges.length} connections`;
}
