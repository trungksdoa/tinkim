const API_URL = 'http://localhost:6202';

export const groupAPI = {
  gets: `${API_URL}/api/groups`,
  get: (id: number) => `${API_URL}/api/groups/${id}`,
  create: `${API_URL}/api/groups`,
  createBulk: `${API_URL}/api/groups/bulk`,
  update: (id: number) => `${API_URL}/api/groups/${id}`,
  delete: (id: number) => `${API_URL}/api/groups/${id}`,
};