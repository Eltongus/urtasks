const API_URL = 'http://localhost:3000/api/notas';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const notesApi = {
  getAll: async (token) => {
    const res = await fetch(API_URL, { headers: getHeaders(token) });
    return res.json();
  },
  create: async (token, note) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(note)
    });
    return res.json();
  },
  update: async (token, id, updates) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    return res.json();
  },
  delete: async (token, id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getHeaders(token) });
  }
};