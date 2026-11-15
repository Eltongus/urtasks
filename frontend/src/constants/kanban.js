export const KANBAN_COLUMNS = [
  { id: 'pending', title: 'Por hacer', color: 'bg-amber-400' },
  { id: 'in_progress', title: 'En progreso', color: 'bg-blue-500' },
  { id: 'completed', title: 'Completado', color: 'bg-emerald-500' },
];

export const STATUS_OPTIONS = [
    { id: 'pending', label: 'Por hacer' },
    { id: 'in_progress', label: 'En progreso' },
    { id: 'completed', label: 'Completado' },
];
export const PRIORITY_OPTIONS = [
    { id: 'low', label: 'Baja', activeClass: 'bg-slate-700 text-white border-slate-700' },
    { id: 'medium', label: 'Media', activeClass: 'bg-amber-500 text-white border-amber-500' },
    { id: 'high', label: 'Alta', activeClass: 'bg-rose-600 text-white border-rose-600' },
];