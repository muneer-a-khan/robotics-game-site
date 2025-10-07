'use client';

// Physical Component Rendering

import { useState } from 'react';
import { PhysicalComponent as PhysicalComponentType } from '@/types/component.types';
import { COMPONENT_PATTERNS, GRID_CONFIG } from '@/config/components.config';
import { cn } from '@/lib/utils';
import { useGameState } from '@/hooks/useGameState';

interface PhysicalComponentProps {
  component: PhysicalComponentType;
  zIndex?: number;
}

export function PhysicalComponent({ component, zIndex = 10 }: PhysicalComponentProps) {
  const { removeComponent, rotateComponent } = useGameState();
  const [isHovered, setIsHovered] = useState(false);
  
  const pattern = COMPONENT_PATTERNS[component.type];
  
  // Use custom positioning if available (for line-based placement), otherwise use snap points
  const position = component.customPosition 
    ? {
        x: component.customPosition.x - component.customPosition.width / 2,
        y: component.customPosition.y - component.customPosition.height / 2,
      }
    : (() => {
        // Fallback to snap point positioning
        const anchor = component.snapPoints.length > 0
          ? { x: component.snapPoints[0].x, y: component.snapPoints[0].y }
          : { x: 0, y: 0 };

        const fullWidth = pattern.width * GRID_CONFIG.CELL_SIZE;
        const fullHeight = pattern.height * GRID_CONFIG.CELL_SIZE;
        const thicknessFactor = 0.6;
        const visualHeight = Math.max(16, Math.round(fullHeight * thicknessFactor));

        return {
          x: anchor.x,
          y: anchor.y + Math.round(fullHeight / 2) - Math.round(visualHeight / 2),
        };
      })();

  const size = component.customPosition 
    ? {
        width: component.customPosition.width,
        height: component.customPosition.height,
      }
    : (() => {
        // Fallback sizing
        const fullWidth = pattern.width * GRID_CONFIG.CELL_SIZE;
        const fullHeight = pattern.height * GRID_CONFIG.CELL_SIZE;
        const thicknessFactor = 0.6;
        const visualHeight = Math.max(16, Math.round(fullHeight * thicknessFactor));

        return {
          width: fullWidth,
          height: visualHeight,
        };
      })();
  
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!component.isLocked) {
      if (confirm(`Remove ${pattern.displayName}?`)) {
        removeComponent(component.id);
      }
    }
  };
  
  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pattern.canRotate) {
      rotateComponent(component.id);
    }
  };
  
  return (
    <div
      className={cn(
        "absolute transition-all duration-200",
        component.state === 'active' && "drop-shadow-lg",
        component.state === 'invalid' && "ring-2 ring-red-500",
        isHovered && !component.isLocked && "scale-105 z-20",
        component.isLocked && "cursor-default",
        !component.isLocked && "cursor-pointer"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${component.orientation}deg)`,
        transformOrigin: 'center center',
        zIndex: zIndex,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={handleRemove}
      onDoubleClick={handleRotate}
    >
      {/* Component image */}
      <img
        src={component.image}
        alt={pattern.displayName}
        className="w-full h-full object-contain pointer-events-none select-none"
        draggable={false}
        onError={(e) => {
          // Fallback to colored box if image fails to load
          (e.target as HTMLImageElement).style.display = 'none';
          const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      
      {/* Fallback colored box */}
      <div
        className="absolute inset-0 rounded-lg shadow-lg flex flex-col items-center justify-center text-white font-bold p-1 border-2 border-gray-800"
        style={{ backgroundColor: pattern.color, display: 'none' }}
      >
        <span className="text-center text-xs leading-tight px-1">
          {pattern.displayName}
        </span>
      </div>
      
      {/* Terminals (visual indicators at exact grid intersections) */}
      {component.terminals.map(terminal => (
        <div
          key={terminal.id}
          className={cn(
            "absolute w-2 h-2 rounded-full",
            terminal.isOccupied ? "bg-green-400" : "bg-gray-400"
          )}
          style={{
            left: (terminal.snapPoint.x - position.x) - 4,
            top: (terminal.snapPoint.y - position.y) - 4,
          }}
        />
      ))}
      
      {/* Component label on hover */}
      {isHovered && !component.isLocked && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white px-3 py-1 rounded text-xs whitespace-nowrap z-30 pointer-events-none">
          {pattern.displayName}
          <div className="text-[10px] opacity-75">
            {pattern.canRotate && 'Double-click to rotate • '}
            Right-click to remove
          </div>
        </div>
      )}
    </div>
  );
}

