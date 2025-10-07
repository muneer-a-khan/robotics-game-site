// Circuit Validation Logic

import { PhysicalComponent, Connection } from '@/types/component.types';
import { ValidationResult, Circuit } from '@/types/game.types';
import { normalizeConnections, areConnectionsEqual } from '@/utils/connection-validator';

/**
 * Validate user's circuit against target circuit
 */
export function validateCircuit(
  userComponents: PhysicalComponent[],
  userConnections: Connection[],
  targetCircuit: Circuit
): ValidationResult {
  const errors: string[] = [];
  
  // 1. Validate component types
  const userTypes = userComponents
    .map(c => c.type)
    .filter(t => t !== 'battery_holder')
    .sort();
  
  const targetTypes = targetCircuit.targetComponents
    .map(c => c.type)
    .filter(t => t !== 'battery_holder')
    .sort();
  
  if (JSON.stringify(userTypes) !== JSON.stringify(targetTypes)) {
    errors.push('Component types do not match the target circuit');
  }
  
  // 2. Validate component positions (check snap points)
  for (const targetComp of targetCircuit.targetComponents) {
    const userComp = userComponents.find(c => c.type === targetComp.type);
    
    if (!userComp) continue;
    
    // Compare snap point positions
    const userSnapIds = userComp.snapPoints.map(p => p.id).sort();
    const targetSnapIds = targetComp.snapPoints.map(p => p.id).sort();
    
    if (JSON.stringify(userSnapIds) !== JSON.stringify(targetSnapIds)) {
      errors.push(`${targetComp.type} is in the wrong position`);
    }
  }
  
  // 3. Validate connections
  const normalizedUserConns = normalizeConnections(userConnections);
  const normalizedTargetConns = normalizeConnections(targetCircuit.targetConnections);
  
  if (!areConnectionsEqual(normalizedUserConns, normalizedTargetConns)) {
    errors.push('Circuit connections do not match the target');
    
    // Provide more detailed error
    if (normalizedUserConns.size < normalizedTargetConns.size) {
      errors.push('Missing some required connections');
    } else if (normalizedUserConns.size > normalizedTargetConns.size) {
      errors.push('Extra connections detected');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

