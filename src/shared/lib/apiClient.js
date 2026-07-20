const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(method, path, body) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'NetworkError', message: response.statusText };
    }
    const error = new Error(errorData.message || 'Request failed');
    error.name = errorData.error || 'RequestError';
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path),
};

export default api;
