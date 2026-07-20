import api from '../../../shared/lib/apiClient.js';

export function register(data) {
  return api.post('/auth/register', data);
}

export function login(data) {
  return api.post('/auth/login', data);
}

export function logout() {
  return api.post('/auth/logout');
}

export function getMe() {
  return api.get('/auth/me');
}
