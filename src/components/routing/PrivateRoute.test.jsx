import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import * as AuthContext from '../../context/AuthContext';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Secret Dashboard</div>
            </PrivateRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('PrivateRoute', () => {
  it('shows a loading state while the session is still being validated', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, loading: true });

    renderAt('/dashboard');

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('redirects to /login when there is no authenticated user', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ user: null, loading: false });

    renderAt('/dashboard');

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('renders the protected content when there is an authenticated user', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { user_id: 1, name: 'Test User' },
      loading: false,
    });

    renderAt('/dashboard');

    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
  });
});
