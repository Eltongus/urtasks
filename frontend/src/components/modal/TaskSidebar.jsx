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
        <aside className="w-full shrink-0 space-y-6 md:w-52">
            <div>
                <span className="mb-2.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Añadir a la tarjeta
                </span>
                <div className="space-y-2">
                    {/* Etiquetas */}
                    <div>
                        <button
                            type="button"
                            onClick={() => onToggleMenu('tags')}
                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${
                                activeMenu === 'tags'
                                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                            <Tag className="h-3.5 w-3.5 text-slate-500" />
                            <span>Etiquetas</span>
                        </button>

                        {activeMenu === 'tags' && (
                            <div className="mt-2 space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-900/5">
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
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {TAG_COLORS.map((c) => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setSelectedTagColor(c.id)}
                                            title={c.label}
                                            aria-label={c.label}
                                            className={`h-5 w-5 rounded-full transition-transform focus-visible:outline-none ${c.dot} ${
                                                selectedTagColor === c.id
                                                    ? 'scale-110 ring-2 ring-slate-400 ring-offset-2'
                                                    : 'opacity-70 hover:scale-105 hover:opacity-100'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCreateTag}
                                    className="h-9 w-full rounded-lg bg-indigo-600 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/25 focus-visible:outline-none"
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
                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${
                                activeMenu === 'priority'
                                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                            <Flag className="h-3.5 w-3.5 text-slate-500" />
                            <span>Prioridad</span>
                        </button>

                        {activeMenu === 'priority' && (
                            <div className="mt-2 space-y-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => {
                                            onSelectPriority(opt.id);
                                            onToggleMenu(null);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
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
                        className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                    >
                        <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
                        <span>Checklist</span>
                    </button>

                    {/* Fecha límite */}
                    <div>
                        <button
                            type="button"
                            onClick={() => onToggleMenu('date')}
                            className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${
                                activeMenu === 'date'
                                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                            }`}
                        >
                            <Clock className="h-3.5 w-3.5 text-slate-500" />
                            <span>Fecha límite</span>
                        </button>

                        {activeMenu === 'date' && (
                            <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg shadow-slate-900/5">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => onChangeDueDate(e.target.value)}
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-slate-200 pt-5">
                <span className="mb-2.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Acciones
                </span>
                <div className="space-y-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="h-10 w-full rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-700 focus-visible:ring-4 focus-visible:ring-indigo-500/25 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tarea'}
                    </button>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onDelete}
                            className="flex w-full items-center gap-2.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Eliminar tarjeta</span>
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </aside>
    );
}