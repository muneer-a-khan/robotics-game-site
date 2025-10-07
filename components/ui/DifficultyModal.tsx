'use client';

// Difficulty Selector Modal

import { Difficulty } from '@/types/game.types';

interface DifficultyModalProps {
  onSelect: (difficulty: Difficulty) => void;
  circuitNumber: number;
}

export function DifficultyModal({
  onSelect,
  circuitNumber,
}: DifficultyModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-2">
          Circuit {circuitNumber}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose your difficulty level
        </p>

        <div className="space-y-4">
          <button
            onClick={() => onSelect('easy')}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="text-2xl mb-1">🟢 Easy</div>
            <div className="text-sm opacity-90">
              Fewer components, simpler circuits
            </div>
          </button>

          <button
            onClick={() => onSelect('hard')}
            className="w-full bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="text-2xl mb-1">🔴 Hard</div>
            <div className="text-sm opacity-90">
              More components, complex circuits
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

