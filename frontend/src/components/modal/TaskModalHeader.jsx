import { CreditCard } from 'lucide-react';
import { STATUS_OPTIONS } from '../../constants/kanban';

export function TaskModalHeader({ title, onTitleChange, status, onStatusChange }) {
    return (
        <div className="mb-6 pr-8">
            <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <CreditCard className="h-5 w-5" />
                </div>
                <div className="w-full min-w-0">
                    <input
                        type="text"
                        autoFocus
                        required
                        placeholder="Título de la tarea..."
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="-ml-2 w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-xl font-bold tracking-tight text-slate-800 transition-colors placeholder:font-semibold placeholder:text-slate-400 hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                    />
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>en la lista</span>
                        <select
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="cursor-pointer rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-200/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}