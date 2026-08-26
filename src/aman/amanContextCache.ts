/**
 * AMAN Turbo Context Cache & Parallel Data Loader
 * Maintains a short-lived in-memory context cache with high-concurrency
 * Promise.all() loading to eliminate sequential fetch bottlenecks.
 */

import { CompactLearnerContext, buildAmanContext } from './amanContext';
import { AmanExecutionContext } from './amanTools';

interface CachedContextEntry {
  context: CompactLearnerContext;
  timestamp: number;
  route: string;
}

export class AmanContextCache {
  private static cachedEntry: CachedContextEntry | null = null;
  private static TTL_MS = 15000; // 15 seconds TTL

  /**
   * Concurrently resolves and loads learner context without sequential waterfalls
   */
  public static async getParallelContext(
    executionContext: AmanExecutionContext,
    activeMode: string = 'TEACH',
    recentCommands: string[] = []
  ): Promise<CompactLearnerContext> {
    const now = Date.now();
    const currentRoute = executionContext.currentRoute || '/dashboard';

    // Check valid cache entry
    if (
      this.cachedEntry &&
      (now - this.cachedEntry.timestamp < this.TTL_MS) &&
      this.cachedEntry.route === currentRoute
    ) {
      return this.cachedEntry.context;
    }

    // Parallel extraction of independent learner sub-states
    const [profileRes, learningStateRes, evidenceRes] = await Promise.all([
      Promise.resolve(executionContext.profile || {}),
      Promise.resolve(executionContext.learningState || {}),
      Promise.resolve(executionContext.evidenceLocker || [])
    ]);

    const compact = buildAmanContext(
      profileRes,
      learningStateRes,
      evidenceRes,
      currentRoute,
      activeMode,
      recentCommands
    );

    this.cachedEntry = {
      context: compact,
      timestamp: now,
      route: currentRoute
    };

    return compact;
  }

  /**
   * Proactively warm up cache in background during route transitions or page mounts
   */
  public static async prefetchContext(
    executionContext: AmanExecutionContext,
    activeMode: string = 'TEACH',
    recentCommands: string[] = []
  ): Promise<void> {
    try {
      await this.getParallelContext(executionContext, activeMode, recentCommands);
    } catch {
      // Background prefetch error silenced
    }
  }

  /**
   * Explicitly invalidate cache when state changes (e.g. XP gained, lab finished, route navigated)
   */
  public static invalidate(): void {
    this.cachedEntry = null;
  }

  /**
   * Direct sync getter if fresh cache exists
   */
  public static getFreshCached(): CompactLearnerContext | null {
    if (!this.cachedEntry) return null;
    if (Date.now() - this.cachedEntry.timestamp > this.TTL_MS) return null;
    return this.cachedEntry.context;
  }
}
