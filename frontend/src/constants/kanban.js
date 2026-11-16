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

export const TAG_COLORS = [
  { id: 'indigo', label: 'Índigo', bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { id: 'amber', label: 'Ámbar', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  { id: 'rose', label: 'Rosa', bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  { id: 'sky', label: 'Cielo', bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
  { id: 'purple', label: 'Púrpura', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
];

export const getTagColorClasses = (colorId) => {
  return TAG_COLORS.find((c) => c.id === colorId) || TAG_COLORS[0];
};