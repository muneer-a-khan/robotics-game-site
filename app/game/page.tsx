'use client';

// Main Game Page with Snap Circuits Architecture

import { useState, useEffect } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { useGameState } from '@/hooks/useGameState';
import { SnapCircuitBoard } from '@/components/game/SnapCircuitBoard';
import { ComponentToolbox } from '@/components/game/ComponentToolbox';
import { GameHeader } from '@/components/ui/GameHeader';
import { DifficultyModal } from '@/components/ui/DifficultyModal';
import { validateCircuit } from '@/lib/validation';
import { Difficulty } from '@/types/game.types';
import { getOccupiedSnapPoints, getTerminals } from '@/utils/snap-logic';
import { COMPONENT_PATTERNS } from '@/config/components.config';

function GameContent() {
  const {
    sessionId,
    currentCircuit,
    difficulty,
    timeRemaining,
    isPlaying,
    components,
    connections,
    snapGrid,
    placeComponent,
    startGame,
    stopTimer,
    setValidationErrors,
  } = useGameState();
  
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  
  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      const newTime = timeRemaining - 1;
      if (newTime <= 0) {
        handleCircuitComplete();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining]);
  
  const handleDifficultySelect = async (selectedDifficulty: Difficulty) => {
    try {
      // Create session
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuitNumber: currentCircuit,
          difficulty: selectedDifficulty,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      const session = await response.json();
      
      // Start game
      startGame(session.id, selectedDifficulty, currentCircuit);
      setShowDifficultySelector(false);
      
      // Place battery holder at position (0, 2) - Row C, Column 1
      const batterySnapPoint = snapGrid[2][0]; // Row C (index 2), Column 1 (index 0)
      placeComponent('battery_holder', batterySnapPoint, 0);
      
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };
  
  const handleCircuitComplete = async () => {
    if (!sessionId) return;
    
    stopTimer();
    
    const timeTaken = 180 - timeRemaining;
    
    try {
      // Fetch target circuit
      const circuitResponse = await fetch(
        `/api/circuits?circuitNumber=${currentCircuit}&difficulty=${difficulty}`
      );
      
      if (!circuitResponse.ok) {
        throw new Error('Failed to fetch target circuit');
      }
      
      const targetCircuit = await circuitResponse.json();
      
      // Validate circuit
      const userComponents = Array.from(components.values());
      const validation = validateCircuit(
        userComponents,
        connections,
        targetCircuit
      );
      
      // Complete session
      await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          timeTaken,
          isCorrect: validation.isValid,
          errorDetails: validation.errors,
        }),
      });
      
      // Show results
      if (validation.isValid) {
        alert('🎉 Circuit correct! Well done!');
        
        if (currentCircuit < 3) {
          // Move to next circuit
          setShowDifficultySelector(true);
          setValidationErrors([]);
        } else {
          alert('🏆 All circuits complete! Check the leaderboard.');
          window.location.href = '/';
        }
      } else {
        alert(`Circuit incorrect!\n\nErrors:\n${validation.errors.join('\n')}`);
        setValidationErrors(validation.errors);
      }
      
    } catch (error) {
      console.error('Error completing circuit:', error);
      alert('Error validating circuit. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      {showDifficultySelector && (
        <DifficultyModal
          circuitNumber={currentCircuit}
          onSelect={handleDifficultySelect}
        />
      )}
      
      <div className="max-w-[1600px] mx-auto space-y-4">
        <GameHeader
          circuitNumber={currentCircuit}
          difficulty={difficulty}
          timeRemaining={timeRemaining}
          onDone={handleCircuitComplete}
        />
        
        <div className="flex gap-4">
          <div className="flex-1 flex justify-center">
            <SnapCircuitBoard />
          </div>
          
          <ComponentToolbox />
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

