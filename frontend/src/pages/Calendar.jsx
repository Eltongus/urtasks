import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { DAYS_OF_WEEK, MONTH_NAMES, PRIORITY_BADGE } from '../constants/calendar';

export function CalendarView({ notes, onEditNote, onNewTask }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, dateStr });
    }
    return cells;
  }, [year, month]);

  const notesByDate = useMemo(() => {
    const map = {};
    notes.forEach((note) => {
      if (!note.due_date) return;
      const key = note.due_date.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(note);
    });
    return map;
  }, [notes]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Calendario</h1>
          <p className="text-sm text-slate-500">
            Visualiza tus tareas según su fecha límite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
              title="Mes anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[140px] text-center text-sm font-bold text-slate-800">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100"
              title="Mes siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleToday}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hoy
          </button>

          <button
            type="button"
            onClick={() => onNewTask('pending')}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Nueva tarea
          </button>
        </div>
      </header>

      {/* Cuadrícula del Calendario */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {/* Encabezado días de la semana */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {DAYS_OF_WEEK.map((dayName) => (
            <div
              key={dayName}
              className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Celdas de los días */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {calendarDays.map((cell, index) => {
            if (!cell) {
              return <div key={`empty-${index}`} className="min-h-[120px] bg-slate-50/40" />;
            }

            const dayNotes = notesByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === todayStr;

            return (
              <div
                key={cell.dateStr}
                className={`flex min-h-[120px] flex-col p-2 transition-colors ${
                  isToday ? 'bg-indigo-50/30' : 'hover:bg-slate-50/60'
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>

                {/* Lista de tareas del día */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto">
                  {dayNotes.map((note) => {
                    const isCompleted = note.status === 'completed';
                    const badgeStyle = isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 line-through opacity-75'
                      : PRIORITY_BADGE[note.priority] || PRIORITY_BADGE.medium;

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => onEditNote(note)}
                        className={`w-full truncate rounded-md border px-2 py-1 text-left text-[11px] font-medium transition-transform hover:scale-[1.01] ${badgeStyle}`}
                        title={note.title}
                      >
                        {note.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <CalendarIcon className="h-3.5 w-3.5" />
        <span>
          Solo se muestran en el calendario las tareas que tienen una fecha limite asignada
        </span>
      </div>
    </div>
  );
}