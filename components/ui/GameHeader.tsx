'use client';

// Game Header Component

import { Difficulty } from '@/types/game.types';

interface GameHeaderProps {
  circuitNumber: number;
  difficulty: Difficulty;
  timeRemaining: number;
  onDone: () => void;
}

export function GameHeader({
  circuitNumber,
  difficulty,
  timeRemaining,
  onDone,
}: GameHeaderProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const getTimeColor = () => {
    if (timeRemaining <= 30) return 'text-red-600';
    if (timeRemaining <= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <header className="bg-white shadow-lg rounded-lg p-4 border-2 border-indigo-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-indigo-700">Circuit</span>
            <span className="ml-2 text-2xl font-bold text-indigo-900">
              {circuitNumber}/3
            </span>
          </div>

          <div className={`rounded-lg px-4 py-2 ${
            difficulty === 'easy' 
              ? 'bg-green-100 border-2 border-green-500' 
              : 'bg-red-100 border-2 border-red-500'
          }`}>
            <span className={`text-lg font-bold ${
              difficulty === 'easy' ? 'text-green-700' : 'text-red-700'
            }`}>
              {difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-gray-600">Time</span>
            <span className={`ml-2 text-2xl font-bold ${getTimeColor()}`}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={onDone}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Done
          </button>
        </div>
      </div>
    </header>
  );
}

