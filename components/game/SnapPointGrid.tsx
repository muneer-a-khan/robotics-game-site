'use client';

// Snap Point Grid Component

import { SnapPoint } from '@/types/component.types';
import { cn } from '@/lib/utils';

interface SnapPointGridProps {
  points: SnapPoint[][];
  highlighted: string[];
  firstTerminal?: SnapPoint | null;
  onPointClick: (point: SnapPoint) => void;
}

export function SnapPointGrid({ points, highlighted, firstTerminal, onPointClick }: SnapPointGridProps) {
  return (
    <div className="absolute inset-0">
      {points.flat().map(point => (
        <SnapPointKnob
          key={point.id}
          point={point}
          isHighlighted={highlighted.includes(point.id)}
          isFirstTerminal={firstTerminal?.id === point.id}
          isOccupied={point.occupied}
          onClick={() => onPointClick(point)}
        />
      ))}
    </div>
  );
}

interface SnapPointKnobProps {
  point: SnapPoint;
  isHighlighted: boolean;
  isFirstTerminal: boolean;
  isOccupied: boolean;
  onClick: () => void;
}

function SnapPointKnob({ point, isHighlighted, isFirstTerminal, isOccupied, onClick }: SnapPointKnobProps) {
  return (
    <button
      className={cn(
        "absolute w-4 h-4 rounded-full transition-all pointer-events-auto",
        "bg-gradient-to-br from-gray-100 to-gray-300",
        "shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)]",
        isOccupied && "opacity-0",
        isFirstTerminal && "ring-4 ring-blue-500 scale-125 cursor-pointer",
        isHighlighted && !isFirstTerminal && "ring-4 ring-green-400 scale-125 cursor-pointer hover:scale-150",
        !isHighlighted && !isFirstTerminal && "cursor-not-allowed"
      )}
      style={{
        left: point.x - 8,
        top: point.y - 8,
      }}
      onClick={onClick}
      disabled={!isHighlighted}
    />
  );
}

