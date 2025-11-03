import { useCallback, useRef, useEffect } from 'react';
import { debounce, throttle } from '../utils/performance';

/**
 * Hook pour optimiser les performances des callbacks
 */
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  mode: 'debounce' | 'throttle' = 'debounce'
): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const optimizedCallback = useCallback(
    mode === 'debounce'
      ? debounce((...args: Parameters<T>) => callbackRef.current(...args), delay)
      : throttle((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay, mode]
  ) as T;

  return optimizedCallback;
};

/**
 * Hook pour mesurer le temps de rendu
 */
export const useRenderTime = (componentName: string) => {
  const renderStart = useRef<number>(0);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStart.current;
    if (__DEV__ && renderTime > 16) {
      // Avertir si le rendu prend plus de 16ms (60fps)
      console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  });
};


