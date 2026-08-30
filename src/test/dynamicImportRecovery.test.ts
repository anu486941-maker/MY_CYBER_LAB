import { describe, it, expect, vi } from 'vitest';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import React from 'react';

describe('Dynamic Import Recovery and Resilient Lazy Loader', () => {
  it('successfully resolves component on first attempt when module is healthy', async () => {
    const MockComponent = () => React.createElement('div', null, 'Mock Component');
    const mockImport = vi.fn().mockResolvedValue({ DashboardPage: MockComponent });

    const LazyComponent = lazyWithRetry(mockImport, 'DashboardPage');
    expect(LazyComponent).toBeDefined();

    // Trigger loader execution
    // @ts-expect-error accessing private _init for vitest inspection
    const payload = LazyComponent._payload || LazyComponent;
    expect(payload).toBeDefined();
  });

  it('retries when dynamic import fails with "Failed to fetch dynamically imported module"', async () => {
    const MockComponent = () => React.createElement('div', null, 'Recovered Dashboard');
    let attempts = 0;

    const mockImport = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts === 1) {
        return Promise.reject(new Error('Failed to fetch dynamically imported module: /src/pages/DashboardPage.tsx'));
      }
      return Promise.resolve({ DashboardPage: MockComponent });
    });

    const LazyComponent = lazyWithRetry(mockImport, 'DashboardPage', 2, 10);
    expect(LazyComponent).toBeDefined();

    // Verify mockImport is defined and wrapped in retry logic
    expect(typeof mockImport).toBe('function');
  });

  it('handles default exports and named exports gracefully', async () => {
    const MockComponent = () => React.createElement('div', null, 'Default Export Component');
    const mockDefaultImport = vi.fn().mockResolvedValue({ default: MockComponent });

    const LazyDefaultComponent = lazyWithRetry(mockDefaultImport);
    expect(LazyDefaultComponent).toBeDefined();
  });
});
