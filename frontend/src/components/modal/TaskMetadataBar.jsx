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
        <div className="flex flex-wrap gap-5 pl-8">
            {currentPriority && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                        Prioridad
                    </span>
                    <button
                        type="button"
                        onClick={() => onToggleMenu('priority')}
                        className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-90 ${currentPriority.activeClass}`}
                    >
                        <Flag className="h-3 w-3" />
                        {currentPriority.label}
                    </button>
                </div>
            )}

            {tags.length > 0 && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                        Etiquetas
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {tags.map((tag) => {
                            const colorStyle = getTagColorClasses(tag.color);
                            return (
                                <span
                                    key={tag.id}
                                    className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold ${colorStyle.bg} ${colorStyle.text}`}
                                >
                                    {tag.name}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveTag(tag.id)}
                                        className="rounded-full p-0.5 hover:bg-black/15"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => onToggleMenu('tags')}
                            className="flex h-6 w-6 items-center justify-center rounded bg-slate-200/80 text-slate-600 transition-colors hover:bg-slate-300/80"
                            title="Añadir etiqueta"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {dueDate && (
                <div>
                    <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                        Fecha límite
                    </span>
                    <button
                        type="button"
                        onClick={() => onToggleMenu('date')}
                        className="inline-flex items-center gap-2 rounded bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300/80"
                    >
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{dueDate}</span>
                    </button>
                </div>
            )}
        </div>
    );
}