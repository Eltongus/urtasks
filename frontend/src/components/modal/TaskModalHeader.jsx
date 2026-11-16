import { CreditCard } from 'lucide-react';
import { STATUS_OPTIONS } from '../../constants/kanban';

export function TaskModalHeader({ title, onTitleChange, status, onStatusChange }) {
    return (
        <div className="mb-6 pr-8">
            <div className="flex items-start gap-3">
                <CreditCard className="mt-1.5 h-5 w-5 shrink-0 text-slate-700" />
                <div className="w-full">
                    <input
                        type="text"
                        autoFocus
                        required
                        placeholder="Título de la tarea..."
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="-ml-1.5 w-full rounded-md bg-transparent px-1.5 py-0.5 text-xl font-bold text-slate-800 placeholder:font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
                    />
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span>en la lista</span>
                        <select
                            value={status}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="cursor-pointer rounded bg-transparent font-medium text-slate-700 underline decoration-slate-400 underline-offset-2 hover:text-slate-900 focus:outline-none"
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