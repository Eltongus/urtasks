const API_URL = import.meta.env.VITE_API_URL || 'https://urtasks-s1qo.onrender.com/api/notas';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const notesService = {
  async getAll(token) {
    const res = await fetch(API_URL, { headers: getHeaders(token) });
    if (!res.ok) throw new Error('Error al cargar notas');
    return res.json();
  },

  async create(token, noteData) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Error al crear nota');
    return res.json();
  },

  async update(token, id, noteData) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error('Error al actualizar nota');
    return res.json();
  },

  async remove(token, id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Error al eliminar nota');
  },
};