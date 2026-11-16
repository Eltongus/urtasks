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
            <div className="mb-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <CheckSquare className="h-5 w-5 shrink-0 text-slate-700" />
                    <h3 className="text-base font-bold text-slate-800">Checklist</h3>
                </div>

                {completedCount > 0 && (
                    <button
                        type="button"
                        onClick={() => setShowCompleted(!showCompleted)}
                        className="rounded bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                    >
                        {showCompleted
                            ? 'Ocultar completados'
                            : `Mostrar completados (${completedCount})`}
                    </button>
                )}
            </div>

            {subtasks.length > 0 && (
                <div className="mb-3 flex items-center gap-3">
                    <span className="w-8 text-right text-[11px] font-medium text-slate-500">
                        {progressPercent}%
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${
                                progressPercent === 100 ? 'bg-emerald-500' : 'bg-sky-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="pl-8">
                {visibleSubtasks.length > 0 && (
                    <ul className="mb-3 space-y-1.5">
                        {visibleSubtasks.map((st) => (
                            <li
                                key={st.id}
                                className="group -ml-2 flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-slate-200/60"
                            >
                                <label className="flex flex-1 cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={st.completed}
                                        onChange={() => handleToggle(st.id)}
                                        className="h-4 w-4 rounded border-slate-300 accent-sky-600 focus:ring-sky-600"
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
                                    className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-300/70 hover:text-red-600 group-hover:opacity-100"
                                    title="Quitar paso"
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
                        className="rounded bg-slate-200/80 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                    >
                        Añadir un elemento
                    </button>
                ) : (
                    <div className="space-y-2">
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
                            className="w-full rounded-md border border-sky-600 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
                            >
                                Añadir
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewSubtaskText('');
                                }}
                                className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
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