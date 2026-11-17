import { supabase } from './lib/supabase'

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(`https://repulsive-tomb-x5xwx5j56674h9qw6-3000.app.github.dev/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
    },
  })

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Error en la petición')
  return body
}

export const api = {
  list: () => request('/notas'),
  create: (task) => request('/notas', { method: 'POST', body: JSON.stringify(task) }),
  update: (id, changes) => request(`/notas/${id}`, { method: 'PUT', body: JSON.stringify(changes) }),
  remove: (id) => request(`/notas/${id}`, { method: 'DELETE' }),
}