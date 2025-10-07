'use client';

// Wire Connection Renderer

import { Connection, PhysicalComponent } from '@/types/component.types';
import { GRID_CONFIG } from '@/config/components.config';

interface WireRendererProps {
  connections: Connection[];
  components: Map<string, PhysicalComponent>;
}

export function WireRenderer({ connections, components }: WireRendererProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: GRID_CONFIG.COLS * GRID_CONFIG.CELL_SIZE,
        height: GRID_CONFIG.ROWS * GRID_CONFIG.CELL_SIZE,
        zIndex: 5,
      }}
    >
      {connections.map(connection => {
        const fromComp = components.get(connection.fromComponent);
        const toComp = components.get(connection.toComponent);
        
        if (!fromComp || !toComp) return null;
        
        const fromTerminal = fromComp.terminals.find(t => t.id === connection.from);
        const toTerminal = toComp.terminals.find(t => t.id === connection.to);
        
        if (!fromTerminal || !toTerminal) return null;
        
        const fromPos = fromTerminal.snapPoint;
        const toPos = toTerminal.snapPoint;
        
        return (
          <g key={connection.id}>
            {/* Shadow */}
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#000000"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            {/* Main wire */}
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#2563EB"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Connection points */}
            <circle cx={fromPos.x} cy={fromPos.y} r="4" fill="#10B981" />
            <circle cx={toPos.x} cy={toPos.y} r="4" fill="#10B981" />
          </g>
        );
      })}
    </svg>
  );
}

