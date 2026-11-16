import { useState, useEffect } from 'react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/kanban';
import { X, Trash2, Calendar, Layers, Flag, CheckSquare, Plus, Tag } from 'lucide-react';
import { TAG_COLORS, getTagColorClasses } from '../constants/kanban';

export function TaskModal({
    isOpen,
    onClose,
    note = null,
    defaultStatus = 'pending',
    onSave,
    onDelete,
}) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(defaultStatus);
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtaskText, setNewSubtaskText] = useState('');
    const [saving, setSaving] = useState(false);
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [selectedTagColor, setSelectedTagColor] = useState('indigo');

    useEffect(() => {
        if (isOpen) {
            if (note) {
                setTitle(note.title || '');
                setContent(note.content || '');
                setStatus(note.status || 'pending');
                setPriority(note.priority || 'medium');
                setDueDate(note.due_date ? note.due_date.split('T')[0] : '');
                setSubtasks(Array.isArray(note.subtasks) ? note.subtasks : []);
                setTags(Array.isArray(note.tags) ? note.tags : []);
            } else {
                setTitle('');
                setContent('');
                setStatus(defaultStatus);
                setPriority('medium');
                setDueDate('');
                setSubtasks([]);
                setTags([]);
            }
            setNewSubtaskText('');
            setNewTagName('');
            setSelectedTagColor('indigo');
        }
    }, [isOpen, note, defaultStatus]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleAddSubtask = () => {
        const trimmed = newSubtaskText.trim();
        if (!trimmed) return;

        const newItem = {
            id: crypto.randomUUID(),
            text: trimmed,
            completed: false,
        };

        setSubtasks((prev) => [...prev, newItem]);
        setNewSubtaskText('');
    };

    const handleSubtaskKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSubtask();
        }
    };

    const handleToggleSubtask = (subtaskId) => {
        setSubtasks((prev) =>
            prev.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
        );
    };

    const handleDeleteSubtask = (subtaskId) => {
        setSubtasks((prev) => prev.filter((st) => st.id !== subtaskId));
    };

    const completedCount = subtasks.filter((st) => st.completed).length;
    const progressPercent =
        subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || saving) return;

        setSaving(true);
        try {
            await onSave({
                id: note?.id,
                title: title.trim(),
                content: content.trim(),
                status,
                priority,
                due_date: dueDate || null,
                subtasks,
                tags
            });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleAddTag = () => {
        const trimmed = newTagName.trim();
        if (!trimmed) return;

        if (tags.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
            setNewTagName('');
            return;
        }

        setTags((prev) => [
            ...prev,
            { id: crypto.randomUUID(), name: trimmed, color: selectedTagColor },
        ]);
        setNewTagName('');
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagId) => {
        setTags((prev) => prev.filter((t) => t.id !== tagId));
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs transition-opacity"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Layers className="h-4 w-4 text-indigo-600" />
                        <span>{note ? 'Detalles de la tarea' : 'Nueva tarea'}</span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-200/70 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Título
                            </label>
                            <input
                                type="text"
                                autoFocus
                                required
                                placeholder="Ej. Diseñar arquitectura de base de datos"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Flag className="h-3.5 w-3.5" /> Prioridad
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {PRIORITY_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setPriority(opt.id)}
                                        className={`rounded-xl border py-2 text-sm font-medium transition-all ${priority === opt.id ? opt.activeClass : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <Tag className="h-3.5 w-3.5" /> Etiquetas
                            </label>

                            {/* Etiquetas asignadas */}
                            {tags.length > 0 && (
                                <div className="mb-2.5 flex flex-wrap gap-1.5">
                                    {tags.map((tag) => {
                                        const colorStyle = getTagColorClasses(tag.color);
                                        return (
                                            <span
                                                key={tag.id}
                                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${colorStyle.bg} ${colorStyle.text}`}
                                            >
                                                {tag.name}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag.id)}
                                                    className="rounded-full p-0.5 hover:bg-black/10"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Input + Paleta de colores */}
                            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 sm:flex-row sm:items-center">
                                <input
                                    type="text"
                                    placeholder="Nombre de etiqueta (ej. Backend)..."
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                                />

                                <div className="flex items-center justify-between gap-2">
                                    {/* Selector de puntos de color */}
                                    <div className="flex items-center gap-1.5 px-1">
                                        {TAG_COLORS.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setSelectedTagColor(c.id)}
                                                title={c.label}
                                                className={`h-5 w-5 rounded-full transition-transform ${c.dot} ${selectedTagColor === c.id ? 'scale-125 ring-2 ring-slate-400 ring-offset-1' : 'opacity-70 hover:opacity-100'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="inline-flex items-center gap-1 rounded-lg bg-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300/80"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Estado / Columna
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    <Calendar className="h-3.5 w-3.5" /> Fecha límite
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Descripción
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Añade detalles, enlaces o criterios de aceptación..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                            />
                        </div>

                        {/* Sección de Subtareas / Checklist */}
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                            <div className="mb-2.5 flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    <CheckSquare className="h-3.5 w-3.5 text-indigo-600" />
                                    Checklist ({completedCount}/{subtasks.length})
                                </label>
                                {subtasks.length > 0 && (
                                    <span className="text-xs font-semibold text-indigo-600">
                                        {progressPercent}%
                                    </span>
                                )}
                            </div>

                            {subtasks.length > 0 && (
                                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                                            }`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            )}

                            {subtasks.length > 0 && (
                                <ul className="mb-3 space-y-1.5">
                                    {subtasks.map((st) => (
                                        <li
                                            key={st.id}
                                            className="group flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-2xs ring-1 ring-slate-200/60"
                                        >
                                            <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                                                <input
                                                    type="checkbox"
                                                    checked={st.completed}
                                                    onChange={() => handleToggleSubtask(st.id)}
                                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span
                                                    className={`transition-colors ${st.completed
                                                        ? 'text-slate-400 line-through'
                                                        : 'text-slate-700'
                                                        }`}
                                                >
                                                    {st.text}
                                                </span>
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteSubtask(st.id)}
                                                className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                                                title="Quitar paso"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Añadir un paso y presionar Enter..."
                                    value={newSubtaskText}
                                    onChange={(e) => setNewSubtaskText(e.target.value)}
                                    onKeyDown={handleSubtaskKeyDown}
                                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    className="inline-flex items-center gap-1 rounded-lg bg-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-300/80"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Añadir
                                </button>
                            </div>
                        </div>

                        {note?.created_at && (
                            <div className="flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                    <span>Creada: {formatDate(note.created_at)}</span>
                                </div>
                                {note.updated_at && (
                                    <span>• Actualizada: {formatDate(note.updated_at)}</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        {note ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onDelete(note.id);
                                    onClose();
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : note ? 'Guardar cambios' : 'Crear tarea'}
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
}