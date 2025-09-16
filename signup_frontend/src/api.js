//
// API client for interacting with the signup backend
//

const DEFAULT_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Build full URL for API paths using configured base URL.
 */
function buildUrl(path) {
  const base = DEFAULT_BASE_URL.replace(/\/+$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * Basic helper to handle fetch responses.
 */
async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }
  if (!res.ok) {
    const message =
      (data && (data.detail || data.message || JSON.stringify(data))) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/**
 * Persist token to localStorage.
 */
export function setToken(token) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

/**
 * Get token from localStorage.
 */
export function getToken() {
  return localStorage.getItem('auth_token');
}

/**
 * PUBLIC_INTERFACE
 * Register a new user.
 * @param {Object} payload { email, password, full_name? }
 * @returns {Promise<Object>} UserPublic
 */
export async function registerUser(payload) {
  const res = await fetch(buildUrl('/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * Login with email and password.
 * @param {Object} payload { email, password }
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export async function loginUser(payload) {
  const res = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  if (data && data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Get current user profile using bearer token.
 * @returns {Promise<Object>} UserPublic
 */
export async function getMe() {
  const token = getToken();
  const res = await fetch(buildUrl('/auth/me'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * Social sign-in placeholder (Google/Apple).
 * @param {Object} payload { provider: 'google'|'apple', id_token?, access_token? }
 */
export async function socialSignIn(payload) {
  const res = await fetch(buildUrl('/auth/social'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(res);
  if (data && data.access_token) {
    setToken(data.access_token);
  }
  return data;
}

/**
 * PUBLIC_INTERFACE
 * Fetch onboarding progress for the current user.
 * @returns {Promise<Object>} onboarding map
 */
export async function getOnboardingProgress() {
  const token = getToken();
  const res = await fetch(buildUrl('/onboarding/progress'), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

/**
 * PUBLIC_INTERFACE
 * Update a specific onboarding step.
 * @param {Object} payload { step, status, data? }
 * @returns {Promise<Object>} updated onboarding map
 */
export async function updateOnboardingStep(payload) {
  const token = getToken();
  const res = await fetch(buildUrl('/onboarding/step'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
