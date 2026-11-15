import { useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useKanbanDnd({ notes, setNotes, onPersistMove }) {
  const [activeNote, setActiveNote] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = ({ active }) => {
    if (active.data.current?.type === 'Note') {
      setActiveNote(active.data.current.note);
    }
  };

  const handleDragOver = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const isActiveANote = active.data.current?.type === 'Note';
    const isOverANote = over.data.current?.type === 'Note';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveANote) return;

    if (isOverANote) {
      setNotes((prev) => {
        const activeIndex = prev.findIndex((n) => n.id === active.id);
        const overIndex = prev.findIndex((n) => n.id === over.id);

        if (prev[activeIndex].status !== prev[overIndex].status) {
          const updated = [...prev];
          updated[activeIndex] = {
            ...updated[activeIndex],
            status: prev[overIndex].status,
          };
          return arrayMove(updated, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    if (isOverAColumn) {
      setNotes((prev) => {
        const activeIndex = prev.findIndex((n) => n.id === active.id);
        if (prev[activeIndex].status === over.id) return prev;

        const updated = [...prev];
        updated[activeIndex] = { ...updated[activeIndex], status: over.id };
        return arrayMove(updated, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveNote(null);
    if (!over) return;

    const movedNote = notes.find((n) => n.id === active.id);
    if (!movedNote) return;

    const columnNotes = notes.filter((n) => n.status === movedNote.status);
    const newIndex = columnNotes.findIndex((n) => n.id === active.id);

    const prevNote = columnNotes[newIndex - 1];
    const nextNote = columnNotes[newIndex + 1];

    let newPosition;
    if (!prevNote && !nextNote) newPosition = 1000;
    else if (!prevNote) newPosition = nextNote.position / 2;
    else if (!nextNote) newPosition = prevNote.position + 1000;
    else newPosition = (prevNote.position + nextNote.position) / 2;

    onPersistMove(active.id, movedNote.status, newPosition);
  };

  return {
    sensors,
    activeNote,
    dndHandlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
    },
  };
}