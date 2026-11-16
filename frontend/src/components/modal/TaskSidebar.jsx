import { useState } from 'react';
import { Tag, Flag, CheckSquare, Clock, Trash2, Check } from 'lucide-react';
import { PRIORITY_OPTIONS, TAG_COLORS } from '../../constants/kanban';

export function TaskSidebar({
    activeMenu,
    onToggleMenu,
    tags,
    onAddTag,
    priority,
    onSelectPriority,
    dueDate,
    onChangeDueDate,
    onOpenChecklist,
    isEditing,
    saving,
    onDelete,
    onClose,
}) {
    const [newTagName, setNewTagName] = useState('');
    const [selectedTagColor, setSelectedTagColor] = useState('indigo');

    const handleCreateTag = () => {
        const trimmed = newTagName.trim();
        if (!trimmed) return;
        if (!tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
            onAddTag({ id: crypto.randomUUID(), name: trimmed, color: selectedTagColor });
        }
        setNewTagName('');
    };

    return (
        <aside className="w-full shrink-0 space-y-5 md:w-48">
            <div>
                <span className="mb-2 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    Añadir a la tarjeta
                </span>
                <div className="space-y-2">
                    {/* Etiquetas */}
                    <div>
                        <button
                            type="button"
                            onClick={() => onToggleMenu('tags')}
                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                        >
                            <Tag className="h-3.5 w-3.5 text-slate-600" />
                            <span>Etiquetas</span>
                        </button>

                        {activeMenu === 'tags' && (
                            <div className="mt-1.5 space-y-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-md">
                                <input
                                    type="text"
                                    placeholder="Nombre etiqueta..."
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreateTag();
                                        }
                                    }}
                                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-sky-600 focus:outline-none"
                                />
                                <div className="flex flex-wrap gap-1.5">
                                    {TAG_COLORS.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedTagColor(c.id)}
                                            title={c.label}
                                            className={`h-4 w-4 rounded-full transition-transform ${c.dot} ${
                                                selectedTagColor === c.id
                                                    ? 'scale-125 ring-2 ring-slate-400 ring-offset-1'
                                                    : 'opacity-75 hover:opacity-100'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    className="w-full rounded bg-sky-600 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                                >
                                    Añadir etiqueta
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Prioridad */}
                    <div>
                        <button
                            type="button"
                            onClick={() => onToggleMenu('priority')}
                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                        >
                            <Flag className="h-3.5 w-3.5 text-slate-600" />
                            <span>Prioridad</span>
                        </button>

                        {activeMenu === 'priority' && (
                            <div className="mt-1.5 space-y-1 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectPriority(opt.id);
                                            onToggleMenu(null);
                                        }}
                                        className={`flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium transition-colors ${
                                            priority === opt.id
                                                ? opt.activeClass
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span>{opt.label}</span>
                                        {priority === opt.id && <Check className="h-3.5 w-3.5" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Checklist */}
                    <button
                        type="button"
                        onClick={onOpenChecklist}
                        className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                    >
                        <CheckSquare className="h-3.5 w-3.5 text-slate-600" />
                        <span>Checklist</span>
                    </button>

                    {/* Fecha límite */}
                    <div>
                        <button
                            type="button"
                            onClick={() => onToggleMenu('date')}
                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                        >
                            <Clock className="h-3.5 w-3.5 text-slate-600" />
                            <span>Fecha límite</span>
                        </button>

                        {activeMenu === 'date' && (
                            <div className="mt-1.5 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => onChangeDueDate(e.target.value)}
                                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-sky-600 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div>
                <span className="mb-2 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                    Acciones
                </span>
                <div className="space-y-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-sky-700 disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Eliminar tarjeta</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-300/80"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </aside>
    );
}