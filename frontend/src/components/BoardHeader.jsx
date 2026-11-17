import { Plus } from 'lucide-react';

export function BoardHeader({ onNewTask }) {
        return (
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">Mi Tablero</h1>
                <p className="mt-0.5 max-w-xl text-sm text-slate-500">
                    Haz clic en una tarjeta para ver detalles o arrástrala para cambiar su estado
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onNewTask}
                    className="group inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/25 focus-visible:outline-none"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    Nueva tarea
                </button>
            </div>
        </header>
    );
}