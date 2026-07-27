const AUTH_TOKEN_KEY = 'product-feedback-board.authToken';

export function getAuthToken() {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  if (typeof window === 'undefined') return;

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage failures and fall back to cookie-based auth.
  }
}

export function clearAuthToken() {
  setAuthToken(null);
}
