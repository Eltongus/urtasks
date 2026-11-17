import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (error) alert(error.message);
    else navigate('/');
  };

     return (
    <div
      className="grid min-h-screen bg-white lg:grid-cols-2"
      style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');`}</style>

      {/* Panel de marca (solo en pantallas grandes) */}
      <aside
        className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">URTasks</span>
        </div>

        <div className="relative">
          <h1 className="max-w-md text-5xl leading-[1.05] font-extrabold tracking-tight text-white">
            Menos caos.
            <br />
            <span className="relative inline-block text-indigo-300">
              Más hecho.
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-indigo-400/40"
              />
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-slate-400">
            Planea, prioriza y termina tus tareas en un tablero pensado para ir al grano.
          </p>

          {/* Vista previa decorativa */}
          <div aria-hidden="true" className="mt-10 max-w-sm space-y-3">
            <div className="-rotate-1 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-300 ring-1 ring-rose-400/20">
                  Alta
                </span>
                <span className="text-[11px] font-medium text-slate-400">2/3 subtareas</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold text-white">Diseñar la pantalla de inicio</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-indigo-400" />
              </div>
            </div>

            <div className="ml-8 rotate-1 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-300 ring-1 ring-amber-400/20">
                  Media
                </span>
                <span className="text-[11px] font-medium text-slate-400">Vence mañana</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold text-white">Entregar informe del sprint</p>
            </div>

            <div className="ml-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm font-medium text-slate-400 line-through">Revisar comentarios del equipo</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          Tus tareas, siempre a la mano.
        </p>
      </aside>

      {/* Formulario */}
      <main className="flex flex-col justify-center bg-slate-50 px-4 py-12 sm:px-8 lg:bg-white">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo visible solo en móvil */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">URTasks</span>
          </div>

          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            Inicio de sesión
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Inicia sesión para gestionar tus tableros y tareas
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-800 shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-11 pl-10 text-sm text-slate-800 shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-500/30 focus-visible:outline-none"
            >
              <span>Entrar al espacio de trabajo</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            ¿Aún no tienes una cuenta?{' '}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-500 hover:underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}