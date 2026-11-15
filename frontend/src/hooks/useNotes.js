import { useState, useEffect, useCallback } from 'react';
import { notesService } from '../services/notes';

export function useNotes(token) {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        notesService
            .getAll(token)
            .then((data) => setNotes(data.sort((a, b) => a.position - b.position)))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [token]);

    const getNextPosition = useCallback(
        (status) => {
            const columnNotes = notes.filter((n) => n.status === status);
            const maxPos =
                columnNotes.length > 0
                    ? Math.max(...columnNotes.map((n) => n.position))
                    : 0;
            return maxPos + 1000;
        },
        [notes]
    );

    const saveNote = async ({ id, title, content, status, priority, due_date, subtasks = [] }) => {
        if (!id) {
            const created = await notesService.create(token, {
                title,
                content,
                status,
                priority,
                due_date,
                subtasks,
                position: getNextPosition(status),
            });
            setNotes((prev) => [...prev, created]);
            return;
        }

        const existing = notes.find((n) => n.id === id);
        const position =
            existing.status !== status ? getNextPosition(status) : existing.position;

        const updated = await notesService.update(token, id, {
            title,
            content,
            status,
            position,
            priority,
            due_date,
            subtasks,
        });

        setNotes((prev) =>
            prev
                .map((n) => (n.id === id ? updated : n))
                .sort((a, b) => a.position - b.position)
        );
    };

    const deleteNote = async (id) => {
        const backup = [...notes];
        setNotes((prev) => prev.filter((n) => n.id !== id));

        try {
            await notesService.remove(token, id);
        } catch {
            setNotes(backup);
        }
    };

    const updateNotePosition = async (id, status, position) => {
        const backup = [...notes];
        setNotes((prev) =>
            prev.map((n) => (n.id === id ? { ...n, position } : n))
        );

        try {
            await notesService.update(token, id, { status, position });
        } catch (err) {
            console.error(err);
            setNotes(backup);
        }
    };

    return {
        notes,
        setNotes,
        loading,
        saveNote,
        deleteNote,
        updateNotePosition,
    };
}