import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { MemoryRouter } from 'react-router-dom';

const TestAuthComponent: React.FC = () => {
  const { user, isAuthLoading, signInWithGoogle, signOut } = useApp();

  if (isAuthLoading) {
    return <div data-testid="auth-loading">Loading Auth...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <span data-testid="user-email">{user.email}</span>
          <span data-testid="user-name">{user.displayName}</span>
          <button data-testid="logout-btn" onClick={signOut}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <span data-testid="guest-status">Guest User</span>
          <button data-testid="login-btn" onClick={signInWithGoogle}>
            Sign In with Google
          </button>
        </div>
      )}
    </div>
  );
};

describe('Authentication Flow Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders auth state correctly for unauthenticated guest user', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <TestAuthComponent />
        </AppProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('auth-loading')).toBeNull();
    });

    expect(screen.getByTestId('login-btn')).toBeDefined();
    expect(screen.getByTestId('guest-status').textContent).toBe('Guest User');
  });

  it('handles sign in trigger gracefully without crashing', async () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <TestAuthComponent />
        </AppProvider>
      </MemoryRouter>
    );

    const loginBtn = await screen.findByTestId('login-btn');
    expect(loginBtn).toBeDefined();
    
    // Simulate clicking login button
    fireEvent.click(loginBtn);
    expect(loginBtn).toBeDefined();
  });
});
