import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { useAuth } from '../context/AuthContext';
import { KANBAN_COLUMNS } from '../constants/kanban';
import { useNotes } from '../hooks/useNotes';
import { useKanbanDnd } from '../hooks/useKanbanDnd';
import { BoardHeader } from './BoardHeader';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { Search, X } from 'lucide-react';

export function KanbanBoard() {
  const { session, logout } = useAuth();
  const token = session?.access_token;

  const { notes, setNotes, loading, saveNote, deleteNote, updateNotePosition } =
    useNotes(token);

  const { sensors, activeNote, dndHandlers } = useKanbanDnd({
    notes,
    setNotes,
    onPersistMove: updateNotePosition,
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    note: null,
    defaultStatus: 'pending',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [notes, searchQuery, priorityFilter]);

  const openCreateModal = (defaultStatus = 'pending') =>
    setModalState({ isOpen: true, note: null, defaultStatus });

  const openEditModal = (note) =>
    setModalState({ isOpen: true, note, defaultStatus: note.status });

  const closeModal = () =>
    setModalState((prev) => ({ ...prev, isOpen: false }));

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Cargando tablero...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <BoardHeader
        onNewTask={() => openCreateModal('pending')}
        onLogout={logout}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por titulo o descripcion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-10 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'high', label: 'Alta' },
            { id: 'medium', label: 'Media' },
            { id: 'low', label: 'Baja' },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setPriorityFilter(filter.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${priorityFilter === filter.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        {...dndHandlers}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              notes={filteredNotes.filter((n) => n.status === col.id)}
              onDeleteNote={deleteNote}
              onEditNote={openEditModal}
              onAddNote={openCreateModal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeNote ? <TaskCard note={activeNote} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        note={modalState.note}
        defaultStatus={modalState.defaultStatus}
        onSave={saveNote}
        onDelete={deleteNote}
      />
    </div>
  );
}