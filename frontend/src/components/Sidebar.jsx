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
    <aside className="flex w-full flex-col justify-between border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
      <div className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-3 px-2 md:mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-600/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="text-lg font-bold tracking-tight text-slate-800">
              TaskBoard
            </span>
            <span className="block text-[11px] font-medium text-slate-400">
              Espacio personal
            </span>
          </div>
        </div>

        <nav
          aria-label="Vistas"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:mx-0 md:flex-col md:gap-1 md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
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
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectView(item.id)}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs ring-1 ring-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1/2 -left-px hidden h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 md:block" />
                )}
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 p-3 md:p-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 bg-white p-2.5 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-indigo-200 text-xs font-bold text-indigo-700 ring-2 ring-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-slate-800">
                {fullName}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-400" title={email}>
                {email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="shrink-0 rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500/30 focus-visible:outline-none"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}