'use client';

import { ComponentType, COMPONENT_METADATA, Component } from '@/types';

interface ToolboxProps {
  placedComponents: Component[];
}

// All available components except battery_holder (which is pre-placed)
const AVAILABLE_COMPONENTS: ComponentType[] = [
  'wire',
  'led_yellow',
  'led_red',
  'resistor',
  'lamp',
  'photoresistor',
  'music_ic',
  'alarm_ic',
  'space_war_ic',
  'speaker',
  'slide_switch',
  'press_switch',
  'whistle_chip',
];

export default function Toolbox({ placedComponents }: ToolboxProps) {
  const handleDragStart = (e: React.DragEvent, type: ComponentType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
  };

  const getComponentCount = (type: ComponentType): number => {
    return placedComponents.filter(c => c.type === type).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300 max-h-[800px] overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
        Component Toolbox
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_COMPONENTS.map((type) => {
          const metadata = COMPONENT_METADATA[type];
          const count = getComponentCount(type);
          const isMaxed = count >= metadata.maxCount;

          return (
            <div
              key={type}
              draggable={!isMaxed}
              onDragStart={(e) => handleDragStart(e, type)}
              className={`rounded-lg p-3 shadow-md transition-all relative ${
                isMaxed
                  ? 'opacity-50 cursor-not-allowed bg-gray-300'
                  : 'cursor-grab active:cursor-grabbing hover:shadow-xl hover:scale-105'
              }`}
              style={{
                backgroundColor: isMaxed ? '#D1D5DB' : metadata.color,
              }}
            >
              <div className="text-white text-center">
                <div className="font-bold text-xs mb-1 leading-tight">
                  {metadata.displayName}
                </div>
                <div className="text-xs opacity-90">
                  {count}/{metadata.maxCount}
                </div>
              </div>
              
              {isMaxed && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">
                  MAX
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
        <p className="font-semibold mb-1">Controls:</p>
        <ul className="text-xs space-y-1">
          <li>• Drag components to grid</li>
          <li>• Double-click to rotate</li>
          <li>• Right-click to remove</li>
          <li>• Max 2 per component type</li>
        </ul>
      </div>
    </div>
  );
}

