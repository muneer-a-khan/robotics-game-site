'use client';

// Action Tracking Hook for Database

import { useEffect, useRef, useCallback } from 'react';
import { GameActionData } from '@/types/database.types';

export function useActionTracking(sessionId: string | null) {
  const actionQueue = useRef<GameActionData[]>([]);
  const processingRef = useRef(false);
  
  // Process queue every second
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(async () => {
      if (processingRef.current || actionQueue.current.length === 0) return;
      
      processingRef.current = true;
      const batch = actionQueue.current.splice(0, 10);
      
      try {
        await fetch('/api/actions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, actions: batch }),
        });
      } catch (error) {
        console.error('Failed to save actions:', error);
        // Re-add to queue
        actionQueue.current.unshift(...batch);
      } finally {
        processingRef.current = false;
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionId]);
  
  const trackAction = useCallback((action: Omit<GameActionData, 'sessionId' | 'timestamp'>) => {
    if (!sessionId) return;
    
    actionQueue.current.push({
      ...action,
      sessionId,
      timestamp: new Date(),
    });
  }, [sessionId]);
  
  return { trackAction };
}

