import { useMemo } from 'react';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Tag } from 'lucide-react';
import { getTagColorClasses } from '../constants/kanban';

export function StatsView({ notes }) {
  const stats = useMemo(() => {
    const total = notes.length;
    const completed = notes.filter((n) => n.status === 'completed').length;
    const inProgress = notes.filter((n) => n.status === 'in_progress').length;
    const pending = notes.filter((n) => n.status === 'pending').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = notes.filter((n) => {
      if (!n.due_date || n.status === 'completed') return false;
      const [y, m, d] = n.due_date.split('-').map(Number);
      return new Date(y, m - 1, d) < today;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Por prioridad
    const high = notes.filter((n) => n.priority === 'high').length;
    const medium = notes.filter((n) => n.priority === 'medium').length;
    const low = notes.filter((n) => n.priority === 'low').length;

    // Conteo de etiquetas
    const tagMap = {};
    notes.forEach((n) => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach((t) => {
          const key = t.name.toLowerCase();
          if (!tagMap[key]) {
            tagMap[key] = { name: t.name, color: t.color, count: 0 };
          }
          tagMap[key].count += 1;
        });
      }
    });
    const topTags = Object.values(tagMap).sort((a, b) => b.count - a.count);

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      completionRate,
      high,
      medium,
      low,
      topTags,
    };
  }, [notes]);

  const getPercent = (value) =>
    stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;

    return (
    <div className="mx-auto w-full max-w-7xl p-4 pb-10 sm:p-6 sm:pb-10 lg:p-8 lg:pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Estadísticas</h1>
        <p className="text-sm text-slate-500">
          Resumen del rendimiento y distribución de tus tareas
        </p>
      </header>

      {/* Tarjetas KPI principales */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total de tareas</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 ring-1 ring-indigo-100">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-slate-800 tabular-nums">
            {stats.total}
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Completadas</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 ring-1 ring-emerald-100">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-end gap-2.5">
            <p className="text-4xl font-bold tracking-tight text-slate-800 tabular-nums">
              {stats.completed}
            </p>
            <span className="mb-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 tabular-nums">
              {stats.completionRate}%
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-md">
          <div className="absolute inset-x-0 top-0 h-1 bg-blue-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">En progreso</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 ring-1 ring-blue-100">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-slate-800 tabular-nums">
            {stats.inProgress}
          </p>
        </div>

        <div
          className={`group relative overflow-hidden rounded-2xl border p-5 shadow-xs transition-shadow hover:shadow-md ${
            stats.overdue > 0 ? 'border-rose-200 bg-rose-50/60' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-rose-500" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Caducadas</span>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 ring-1 ring-rose-100">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-4xl font-bold tracking-tight text-rose-600 tabular-nums">
            {stats.overdue}
          </p>
        </div>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Anillo de avance */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-800">Avance general</h2>
          <p className="text-xs text-slate-500">Porcentaje de tareas completadas</p>

          <div className="flex flex-1 items-center justify-center py-6">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="10"
                  className="stroke-slate-100"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="stroke-emerald-500 transition-all duration-700"
                  strokeDasharray={`${((Number(stats.completionRate) || 0) / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tight text-slate-800 tabular-nums">
                  {stats.completionRate}%
                </span>
                <span className="text-[11px] font-medium text-slate-500">completado</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            {stats.completed} de {stats.total} tareas terminadas
          </p>
        </div>

        {/* Distribución por Estado */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-800">Progreso por estado</h2>
          <p className="mb-6 text-xs text-slate-500">Dónde está cada tarea ahora</p>
          <div className="space-y-5">
            {[
              { label: 'Por hacer', count: stats.pending, color: 'bg-amber-400' },
              { label: 'En progreso', count: stats.inProgress, color: 'bg-blue-500' },
              { label: 'Completado', count: stats.completed, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-500 tabular-nums">
                    {item.count}
                    <span className="ml-1.5 text-xs font-medium text-slate-400">
                      {getPercent(item.count)}%
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${getPercent(item.count)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución por Prioridad */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-800">Carga por prioridad</h2>
          <p className="mb-6 text-xs text-slate-500">Qué tan urgente es tu trabajo</p>
          <div className="space-y-5">
            {[
              { label: 'Prioridad alta', count: stats.high, color: 'bg-rose-500' },
              { label: 'Prioridad media', count: stats.medium, color: 'bg-amber-500' },
              { label: 'Prioridad baja', count: stats.low, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-700">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                  <span className="font-semibold text-slate-500 tabular-nums">
                    {item.count}
                    <span className="ml-1.5 text-xs font-medium text-slate-400">
                      {getPercent(item.count)}%
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                    style={{ width: `${getPercent(item.count)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uso de Etiquetas */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <span className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
            <Tag className="h-4 w-4" />
          </span>
          Etiquetas más utilizadas
        </h2>
        {stats.topTags.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
            <p className="text-sm text-slate-400">
              Aún no has asignado etiquetas a tus tareas.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {stats.topTags.map((tag) => {
              const colorStyle = getTagColorClasses(tag.color);
              return (
                <div
                  key={tag.name}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${colorStyle.bg} ${colorStyle.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colorStyle.dot}`} />
                  <span>{tag.name}</span>
                  <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold tabular-nums">
                    {tag.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}