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
import TaskFilters from './TaskFilters';

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
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const isNoteOverdue = (note) => {
    if (!note.due_date || note.status === 'completed') return false;
    const [year, month, day] = note.due_date.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  const overdueCount = useMemo(
    () => notes.filter(isNoteOverdue).length,
    [notes]
  );

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === 'all' || note.priority === priorityFilter;

      const matchesOverdue = !onlyOverdue || isNoteOverdue(note);

      return matchesSearch && matchesPriority && matchesOverdue;
    });
  }, [notes, searchQuery, priorityFilter, onlyOverdue]);

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

     <TaskFilters 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        priorityFilter={priorityFilter} 
        setPriorityFilter={setPriorityFilter} 
        onlyOverdue={onlyOverdue} 
        setOnlyOverdue={setOnlyOverdue} 
        overdueCount={overdueCount} 
      />

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