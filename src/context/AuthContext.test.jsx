import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';

function Harness() {
  const { user, token, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <span data-testid="token">{token || 'none'}</span>
      <button onClick={() => login({ user_id: 1, name: 'Test User', role: 'student' }, 'fake-token')}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderHarness() {
  return render(
    <AuthProvider>
      <Harness />
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AuthContext', () => {
  it('starts logged out when there is no stored token', async () => {
    renderHarness();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('login() sets user/token state and persists them to localStorage', async () => {
    renderHarness();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('login'));

    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
    expect(screen.getByTestId('token')).toHaveTextContent('fake-token');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Test User');
  });

  it('logout() clears state and localStorage', async () => {
    renderHarness();
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));

    await userEvent.click(screen.getByText('login'));
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');

    await userEvent.click(screen.getByText('logout'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('validates a stored token against GET /me on mount and adopts the returned user', async () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({ user_id: 1, name: 'Stale Name' }));
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: { user_id: 1, name: 'Fresh Name', role: 'student' } }),
    });

    renderHarness();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me'),
      expect.objectContaining({ headers: { Authorization: 'Bearer stored-token' } })
    );
    expect(screen.getByTestId('user')).toHaveTextContent('Fresh Name');
  });

  it('clears an invalid/expired stored token instead of trusting it', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('user', JSON.stringify({ user_id: 1, name: 'Stale Name' }));
    fetch.mockResolvedValueOnce({ ok: false });

    renderHarness();

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
