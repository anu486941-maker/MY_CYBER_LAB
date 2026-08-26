import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';

const TestNavigationComponent: React.FC = () => {
  const { activeCareerTrack, setActiveCareerTrack, profile, updateProfile } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      <div data-testid="career-track-id">{activeCareerTrack}</div>
      <div data-testid="profile-role">{profile.targetRole || profile.selectedRole || 'soc-analyst'}</div>
      <button
        data-testid="select-soc-role"
        onClick={() => {
          setActiveCareerTrack('SOC_ANALYST');
          updateProfile({ targetRole: 'soc-analyst' });
        }}
      >
        Select SOC Analyst
      </button>
      <button
        data-testid="select-pentest-role"
        onClick={() => {
          setActiveCareerTrack('ETHICAL_HACKER');
          updateProfile({ targetRole: 'ethical-hacker' });
        }}
      >
        Select Penetration Tester
      </button>
      <button
        data-testid="nav-to-labs"
        onClick={() => navigate('/labs')}
      >
        Go to Labs
      </button>
    </div>
  );
};

describe('Route Navigation & Role Persistence Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists selected role and updates active career track', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Routes>
            <Route path="/" element={<TestNavigationComponent />} />
            <Route path="/labs" element={<div data-testid="labs-page">Labs Page</div>} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('career-track-id')).toBeDefined();

    const pentestBtn = screen.getByTestId('select-pentest-role');
    fireEvent.click(pentestBtn);

    await waitFor(() => {
      expect(screen.getByTestId('career-track-id').textContent).toBe('ETHICAL_HACKER');
      expect(screen.getByTestId('profile-role').textContent).toBe('ethical-hacker');
    });
  });

  it('navigates to different routes correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppProvider>
          <Routes>
            <Route path="/" element={<TestNavigationComponent />} />
            <Route path="/labs" element={<div data-testid="labs-page">Labs Page</div>} />
          </Routes>
        </AppProvider>
      </MemoryRouter>
    );

    const navBtn = screen.getByTestId('nav-to-labs');
    fireEvent.click(navBtn);

    await waitFor(() => {
      expect(screen.getByTestId('labs-page')).toBeDefined();
    });
  });
});
