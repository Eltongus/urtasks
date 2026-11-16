import { useState, useEffect } from 'react';
import { X, AlignLeft } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../../constants/kanban';
import { TaskModalHeader } from './TaskModalHeader';
import { TaskMetadataBar } from './TaskMetadataBar';
import { TaskChecklist } from './TaskChecklist'; 
import { TaskSidebar } from './TaskSidebar';

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
    const [tags, setTags] = useState([]);
    const [saving, setSaving] = useState(false);

    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [activeSidebarMenu, setActiveSidebarMenu] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        setTitle(note?.title || '');
        setContent(note?.content || '');
        setStatus(note?.status || defaultStatus);
        setPriority(note?.priority || 'medium');
        setDueDate(note?.due_date ? note.due_date.split('T')[0] : '');
        setSubtasks(Array.isArray(note?.subtasks) ? note.subtasks : []);
        setTags(Array.isArray(note?.tags) ? note.tags : []);
        setIsAddingSubtask(false);
        setActiveSidebarMenu(null);
    }, [isOpen, note, defaultStatus]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const toggleMenu = (menu) =>
        setActiveSidebarMenu((prev) => (prev === menu ? null : menu));

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
                tags,
            });
            onClose();
        } finally {
            setSaving(false);
        }
    };

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
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-200/80 hover:text-slate-800"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5" />
                </button>

                <form onSubmit={handleSubmit}>
                    <TaskModalHeader
                        title={title}
                        onTitleChange={setTitle}
                        status={status}
                        onStatusChange={setStatus}
                    />

                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex-1 space-y-6">
                            <TaskMetadataBar
                                currentPriority={currentPriority}
                                tags={tags}
                                dueDate={dueDate}
                                onRemoveTag={(id) => setTags((prev) => prev.filter((t) => t.id !== id))}
                                onToggleMenu={toggleMenu}
                            />

                            {/* Descripcion */}
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

                            <TaskChecklist
                                subtasks={subtasks}
                                onChange={setSubtasks}
                                isAdding={isAddingSubtask}
                                setIsAdding={setIsAddingSubtask}
                            />

                            {note?.created_at && (
                                <div className="pl-8 pt-2 text-xs text-slate-400">
                                    <p>Creada: {formatDate(note.created_at)}</p>
                                    {note.updated_at && (
                                        <p>Actualizada: {formatDate(note.updated_at)}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <TaskSidebar
                            activeMenu={activeSidebarMenu}
                            onToggleMenu={toggleMenu}
                            tags={tags}
                            onAddTag={(tag) => setTags((prev) => [...prev, tag])}
                            priority={priority}
                            onSelectPriority={setPriority}
                            dueDate={dueDate}
                            onChangeDueDate={setDueDate}
                            onOpenChecklist={() => setIsAddingSubtask(true)}
                            isEditing={Boolean(note)}
                            saving={saving}
                            onDelete={() => {
                                onDelete(note.id);
                                onClose();
                            }}
                            onClose={onClose}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}