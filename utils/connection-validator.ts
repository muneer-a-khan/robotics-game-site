// Connection Detection and Validation

import { PhysicalComponent, Connection, SnapTerminal } from '@/types/component.types';

/**
 * Auto-detect connections between adjacent component terminals
 */
export function detectConnections(
  components: Map<string, PhysicalComponent>
): Connection[] {
  const connections: Connection[] = [];
  const componentsArray = Array.from(components.values());
  
  // Compare all pairs of components
  for (let i = 0; i < componentsArray.length; i++) {
    const comp1 = componentsArray[i];
    
    for (const terminal1 of comp1.terminals) {
      for (let j = i + 1; j < componentsArray.length; j++) {
        const comp2 = componentsArray[j];
        
        for (const terminal2 of comp2.terminals) {
          if (areTerminalsAdjacent(terminal1, terminal2)) {
            connections.push({
              id: `${terminal1.id}-${terminal2.id}`,
              from: terminal1.id,
              to: terminal2.id,
              fromComponent: comp1.id,
              toComponent: comp2.id,
            });
            
            // Mark terminals as occupied
            terminal1.isOccupied = true;
            terminal1.connectedTo = terminal2.id;
            terminal2.isOccupied = true;
            terminal2.connectedTo = terminal1.id;
          }
        }
      }
    }
  }
  
  return connections;
}

/**
 * Check if two terminals are adjacent (same snap point)
 */
function areTerminalsAdjacent(
  terminal1: SnapTerminal,
  terminal2: SnapTerminal
): boolean {
  const snap1 = terminal1.snapPoint;
  const snap2 = terminal2.snapPoint;
  
  // Terminals are adjacent if they share the same snap point
  return snap1.row === snap2.row && snap1.col === snap2.col;
}

/**
 * Normalize connections for comparison (order-independent)
 */
export function normalizeConnections(connections: Connection[]): Set<string> {
  return new Set(
    connections.map(c => {
      // Get component IDs and sort them for consistent comparison
      const [from, to] = [c.fromComponent, c.toComponent].sort();
      return `${from}-${to}`;
    })
  );
}

/**
 * Check if two connection sets are equal
 */
export function areConnectionsEqual(
  connections1: Set<string>,
  connections2: Set<string>
): boolean {
  if (connections1.size !== connections2.size) {
    return false;
  }
  
  for (const conn of connections1) {
    if (!connections2.has(conn)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Find all components connected to a given component (circuit tracing)
 */
export function traceCircuit(
  startComponentId: string,
  connections: Connection[],
  components: Map<string, PhysicalComponent>
): Set<string> {
  const visited = new Set<string>();
  const queue: string[] = [startComponentId];
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    
    // Find all connections involving this component
    const connectedIds = connections
      .filter(c => c.fromComponent === currentId || c.toComponent === currentId)
      .map(c => c.fromComponent === currentId ? c.toComponent : c.fromComponent);
    
    // Add to queue
    connectedIds.forEach(id => {
      if (!visited.has(id)) {
        queue.push(id);
      }
    });
  }
  
  return visited;
}

