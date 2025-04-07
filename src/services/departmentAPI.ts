const API_URL = 'http://localhost:6202';

export const departmentAPI = {
  gets: `${API_URL}/api/departments`,
  get: (id: number) => `${API_URL}/api/departments/${id}`,
  create: `${API_URL}/api/departments`,
  createBulk: `${API_URL}/api/departments/bulk`,
  update: (id: number) => `${API_URL}/api/departments/${id}`,
  delete: (id: number) => `${API_URL}/api/departments/${id}`,
};