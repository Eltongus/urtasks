import { Calendar, Flag, Plus, X } from 'lucide-react';
import { getTagColorClasses } from '../../constants/kanban';

export function TaskMetadataBar({
    currentPriority,
    tags,
    dueDate,
    onRemoveTag,
    onToggleMenu,
}) {
    if (!tags.length && !dueDate && !currentPriority) return null;

    return (
        <div className="flex flex-wrap gap-x-6 gap-y-4 pl-8">
            {currentPriority && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Prioridad
                    </span>
                    <button
                        type="button"
                        onClick={() => onToggleMenu('priority')}
                        className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold ring-1 ring-black/5 transition-all hover:brightness-95 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${currentPriority.activeClass}`}
                    >
                        <Flag className="h-3 w-3" />
                        {currentPriority.label}
                    </button>
                </div>
            )}

            {tags.length > 0 && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Etiquetas
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {tags.map((tag) => {
                            const colorStyle = getTagColorClasses(tag.color);
                            return (
                                <span
                                    key={tag.id}
                                    className={`inline-flex h-7 items-center gap-1 rounded-full pr-1 pl-3 text-xs font-semibold ring-1 ring-black/5 ${colorStyle.bg} ${colorStyle.text}`}
                                >
                                    {tag.name}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveTag(tag.id)}
                                        className="rounded-full p-1 transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                                        title="Quitar etiqueta"
                                        aria-label={`Quitar etiqueta ${tag.name}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => onToggleMenu('tags')}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                            title="Añadir etiqueta"
                            aria-label="Añadir etiqueta"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {dueDate && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                        Fecha límite
                    </span>
                    <button
                        type="button"
                        onClick={() => onToggleMenu('date')}
                        className="inline-flex h-7 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 tabular-nums shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                    >
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{dueDate}</span>
                    </button>
                </div>
            )}
        </div>
    );
}