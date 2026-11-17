import { useEffect, useState } from 'react'
import { api } from '../api'

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

export default function Tasks({ user, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ title: '', content: '' })

  useEffect(() => {
    let cancelled = false
    api.list()
      .then((data) => { if (!cancelled) setTasks(data) })
      .catch((e) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const run = async (action) => {
    setError('')
    try {
      await action()
    } catch (e) {
      setError(e.message)
    }
  }

  const replaceTask = (updated) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))

  const handleCreate = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    run(async () => {
      const created = await api.create({ title: title.trim(), content: content.trim() })
      setTasks((prev) => [created, ...prev])
      setTitle('')
      setContent('')
    })
  }

  const toggle = (task) =>
    run(async () => {
      const status = task.status === 'completed' ? 'pending' : 'completed'
      replaceTask(await api.update(task.id, { status }))
    })

  const startEdit = (task) => {
    setEditingId(task.id)
    setDraft({ title: task.title, content: task.content ?? '' })
  }

  const saveEdit = (task) =>
    run(async () => {
      replaceTask(await api.update(task.id, {
        title: draft.title.trim(),
        content: draft.content.trim(),
      }))
      setEditingId(null)
    })

  const remove = (task) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return
    run(async () => {
      await api.remove(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    })
  }

  const visible = tasks.filter((t) => filter === 'all' || t.status === filter)

  return (
    <main className="card">
      <header className="topbar">
        <h1>URTASKS</h1>
        <div>
          <span className="muted">{user.email}</span>
          <button type="button" className="link" onClick={onLogout}>Salir</button>
        </div>
      </header>

      <form onSubmit={handleCreate} className="new-task">
        <input
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
        <button type="submit">Agregar tarea</button>
      </form>

      <nav className="filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={filter === f.value ? 'active' : ''}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {error && <p className="error">{error}</p>}
      {loading && <p className="muted">Cargando tareas...</p>}
      {!loading && visible.length === 0 && <p className="muted">No hay tareas para mostrar.</p>}

      <ul className="task-list">
        {visible.map((task) => (
          <li key={task.id} className={task.status === 'completed' ? 'done' : ''}>
            {editingId === task.id ? (
              <div className="edit">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                <textarea
                  rows={2}
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
                <div className="actions">
                  <button type="button" onClick={() => saveEdit(task)}>Guardar</button>
                  <button type="button" className="link" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => toggle(task)}
                />
                <div className="body">
                  <strong>{task.title}</strong>
                  {task.content && <p>{task.content}</p>}
                </div>
                <div className="actions">
                  <button type="button" className="link" onClick={() => startEdit(task)}>Editar</button>
                  <button type="button" className="link danger" onClick={() => remove(task)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}