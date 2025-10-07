'use client';

// Component Toolbox

import { ComponentType } from '@/types/component.types';
import { COMPONENT_PATTERNS, AVAILABLE_COMPONENTS } from '@/config/components.config';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

export function ComponentToolbox() {
  const { selectedComponent, selectComponent, components } = useGameState();
  
  const countComponents = (type: ComponentType): number => {
    return Array.from(components.values()).filter(c => c.type === type).length;
  };
  
  return (
    <div className="w-80 h-full bg-gradient-to-br from-gray-800 to-gray-900 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Components</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_COMPONENTS.map(componentType => {
          const pattern = COMPONENT_PATTERNS[componentType];
          const count = countComponents(componentType);
          const isMaxed = count >= pattern.maxCount;
          const isSelected = selectedComponent === componentType;
          
          return (
            <ComponentCard
              key={componentType}
              type={componentType}
              count={count}
              max={pattern.maxCount}
              isMaxed={isMaxed}
              isSelected={isSelected}
              onSelect={() => selectComponent(isSelected ? null : componentType)}
            />
          );
        })}
      </div>
      
      <div className="mt-6 p-3 bg-blue-900/30 rounded text-sm text-blue-200">
        <p className="font-semibold mb-2">How to Place:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Click a component above</li>
          <li>Click a green snap point on the board</li>
          <li>Double-click to rotate</li>
          <li>Right-click to remove</li>
        </ol>
      </div>
      
      {selectedComponent && (
        <div className="mt-4 p-3 bg-green-900/30 rounded text-sm text-green-200">
          <p className="font-semibold mb-1">✓ {COMPONENT_PATTERNS[selectedComponent].displayName} Selected</p>
          <p className="text-xs">Click a green snap point to place</p>
        </div>
      )}
    </div>
  );
}

interface ComponentCardProps {
  type: ComponentType;
  count: number;
  max: number;
  isMaxed: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

function ComponentCard({ type, count, max, isMaxed, isSelected, onSelect }: ComponentCardProps) {
  const pattern = COMPONENT_PATTERNS[type];
  
  return (
    <button
      className={cn(
        "relative p-3 rounded-lg border-2 transition-all",
        "flex flex-col items-center gap-2",
        isMaxed && "opacity-50 cursor-not-allowed",
        isSelected && "ring-4 ring-green-400 border-green-400 scale-105",
        !isMaxed && !isSelected && "border-gray-600 hover:border-gray-400 hover:scale-105"
      )}
      onClick={onSelect}
      disabled={isMaxed}
    >
      {/* Component preview image */}
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={pattern.image}
          alt={pattern.displayName}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            // Fallback to colored box
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = (e.target as HTMLImageElement).nextSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div
          className="w-full h-full rounded items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: pattern.color, display: 'none' }}
        >
          {pattern.displayName.substring(0, 3)}
        </div>
      </div>
      
      <span className="text-xs text-white font-medium text-center leading-tight">
        {pattern.displayName}
      </span>
      
      <span className={cn(
        "text-xs font-mono",
        isMaxed ? "text-red-400" : "text-gray-400"
      )}>
        {count}/{max}
      </span>
      
      {isMaxed && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded">
          MAX
        </div>
      )}
    </button>
  );
}

