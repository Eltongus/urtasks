import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { Sidebar } from './Sidebar';
import { KanbanBoard } from './KanbanBoard';
import { CalendarView } from '../pages/Calendar';
// import { StatsView } from '../pages/Stats';
import { TaskModal } from './modal/TaskModal';
import { CheckCircle2 } from 'lucide-react';


export function DashboardLayout() {
    const { session } = useAuth();
    const token = session?.access_token;

    const { notes, setNotes, loading, saveNote, deleteNote, updateNotePosition } =
        useNotes(token);

    const [activeView, setActiveView] = useState('board');
    const [modalState, setModalState] = useState({
        isOpen: false,
        note: null,
        defaultStatus: 'pending',
    });

    const openCreateModal = (statusOrEvent = 'pending') => {
        const defaultStatus = typeof statusOrEvent === 'string' ? statusOrEvent : 'pending';
        setModalState({ isOpen: true, note: null, defaultStatus });
    };

    const openEditModal = (note) =>
        setModalState({ isOpen: true, note, defaultStatus: note.status });

    const closeModal = () =>
        setModalState((prev) => ({ ...prev, isOpen: false }));

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-4">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-20 w-20 animate-ping rounded-full bg-indigo-400/15" />
                    <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
                    <div className="absolute flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs ring-1 ring-slate-200/70">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                </div>

                <h2 className="mt-6 text-base font-semibold tracking-tight text-slate-800">
                    Cargando espacio de trabajo
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                    Sincronizando tus tareas...
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
            <Sidebar activeView={activeView} onSelectView={setActiveView} />

            <main className="flex-1 overflow-y-auto">
                {activeView === 'board' && (
                    <KanbanBoard
                        notes={notes}
                        setNotes={setNotes}
                        loading={loading}
                        saveNote={saveNote}
                        deleteNote={deleteNote}
                        updateNotePosition={updateNotePosition}
                        onNewTask={openCreateModal}
                        onEditTask={openEditModal}
                    />
                )}

                {activeView === 'calendar' && (
                    <CalendarView
                        notes={notes}
                        onEditNote={openEditModal}
                        onNewTask={openCreateModal}
                    />
                )}

                {/* {activeView === 'stats' && <StatsView notes={notes} />}*/}
            </main>

            <TaskModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                note={modalState.note}
                defaultStatus={modalState.defaultStatus}
                onSave={saveNote}
                onDelete={deleteNote}
            />
        </div>
    );
}