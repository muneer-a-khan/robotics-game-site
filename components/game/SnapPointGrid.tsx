'use client';

// Snap Point Grid Component

import { SnapPoint } from '@/types/component.types';
import { cn } from '@/lib/utils';

interface SnapPointGridProps {
  points: SnapPoint[][];
  highlighted: string[];
  firstTerminal?: SnapPoint | null;
  isOverlapMode?: boolean;
  onPointClick: (point: SnapPoint) => void;
}

export function SnapPointGrid({ points, highlighted, firstTerminal, isOverlapMode = false, onPointClick }: SnapPointGridProps) {
  const allPoints = points.flat();
  console.log('Rendering SnapPointGrid:', allPoints.length, 'points, highlighted:', highlighted.length, 'isOverlapMode:', isOverlapMode);
  
  return (
    <div className="absolute inset-0">
      {allPoints.map(point => (
        <SnapPointKnob
          key={point.id}
          point={point}
          isHighlighted={highlighted.includes(point.id)}
          isFirstTerminal={firstTerminal?.id === point.id}
          isOccupied={point.occupied}
          isOverlapMode={isOverlapMode}
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
  isOverlapMode: boolean;
  onClick: () => void;
}

function SnapPointKnob({ point, isHighlighted, isFirstTerminal, isOccupied, isOverlapMode, onClick }: SnapPointKnobProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('SnapPointKnob clicked:', point.id, 'row:', point.row, 'col:', point.col, 'isOccupied:', isOccupied, 'isOverlapMode:', isOverlapMode);
    onClick();
  };

  // Determine color based on state
  const getColorClasses = () => {
    if (isFirstTerminal) {
      return "ring-4 ring-blue-500 scale-125 bg-gradient-to-br from-blue-300 to-blue-500";
    }
    
    if (isOverlapMode) {
      if (isOccupied) {
        return "bg-gradient-to-br from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600"; // Orange for occupied (overlap)
      } else {
        return "bg-gradient-to-br from-green-300 to-green-500 hover:from-green-400 hover:to-green-600"; // Green for empty (normal)
      }
    }
    
    // Normal mode
    return "bg-gradient-to-br from-red-300 to-red-500 hover:from-red-400 hover:to-red-600"; // Red for normal
  };

  return (
    <button
      className={cn(
        "absolute w-8 h-8 rounded-full transition-all pointer-events-auto",
        "shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)]",
        "cursor-pointer hover:scale-125",
        "border-2 border-white",
        getColorClasses(),
        isHighlighted && !isFirstTerminal && "ring-4 ring-green-400 scale-125 hover:scale-150",
        isOccupied && !isOverlapMode && "opacity-50" // Only make semi-transparent in normal mode
      )}
      style={{
        left: point.x - 16,
        top: point.y - 16,
        zIndex: 30,
      }}
      onClick={handleClick}
    />
  );
}

