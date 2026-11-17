import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Calendar, AlertCircle, CheckSquare } from 'lucide-react';
import { getTagColorClasses } from '../constants/kanban';

export function TaskCard({ note, onDelete, onEdit, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      type: 'Note',
      note,
    },
  });

  const tags = Array.isArray(note.tags) ? note.tags : [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 rounded-xl border-2 border-dashed border-indigo-400 bg-indigo-50/50 opacity-50"
      />
    );
  }

  const PRIORITY_STYLES = {
    low: { label: 'Baja', classes: 'bg-slate-100 text-slate-600' },
    medium: { label: 'Media', classes: 'bg-amber-50 text-amber-700 border border-amber-200/60' },
    high: { label: 'Alta', classes: 'bg-rose-50 text-rose-700 border border-rose-200/60' },
  };

  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    const due = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isCompleted = note.status === 'completed';
    return {
      formatted: due.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }),
      isOverdue: !isCompleted && due < today,
      isToday: !isCompleted && due.getTime() === today.getTime(),
    };
  };

  const priorityConfig = PRIORITY_STYLES[note.priority] || PRIORITY_STYLES.medium;
  const dateInfo = getDueDateInfo(note.due_date);

  const subtasks = Array.isArray(note.subtasks) ? note.subtasks : [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((st) => st.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

   return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => !isOverlay && onEdit?.(note)}
      className={`group relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md ${isOverlay ? 'rotate-2 scale-105 cursor-grabbing shadow-xl ring-2 ring-indigo-500' : ''
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 cursor-grab touch-none rounded-md p-1 text-slate-300 transition-colors group-hover:text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
            title="Arrastrar tarea"
            aria-label="Arrastrar tarea"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <h3 className="min-w-0 truncate text-[15px] leading-snug font-semibold text-slate-800">
            {note.title}
          </h3>
        </div>

        {!isOverlay && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="shrink-0 rounded-md p-1 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            title="Eliminar tarea"
            aria-label="Eliminar tarea"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {note.content && (
        <p className="pl-7 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {note.content}
        </p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-7">
          {tags.map((tag) => {
            const colorStyle = getTagColorClasses(tag.color);
            return (
              <span
                key={tag.id || tag.name}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colorStyle.bg} ${colorStyle.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${colorStyle.dot}`} />
                {tag.name}
              </span>
            );
          })}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="pl-7">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
              <CheckSquare className={`h-3.5 w-3.5 ${progressPercent === 100 ? 'text-emerald-500' : 'text-slate-400'}`} />
              Subtareas
            </span>
            <span className={`font-semibold tabular-nums ${progressPercent === 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pl-7">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityConfig.classes}`}>
            {priorityConfig.label}
          </span>

          {dateInfo && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${dateInfo.isOverdue
                ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                : dateInfo.isToday
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                  : 'bg-slate-50 text-slate-500 ring-1 ring-slate-200/70'
                }`}
            >
              {dateInfo.isOverdue ? <AlertCircle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
              {dateInfo.formatted}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}