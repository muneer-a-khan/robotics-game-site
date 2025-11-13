'use client';

// Snap Point Grid Component

import { SnapPoint } from '@/types/component.types';
import { cn } from '@/lib/utils';

interface SnapPointGridProps {
  points: SnapPoint[][];
  highlighted: string[];
  firstTerminal?: SnapPoint | null;
  isDeleteMode?: boolean;
  onPointClick: (point: SnapPoint) => void;
}

export function SnapPointGrid({ points, highlighted, firstTerminal, isDeleteMode = false, onPointClick }: SnapPointGridProps) {
  const allPoints = points.flat();
  console.log('Rendering SnapPointGrid:', allPoints.length, 'points, highlighted:', highlighted.length, 'isDeleteMode:', isDeleteMode);

  // When firstTerminal is selected and we have highlighted points, any point NOT in highlighted list is disabled
  const hasRestrictedSelection = firstTerminal && highlighted.length > 0;

  return (
    <div className="absolute inset-0">
      {allPoints.map(point => {
        const isDisabled = hasRestrictedSelection && !highlighted.includes(point.id) && point.id !== firstTerminal.id;

        return (
          <SnapPointKnob
            key={point.id}
            point={point}
            isHighlighted={highlighted.includes(point.id)}
            isFirstTerminal={firstTerminal?.id === point.id}
            isOccupied={point.occupied}
            isDeleteMode={isDeleteMode}
            isDisabled={isDisabled}
            onClick={() => !isDisabled && onPointClick(point)}
          />
        );
      })}
    </div>
  );
}

interface SnapPointKnobProps {
  point: SnapPoint;
  isHighlighted: boolean;
  isFirstTerminal: boolean;
  isOccupied: boolean;
  isDeleteMode: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

function SnapPointKnob({ point, isHighlighted, isFirstTerminal, isOccupied, isDeleteMode, isDisabled, onClick }: SnapPointKnobProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent click if disabled
    if (isDisabled) {
      return;
    }

    console.log('SnapPointKnob clicked:', point.id, 'row:', point.row, 'col:', point.col, 'isOccupied:', isOccupied, 'isDeleteMode:', isDeleteMode);
    onClick();
  };

  // Determine color based on state
  const getColorClasses = () => {
    if (isDisabled) {
      return "bg-gradient-to-br from-gray-200 to-gray-400 cursor-not-allowed"; // Disabled state
    }

    if (isFirstTerminal) {
      return "ring-4 ring-blue-500 scale-125 bg-gradient-to-br from-blue-300 to-blue-500";
    }

    if (isDeleteMode) {
      if (isOccupied) {
        return "bg-gradient-to-br from-red-300 to-red-500 hover:from-red-400 hover:to-red-600"; // Red for occupied (can be deleted)
      } else {
        return "bg-gradient-to-br from-gray-300 to-gray-500 hover:from-gray-400 hover:to-gray-600"; // Gray for empty (cannot be deleted)
      }
    }

    // Normal mode
    return "bg-gradient-to-br from-blue-300 to-blue-500 hover:from-blue-400 hover:to-blue-600"; // Blue for normal
  };

  return (
    <button
      className={cn(
        "absolute w-8 h-8 rounded-full transition-all pointer-events-auto",
        "shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.3)]",
        "border-2 border-white",
        getColorClasses(),
        !isDisabled && "cursor-pointer hover:scale-125",
        isHighlighted && !isFirstTerminal && "ring-4 ring-green-400 scale-125 hover:scale-150",
        isOccupied && !isDeleteMode && !isDisabled && "opacity-50", // Only make semi-transparent in normal mode
        isDisabled && "opacity-30" // Dimmed when disabled
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

