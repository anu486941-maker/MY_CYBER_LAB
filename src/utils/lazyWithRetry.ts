import React, { ComponentType, lazy } from 'react';

/**
 * Resilient Dynamic Import with Automatic Retry and Stale Chunk Recovery.
 * 
 * Protects against:
 * 1. "Failed to fetch dynamically imported module" (Vite dev server restart / network drop)
 * 2. "Loading chunk [x] failed" / ChunkLoadError (Production deployment cache mismatch)
 * 3. Transient network glitch during route transitions
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<any>,
  namedExport?: string,
  retriesLeft = 2,
  intervalMs = 500
): React.LazyExoticComponent<T> {
  return lazy(() => {
    const attempt = (remainingRetries: number): Promise<{ default: T }> => {
      return componentImport()
        .then((module) => {
          if (namedExport && module && typeof module === 'object' && namedExport in module) {
            return { default: (module as Record<string, T>)[namedExport] };
          }
          if ('default' in module && module.default) {
            return { default: module.default as T };
          }
          // Fallback if the module is the component itself
          return { default: module as unknown as T };
        })
        .catch((error: Error) => {
          const isChunkError =
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('dynamically imported module') ||
            error.name === 'ChunkLoadError';

          if (remainingRetries > 0) {
            return new Promise((resolve) => setTimeout(resolve, intervalMs)).then(() =>
              attempt(remainingRetries - 1)
            );
          }

          // If chunk is stale after all retries and in browser environment, check if session reload is appropriate
          if (isChunkError && typeof window !== 'undefined' && !window.sessionStorage.getItem('mcl_chunk_reloaded')) {
            window.sessionStorage.setItem('mcl_chunk_reloaded', 'true');
            console.warn('[MY CYBER LAB] Stale dynamic chunk detected. Performing automatic state recovery refresh...');
            window.location.reload();
          }

          console.error('[MY CYBER LAB] Dynamic module import failed after retries:', error);
          throw error;
        });
    };

    return attempt(retriesLeft);
  });
}
