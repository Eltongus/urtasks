import { Search, X, AlertCircle, Filter, Tag } from 'lucide-react';


export default function TaskFilters({ searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, onlyOverdue, setOnlyOverdue, overdueCount, availableTags, tagFilter, setTagFilter }) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por título o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-9 pl-10 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative flex items-center">
                    <Filter className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="cursor-pointer rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-8 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                    >
                        <option value="all">Prioridad: Todas</option>
                        <option value="high">Prioridad: Alta</option>
                        <option value="medium">Prioridad: Media</option>
                        <option value="low">Prioridad: Baja</option>
                    </select>
                </div>

                {availableTags.length > 0 && (
                    <div className="relative flex items-center">
                        <Tag className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
                        <select
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className="cursor-pointer rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-8 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-indigo-500 focus:outline-none"
                        >
                            <option value="all">Etiqueta: Todas</option>
                            {availableTags.map((t) => (
                                <option key={t.name} value={t.name}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setOnlyOverdue((prev) => !prev)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${onlyOverdue
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                        : overdueCount > 0
                            ? 'border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100/80'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    <AlertCircle className="h-4 w-4" />
                    <span>Caducadas</span>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${onlyOverdue
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
        </div>
    )
}