import { Plus, LogOut } from 'lucide-react';

export function BoardHeader({ onNewTask, onLogout }) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mi Tablero</h1>
        <p className="text-sm text-slate-500">
          Haz clic en una tarjeta para ver detalles o arrástrala para cambiar su estado
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onNewTask}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Nueva tarea
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>
    </header>
  );
}