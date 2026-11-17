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
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Estadísticas</h1>
        <p className="text-sm text-slate-500">
          Resumen del rendimiento y distribución de tus tareas
        </p>
      </header>

      {/* Tarjetas KPI principales */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Total Tareas</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <ListTodo className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Completadas</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-800">{stats.completed}</p>
            <span className="text-xs font-semibold text-emerald-600">
              ({stats.completionRate}%)
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">En Progreso</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-800">{stats.inProgress}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Caducadas</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-rose-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Gráficas de barras de progreso */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Distribución por Estado */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h2 className="mb-5 text-base font-bold text-slate-800">
            Progreso por Estado
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Por hacer', count: stats.pending, color: 'bg-amber-400' },
              { label: 'En progreso', count: stats.inProgress, color: 'bg-blue-500' },
              { label: 'Completado', count: stats.completed, color: 'bg-emerald-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-500">
                    {item.count} ({getPercent(item.count)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <h2 className="mb-5 text-base font-bold text-slate-800">
            Carga por Prioridad
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Prioridad Alta', count: stats.high, color: 'bg-rose-500' },
              { label: 'Prioridad Media', count: stats.medium, color: 'bg-amber-500' },
              { label: 'Prioridad Baja', count: stats.low, color: 'bg-slate-400' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-500">
                    {item.count} ({getPercent(item.count)}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
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
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
          <Tag className="h-4 w-4 text-indigo-600" />
          Etiquetas más utilizadas
        </h2>
        {stats.topTags.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no has asignado etiquetas a tus tareas.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {stats.topTags.map((tag) => {
              const colorStyle = getTagColorClasses(tag.color);
              return (
                <div
                  key={tag.name}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold ${colorStyle.bg} ${colorStyle.text}`}
                >
                  <span className={`h-2 w-2 rounded-full ${colorStyle.dot}`} />
                  <span>{tag.name}</span>
                  <span className="rounded-md bg-white/60 px-2 py-0.5 text-xs font-bold">
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