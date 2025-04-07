const API_URL = 'http://localhost:6202';

export const bankAPI = {
  gets: `${API_URL}/api/banks`,
  get: (id: number) => `${API_URL}/api/banks/${id}`,
  create: `${API_URL}/api/banks`,
  update: (id: number) => `${API_URL}/api/banks/${id}`,
  delete: (id: number) => `${API_URL}/api/banks/${id}`,
};