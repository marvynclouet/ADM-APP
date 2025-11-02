/**
 * Utilitaires pour optimiser les performances
 */

/**
 * Debounce function pour limiter les appels de fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function pour limiter la fréquence d'appels
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Lazy load des composants - utilise React.lazy dans le composant
 * Usage: const Component = React.lazy(() => import('./Component'));
 */

/**
 * Mémoization simple pour les calculs coûteux
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Précharge les données nécessaires
 */
export const preloadData = async <T>(dataLoader: () => Promise<T>): Promise<T> => {
  return await dataLoader();
};

/**
 * Mesure les performances d'une fonction
 */
export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  label?: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    if (__DEV__) {
      console.log(`[Performance] ${label || 'Function'}: ${end - start}ms`);
    }
    return result;
  }) as T;
};

