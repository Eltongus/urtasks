import { useState, useEffect } from 'react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../constants/kanban';
import { X, Trash2, Calendar, Flag, CheckSquare, Plus, Tag, CreditCard, AlignLeft, Clock, Check } from 'lucide-react';
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
    const [showCompleted, setShowCompleted] = useState(true);
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [activeSidebarMenu, setActiveSidebarMenu] = useState(null);

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

    // Asegúrate de tener estos estados locales extra para replicar la UX de la imagen:
    // const [showCompleted, setShowCompleted] = useState(true);
    // const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    // const [activeSidebarMenu, setActiveSidebarMenu] = useState(null); // 'tags' | 'priority' | 'date' | null

    const visibleSubtasks = showCompleted
        ? subtasks
        : subtasks.filter((st) => !st.completed);

    const currentStatusLabel =
        STATUS_OPTIONS.find((opt) => opt.id === status)?.label || status;

    const currentPriority = PRIORITY_OPTIONS.find((opt) => opt.id === priority);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-10 backdrop-blur-xs transition-opacity sm:pt-16"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-3xl rounded-xl bg-[#f4f5f7] p-6 text-slate-800 shadow-2xl sm:p-7"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón cerrar superior derecho */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>

                <form onSubmit={handleSubmit}>
                    {/* ENCABEZADO DE TARJETA: Icono + Título grande + "en la lista..." */}
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
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-md bg-transparent px-1.5 py-0.5 -ml-1.5 text-xl font-bold text-slate-800 placeholder:font-semibold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
                                />
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                                    <span>en la lista</span>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
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

                    {/* CUERPO PRINCIPAL EN 2 COLUMNAS */}
                    <div className="flex flex-col gap-6 md:flex-row">
                        {/* COLUMNA IZQUIERDA (Contenido principal) */}
                        <div className="flex-1 space-y-6">
                            {/* METADATOS ACTIVOS (Prioridad, Etiquetas y Fecha límite) */}
                            {(tags.length > 0 || dueDate || currentPriority) && (
                                <div className="flex flex-wrap gap-5 pl-8">
                                    {/* Prioridad actual */}
                                    {currentPriority && (
                                        <div>
                                            <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                                Prioridad
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveSidebarMenu(
                                                        activeSidebarMenu === 'priority' ? null : 'priority'
                                                    )
                                                }
                                                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-opacity hover:opacity-90 ${currentPriority.activeClass}`}
                                            >
                                                <Flag className="h-3 w-3" />
                                                {currentPriority.label}
                                            </button>
                                        </div>
                                    )}

                                    {/* Etiquetas asignadas */}
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
                                                                onClick={() => handleRemoveTag(tag.id)}
                                                                className="rounded-full p-0.5 hover:bg-black/15"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveSidebarMenu(
                                                            activeSidebarMenu === 'tags' ? null : 'tags'
                                                        )
                                                    }
                                                    className="flex h-6 w-6 items-center justify-center rounded bg-slate-200/80 text-slate-600 transition-colors hover:bg-slate-300/80"
                                                    title="Añadir etiqueta"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Fecha límite */}
                                    {dueDate && (
                                        <div>
                                            <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                                Fecha límite
                                            </span>
                                            <div className="inline-flex items-center gap-2 rounded bg-slate-200/80 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                                <span>{dueDate}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SECCIÓN DESCRIPCIÓN */}
                            <div>
                                <div className="mb-2.5 flex items-center gap-3">
                                    <AlignLeft className="h-5 w-5 shrink-0 text-slate-700" />
                                    <h3 className="text-base font-bold text-slate-800">
                                        Descripción
                                    </h3>
                                </div>
                                <div className="pl-8">
                                    <textarea
                                        rows={3}
                                        placeholder="Añade una descripción más detallada..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full resize-none rounded-md bg-slate-200/70 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 transition-colors hover:bg-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* SECCIÓN CHECKLIST */}
                            <div>
                                <div className="mb-2.5 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <CheckSquare className="h-5 w-5 shrink-0 text-slate-700" />
                                        <h3 className="text-base font-bold text-slate-800">
                                            Checklist
                                        </h3>
                                    </div>

                                    {subtasks.length > 0 && (
                                        <div className="flex items-center gap-1.5">
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
                                    )}
                                </div>

                                {/* Barra de progreso con porcentaje a la izquierda */}
                                {subtasks.length > 0 && (
                                    <div className="mb-3 flex items-center gap-3">
                                        <span className="w-8 text-right text-[11px] font-medium text-slate-500">
                                            {progressPercent}%
                                        </span>
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className={`h-full rounded-full transition-all duration-300 ${progressPercent === 100
                                                        ? 'bg-emerald-500'
                                                        : 'bg-sky-600'
                                                    }`}
                                                style={{ width: `${progressPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Lista de subtareas */}
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
                                                            onChange={() => handleToggleSubtask(st.id)}
                                                            className="h-4 w-4 rounded border-slate-300 accent-sky-600 focus:ring-sky-600"
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
                                                        className="rounded p-1 text-slate-400 opacity-0 transition-opacity hover:bg-slate-300/70 hover:text-red-600 group-hover:opacity-100"
                                                        title="Quitar paso"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Botón "Añadir un elemento" o formulario desplegado */}
                                    {!isAddingSubtask ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingSubtask(true)}
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
                                                onKeyDown={handleSubtaskKeyDown}
                                                className="w-full rounded-md border border-sky-600 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddSubtask}
                                                    className="rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700"
                                                >
                                                    Añadir
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddingSubtask(false);
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

                            {/* METADATOS DE AUDITORÍA (si la nota ya existe) */}
                            {note?.created_at && (
                                <div className="pl-8 pt-2 text-xs text-slate-400">
                                    <p>Creada: {formatDate(note.created_at)}</p>
                                    {note.updated_at && (
                                        <p>Actualizada: {formatDate(note.updated_at)}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* COLUMNA DERECHA (Barra lateral de herramientas estilo Trello) */}
                        <aside className="w-full shrink-0 space-y-5 md:w-48">
                            <div>
                                <span className="mb-2 block text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                    Añadir a la tarjeta
                                </span>
                                <div className="space-y-2">
                                    {/* Botón + Panel Etiquetas */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveSidebarMenu(
                                                    activeSidebarMenu === 'tags' ? null : 'tags'
                                                )
                                            }
                                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                                        >
                                            <Tag className="h-3.5 w-3.5 text-slate-600" />
                                            <span>Etiquetas</span>
                                        </button>

                                        {activeSidebarMenu === 'tags' && (
                                            <div className="mt-1.5 space-y-2 rounded-lg border border-slate-200 bg-white p-2.5 shadow-md">
                                                <input
                                                    type="text"
                                                    placeholder="Nombre etiqueta..."
                                                    value={newTagName}
                                                    onChange={(e) => setNewTagName(e.target.value)}
                                                    onKeyDown={handleTagKeyDown}
                                                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-sky-600 focus:outline-none"
                                                />
                                                <div className="flex flex-wrap gap-1.5">
                                                    {TAG_COLORS.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => setSelectedTagColor(c.id)}
                                                            title={c.label}
                                                            className={`h-4 w-4 rounded-full transition-transform ${c.dot} ${selectedTagColor === c.id
                                                                    ? 'scale-125 ring-2 ring-slate-400 ring-offset-1'
                                                                    : 'opacity-75 hover:opacity-100'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleAddTag}
                                                    className="w-full rounded bg-sky-600 py-1 text-xs font-semibold text-white hover:bg-sky-700"
                                                >
                                                    Añadir etiqueta
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón + Panel Prioridad */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveSidebarMenu(
                                                    activeSidebarMenu === 'priority' ? null : 'priority'
                                                )
                                            }
                                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                                        >
                                            <Flag className="h-3.5 w-3.5 text-slate-600" />
                                            <span>Prioridad</span>
                                        </button>

                                        {activeSidebarMenu === 'priority' && (
                                            <div className="mt-1.5 space-y-1 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
                                                {PRIORITY_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setPriority(opt.id);
                                                            setActiveSidebarMenu(null);
                                                        }}
                                                        className={`flex w-full items-center justify-between rounded px-2 py-1 text-xs font-medium transition-colors ${priority === opt.id
                                                                ? opt.activeClass
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                            }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {priority === opt.id && (
                                                            <Check className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Botón Checklist (enfoca/abre añadir subtarea) */}
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingSubtask(true)}
                                        className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                                    >
                                        <CheckSquare className="h-3.5 w-3.5 text-slate-600" />
                                        <span>Checklist</span>
                                    </button>

                                    {/* Botón + Panel Fecha límite */}
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveSidebarMenu(
                                                    activeSidebarMenu === 'date' ? null : 'date'
                                                )
                                            }
                                            className="flex w-full items-center gap-2.5 rounded bg-slate-200/80 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300/80"
                                        >
                                            <Clock className="h-3.5 w-3.5 text-slate-600" />
                                            <span>Fecha límite</span>
                                        </button>

                                        {activeSidebarMenu === 'date' && (
                                            <div className="mt-1.5 rounded-lg border border-slate-200 bg-white p-2 shadow-md">
                                                <input
                                                    type="date"
                                                    value={dueDate}
                                                    onChange={(e) => setDueDate(e.target.value)}
                                                    className="w-full rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-sky-600 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* SECCIÓN ACCIONES */}
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
                                        {saving
                                            ? 'Guardando...'
                                            : note
                                                ? 'Guardar cambios'
                                                : 'Crear tarea'}
                                    </button>

                                    {note && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onDelete(note.id);
                                                onClose();
                                            }}
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
                    </div>
                </form>
            </div>
        </div>
    );

}