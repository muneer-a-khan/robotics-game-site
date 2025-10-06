'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Component, Wire, Difficulty, GameState, getConnectionPointsForType } from '@/types';
import GridCircuitBoard from '@/components/Grid-CircuitBoard';
import Toolbox from '@/components/Toolbox';
import GameHeader from '@/components/GameHeader';
import DifficultySelector from '@/components/DifficultySelector';
import { validateCircuit } from '@/utils/validation';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    sessionId: null,
    currentCircuit: 1,
    difficulty: 'easy',
    components: [],
    wires: [],
    timeRemaining: 180,
    isPlaying: false,
    startTime: null,
  });

  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [actionQueue, setActionQueue] = useState<Array<() => Promise<void>>>([]);
  const processingQueue = useRef(false);

  // Timer countdown
  useEffect(() => {
    if (!gameState.isPlaying || gameState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          handleCircuitComplete();
          return { ...prev, timeRemaining: 0, isPlaying: false };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeRemaining]);

  // Process action queue with batching
  useEffect(() => {
    const processQueue = async () => {
      if (processingQueue.current || actionQueue.length === 0) return;
      
      processingQueue.current = true;
      const batch = actionQueue.slice(0, 10); // Process up to 10 actions at once
      
      try {
        await Promise.all(batch.map(action => action()));
        setActionQueue(prev => prev.slice(batch.length));
      } catch (error) {
        console.error('Error processing action queue:', error);
      } finally {
        processingQueue.current = false;
      }
    };

    const interval = setInterval(processQueue, 1000); // Process every second
    return () => clearInterval(interval);
  }, [actionQueue]);

  const queueAction = (action: () => Promise<void>) => {
    setActionQueue(prev => [...prev, action]);
  };

  // Helper to call API routes
  const trackAction = async (actionType: string, data: any) => {
    if (!gameState.sessionId) return;
    
    try {
      await fetch('/api/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          sessionId: gameState.sessionId,
          data,
        }),
      });
    } catch (error) {
      console.error('Error tracking action:', error);
    }
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    try {
      // Create new session for this circuit via API
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circuitNumber: gameState.currentCircuit,
          difficulty,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');
      const session = await response.json();
      
      // Place battery holder at far left, centered vertically (x:0, y:1)
      const battery: Component = {
        id: 'battery-1',
        type: 'battery_holder',
        gridPosition: { x: 0, y: 1 },
        orientation: 0,
        connectionPoints: getConnectionPointsForType('battery_holder', 'battery-1'),
      };

      setGameState((prev) => ({
        ...prev,
        sessionId: session.id,
        difficulty,
        components: [battery],
        wires: [],
        isPlaying: true,
        startTime: Date.now(),
        timeRemaining: 180,
      }));
      setShowDifficultySelector(false);

      // Track battery placement
      queueAction(() => trackAction('place_component', {
        componentType: battery.type,
        componentId: battery.id,
        gridPosition: battery.gridPosition,
        orientation: battery.orientation,
      }));
    } catch (error) {
      console.error('Error starting circuit:', error);
      alert('Failed to start circuit. Please try again.');
    }
  };

  const handleComponentPlace = (component: Component) => {
    setGameState((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));

    // Track action
    if (gameState.sessionId) {
      queueAction(() => trackAction('place_component', {
        componentType: component.type,
        componentId: component.id,
        gridPosition: component.gridPosition,
        orientation: component.orientation,
      }));
    }
  };

  const handleComponentMove = (id: string, gridPosition: { x: number; y: number }) => {
    const component = gameState.components.find(c => c.id === id);
    if (!component) return;

    setGameState((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === id ? { ...c, gridPosition } : c
      ),
    }));

    // Track as remove + place
    if (gameState.sessionId) {
      queueAction(() => trackAction('remove_component', { componentId: id }));
      queueAction(() => trackAction('place_component', {
        componentType: component.type,
        componentId: id,
        gridPosition: gridPosition,
        orientation: component.orientation,
      }));
    }
  };

  const handleComponentRotate = (id: string) => {
    const component = gameState.components.find(c => c.id === id);
    if (!component) return;

    setGameState((prev) => ({
      ...prev,
      components: prev.components.map((c) => {
        if (c.id === id) {
          const newOrientation = ((c.orientation + 90) % 360) as 0 | 90 | 180 | 270;
          return { ...c, orientation: newOrientation };
        }
        return c;
      }),
    }));

    // Track as remove + place with new orientation
    if (gameState.sessionId) {
      const newOrientation = ((component.orientation + 90) % 360) as 0 | 90 | 180 | 270;
      queueAction(() => trackAction('remove_component', { componentId: id }));
      queueAction(() => trackAction('place_component', {
        componentType: component.type,
        componentId: id,
        gridPosition: component.gridPosition,
        orientation: newOrientation,
      }));
    }
  };

  const handleComponentRemove = (id: string) => {
    // Remove component and its associated wires
    setGameState((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== id),
      wires: prev.wires.filter(
        (w) =>
          !prev.components
            .find((c) => c.id === id)
            ?.connectionPoints.some((cp) => cp.id === w.fromConnectionPointId || cp.id === w.toConnectionPointId)
      ),
    }));

    // Track action
    if (gameState.sessionId) {
      queueAction(() => trackAction('remove_component', { componentId: id }));
    }
  };

  const handleComponentSelect = (id: string | null) => {
    setSelectedComponentId(id);
  };

  const handleWireCreate = (wire: Wire) => {
    setGameState((prev) => ({
      ...prev,
      wires: [...prev.wires, wire],
    }));

    // Track action
    if (gameState.sessionId) {
      queueAction(() => trackAction('add_wire', {
        wireData: {
          fromId: wire.fromConnectionPointId,
          toId: wire.toConnectionPointId,
        },
      }));
    }
  };

  const handleWireRemove = (wireId: string) => {
    const wire = gameState.wires.find(w => w.id === wireId);
    setGameState((prev) => ({
      ...prev,
      wires: prev.wires.filter((w) => w.id !== wireId),
    }));

    // Track action
    if (gameState.sessionId && wire) {
      queueAction(() => trackAction('remove_wire', {
        wireData: {
          fromId: wire.fromConnectionPointId,
          toId: wire.toConnectionPointId,
        },
      }));
    }
  };

  const handleCircuitComplete = async () => {
    if (!gameState.sessionId) return;

    const timeTaken = gameState.startTime
      ? Math.floor((Date.now() - gameState.startTime) / 1000)
      : 180;

    try {
      // Get target circuit for validation via API
      const circuitResponse = await fetch(
        `/api/circuits?circuitNumber=${gameState.currentCircuit}&difficulty=${gameState.difficulty}`
      );
      
      let isCorrect = false;
      if (circuitResponse.ok) {
        const targetCircuit = await circuitResponse.json();
        const validation = validateCircuit(
          gameState.components,
          gameState.wires,
          targetCircuit
        );
        isCorrect = validation.isValid;

        if (!isCorrect) {
          alert(`Circuit incorrect!\n\nErrors:\n${validation.errors.join('\n')}`);
        } else {
          alert('Circuit correct! Well done!');
        }
      }

      // Complete the session via API
      await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: gameState.sessionId,
          timeTaken,
          isCorrect,
        }),
      });

      if (gameState.currentCircuit < 3) {
        // Move to next circuit
        setGameState((prev) => ({
          ...prev,
          sessionId: null,
          currentCircuit: prev.currentCircuit + 1,
          components: [],
          wires: [],
          timeRemaining: 180,
          isPlaying: false,
        }));
        setShowDifficultySelector(true);
        setSelectedComponentId(null);
      } else {
        // Game complete - all 3 circuits done
        alert('🎉 All circuits complete! Check the leaderboard to see your results.');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error completing circuit:', error);
      alert('Error saving results. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      {showDifficultySelector && (
        <DifficultySelector
          circuitNumber={gameState.currentCircuit}
          onSelect={handleDifficultySelect}
        />
      )}

      <div className="max-w-[1400px] mx-auto space-y-4">
        <GameHeader
          circuitNumber={gameState.currentCircuit}
          difficulty={gameState.difficulty}
          timeRemaining={gameState.timeRemaining}
          onDone={handleCircuitComplete}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 flex justify-center">
            <GridCircuitBoard
              components={gameState.components}
              wires={gameState.wires}
              onComponentPlace={handleComponentPlace}
              onComponentMove={handleComponentMove}
              onComponentRotate={handleComponentRotate}
              onComponentRemove={handleComponentRemove}
              onComponentSelect={handleComponentSelect}
              onWireCreate={handleWireCreate}
              onWireRemove={handleWireRemove}
              selectedComponentId={selectedComponentId}
              isWireMode={true}
            />
          </div>

          <div className="space-y-4">
            <Toolbox placedComponents={gameState.components} />

            <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Actions
              </h3>
              
              <div className="space-y-3">
                {selectedComponentId && gameState.components.find(c => c.id === selectedComponentId)?.type !== 'battery_holder' && (
                  <button
                    onClick={() => handleComponentRotate(selectedComponentId)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    🔄 Rotate Selected
                  </button>
                )}

                <div className="bg-blue-50 p-3 rounded text-sm text-blue-900">
                  <p className="font-semibold mb-1">💡 How to Connect:</p>
                  <p className="text-xs">
                    1. Drag a <strong>Wire</strong> from toolbox<br/>
                    2. Click wire's connection points<br/>
                    3. Click other component points
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg shadow-lg p-4 border-2 border-amber-300">
              <h3 className="text-sm font-bold text-amber-900 mb-2">
                Quick Guide
              </h3>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• Drag components from toolbox</li>
                <li>• Double-click to rotate</li>
                <li>• Right-click to remove</li>
                <li>• Use Wire to connect points</li>
                <li>• Click connection points on wires</li>
                <li>• Then click target points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
