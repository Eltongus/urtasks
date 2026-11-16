import { LayoutDashboard, Calendar, BarChart3, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'board', label: 'Tablero Kanban', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
];

export function Sidebar({ activeView, onSelectView }) {
  const { session, logout } = useAuth();
  const user = session?.user;

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';
  const email = user?.email || '';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="flex w-full flex-col justify-between border-b border-slate-200 bg-white md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
      <div className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2.5 px-2 md:mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-800">
              TaskBoard
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              Espacio personal
            </span>
          </div>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:gap-1">
          <span className="mb-1.5 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:block">
            Vistas
          </span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 ring-2 ring-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {fullName}
              </p>
              <p className="truncate text-xs text-slate-400" title={email}>
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}