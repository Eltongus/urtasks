import { useMemo, useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Check, X } from 'lucide-react';
import { TaskCard } from './TaskCard';

export function KanbanColumn({ column, notes, onDeleteNote, onEditNote, onQuickCreate }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const [isAdding, setIsAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleQuickSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onQuickCreate({
        title: trimmed,
        status: column.id,
        priority: 'medium',
        content: '',
        tags: [],
        subtasks: [],
      });
      setQuickTitle('');
      setIsAdding(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleQuickSubmit();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setQuickTitle('');
    }
  };

  const noteIds = useMemo(() => notes.map((n) => n.id), [notes]);

  return (
    <div
      className={`flex h-[calc(100vh-18rem)] min-h-[480px] w-full flex-col rounded-2xl border shadow-xs transition-all ${
        isOver
          ? 'border-indigo-400 bg-indigo-50/50 ring-4 ring-indigo-500/10'
          : 'border-slate-200 bg-slate-100/70'
      }`}
    >
      <div className={`mx-5 h-1 rounded-b-full ${column.color}`} />

      <header className="flex items-center justify-between px-4 pt-3 pb-3">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ring-4 ring-white ${column.color}`} />
          <h2 className="text-sm font-bold tracking-wide text-slate-700">{column.title}</h2>
        </div>
        <span className="min-w-7 rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-semibold text-slate-600 tabular-nums shadow-xs ring-1 ring-slate-200/70">
          {notes.length}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3 [scrollbar-width:thin]"
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

        {notes.length === 0 && !isAdding && (
          <div
            className={`flex flex-1 items-center justify-center rounded-xl border-2 border-dashed p-4 text-center text-sm font-medium transition-colors ${
              isOver
                ? 'border-indigo-300 bg-indigo-50 text-indigo-500'
                : 'border-slate-300/70 bg-white/40 text-slate-400'
            }`}
          >
            Arrastra una tarea aquí
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/70 p-3">
        {isAdding ? (
          <form
            onSubmit={handleQuickSubmit}
            className="rounded-xl border border-indigo-300 bg-white p-2 shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Título de la tarea... (Enter)"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="w-full bg-transparent px-2 py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setQuickTitle('');
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!quickTitle.trim() || isSubmitting}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                <Check className="h-3.5 w-3.5" />
                {isSubmitting ? 'Guardando...' : 'Crear'}
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-500 transition-all hover:border-indigo-300 hover:bg-white hover:text-indigo-600 hover:shadow-xs focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" />
            Agregar tarea
          </button>
        )}
      </div>
    </div>
  );
}