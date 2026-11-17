import { useState } from 'react';
import { CheckSquare, X } from 'lucide-react';

export function TaskChecklist({
    subtasks,
    onChange,
    isAdding,
    setIsAdding,
}) {
    const [newSubtaskText, setNewSubtaskText] = useState('');
    const [showCompleted, setShowCompleted] = useState(true);

    const completedCount = subtasks.filter((st) => st.completed).length;
    const progressPercent =
        subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

    const visibleSubtasks = showCompleted
        ? subtasks
        : subtasks.filter((st) => !st.completed);

    const handleAdd = () => {
        const trimmed = newSubtaskText.trim();
        if (!trimmed) return;

        onChange([
            ...subtasks,
            { id: crypto.randomUUID(), text: trimmed, completed: false },
        ]);
        setNewSubtaskText('');
    };

    const handleToggle = (id) => {
        onChange(
            subtasks.map((st) =>
                st.id === id ? { ...st, completed: !st.completed } : st
            )
        );
    };

    const handleDelete = (id) => {
        onChange(subtasks.filter((st) => st.id !== id));
    };

     return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 shrink-0 text-slate-500" />
                    <h3 className="text-base font-bold tracking-tight text-slate-800">Checklist</h3>
                    {subtasks.length > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 tabular-nums">
                            {completedCount}/{subtasks.length}
                        </span>
                    )}
                </div>

                {completedCount > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                    >
                        {showCompleted
                            ? 'Ocultar completados'
                            : `Mostrar completados (${completedCount})`}
                    </button>
                )}
            </div>

            {subtasks.length > 0 && (
                <div className="mb-4 flex items-center gap-3">
                    <span className="w-8 text-right text-[11px] font-bold text-slate-500 tabular-nums">
                        {progressPercent}%
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200/60 ring-inset">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="pl-8">
                {visibleSubtasks.length > 0 && (
                    <ul className="mb-3 space-y-1">
                        {visibleSubtasks.map((st) => (
                            <li
                                key={st.id}
                                className="group -ml-2 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-slate-50"
                            >
                                <label className="flex flex-1 cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() => handleToggle(st.id)}
                                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
                                    />
                                    <span
                                        className={`transition-colors ${
                                            st.completed
                                                ? 'text-slate-400 line-through'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        {st.text}
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(st.id)}
                                    className="rounded-md p-1 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none"
                                    title="Quitar paso"
                                    aria-label="Quitar paso"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {!isAdding ? (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                    >
                        + Añadir un elemento
                    </button>
                ) : (
                    <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                        <input
                            type="text"
                            autoFocus
                            placeholder="Añadir un elemento..."
                            value={newSubtaskText}
                            onChange={(e) => setNewSubtaskText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAdd();
                                }
                            }}
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-xs placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="h-8 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/25 focus-visible:outline-none"
                            >
                                Añadir
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewSubtaskText('');
                                }}
                                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200/70 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                                aria-label="Cancelar"
                                title="Cancelar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}