import { Search, X, AlertCircle, Filter, Tag } from 'lucide-react';


export default function TaskFilters({ searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, onlyOverdue, setOnlyOverdue, overdueCount, availableTags, tagFilter, setTagFilter }) {
        return (
        <section
            aria-label="Filtros del tablero"
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:p-4"
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        aria-label="Buscar tareas"
                        placeholder="Buscar por título o descripción..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-10 text-sm text-slate-800 transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            aria-label="Borrar búsqueda"
                            onClick={() => setSearchQuery('')}
                            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    aria-pressed={onlyOverdue}
                    onClick={() => setOnlyOverdue((prev) => !prev)}
                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all focus-visible:ring-4 focus-visible:ring-rose-500/15 focus-visible:outline-none ${onlyOverdue
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs hover:bg-rose-700'
                        : overdueCount > 0
                            ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <AlertCircle className="h-4 w-4" />
                    <span>Caducadas</span>
                    <span
                        className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-bold ${onlyOverdue
                            ? 'bg-white/20 text-white'
                            : overdueCount > 0
                                ? 'bg-rose-200/80 text-rose-800'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                    >
                        {overdueCount}
                    </span>
                </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <Filter className="h-3.5 w-3.5" />
                        Prioridad
                    </span>
                    <div role="group" aria-label="Filtrar por prioridad" className="inline-flex rounded-xl bg-slate-100 p-1">
                        <button
                            type="button"
                            aria-pressed={priorityFilter === 'all'}
                            onClick={() => setPriorityFilter('all')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${priorityFilter === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Todas
                        </button>
                        <button
                            type="button"
                            aria-pressed={priorityFilter === 'high'}
                            onClick={() => setPriorityFilter('high')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${priorityFilter === 'high' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="h-2 w-2 rounded-full bg-rose-500" />
                            Alta
                        </button>
                        <button
                            type="button"
                            aria-pressed={priorityFilter === 'medium'}
                            onClick={() => setPriorityFilter('medium')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${priorityFilter === 'medium' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="h-2 w-2 rounded-full bg-amber-500" />
                            Media
                        </button>
                        <button
                            type="button"
                            aria-pressed={priorityFilter === 'low'}
                            onClick={() => setPriorityFilter('low')}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${priorityFilter === 'low' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            Baja
                        </button>
                    </div>
                </div>

                {availableTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            <Tag className="h-3.5 w-3.5" />
                            Etiquetas
                        </span>
                        <div role="group" aria-label="Filtrar por etiqueta" className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                aria-pressed={tagFilter === 'all'}
                                onClick={() => setTagFilter('all')}
                                className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${tagFilter === 'all' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                                Todas
                            </button>
                            {availableTags.map((t) => (
                                <button
                                    key={t.name}
                                    type="button"
                                    aria-pressed={tagFilter === t.name}
                                    onClick={() => setTagFilter(t.name)}
                                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${tagFilter === t.name ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}