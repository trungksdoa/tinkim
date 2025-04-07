const API_URL = 'http://localhost:6202';

export const roleAPI = {
  gets: `${API_URL}/api/roles`,
  get: (id: number) => `${API_URL}/api/roles/${id}`,
  create: `${API_URL}/api/roles`,
  update: (id: number) => `${API_URL}/api/roles/${id}`,
  delete: (id: number) => `${API_URL}/api/roles/${id}`,
};