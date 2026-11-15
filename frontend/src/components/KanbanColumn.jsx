import { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';

export function KanbanColumn({ column, notes, onDeleteNote, onEditNote, onAddNote }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const noteIds = useMemo(() => notes.map((n) => n.id), [notes]);

  return (
    <div
      className={`flex h-[calc(100vh-10rem)] min-h-[500px] w-full flex-col rounded-2xl border transition-colors ${
        isOver
          ? 'border-indigo-400 bg-indigo-50/40'
          : 'border-slate-200/80 bg-slate-100/70'
      }`}
    >
      <header className="flex items-center justify-between border-b border-slate-200/60 p-4">
        <div className="flex items-center gap-2.5">
          <span className={`h-3 w-3 rounded-full ${column.color}`} />
          <h2 className="font-bold text-slate-700">{column.title}</h2>
        </div>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-xs">
          {notes.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-3"
      >
        <SortableContext items={noteIds} strategy={verticalListSortingStrategy}>
          {notes.map((note) => (
            <TaskCard
              key={note.id}
              note={note}
              onDelete={onDeleteNote}
              onEdit={onEditNote}
            />
          ))}
        </SortableContext>

        {notes.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
            Arrastra una tarea aquí
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/60 p-3">
        <button
          type="button"
          onClick={() => onAddNote(column.id)}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900"
        >
          <Plus className="h-4 w-4" />
          Agregar tarea
        </button>
      </div>
    </div>
  );
}