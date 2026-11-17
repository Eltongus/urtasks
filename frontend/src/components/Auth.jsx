import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (!data.session) setInfo('Cuenta creada. Revisa tu correo para confirmarla.')
    }

    setLoading(false)
  }

      return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12"
      style={{
        fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');`}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-indigo-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-sm font-extrabold tracking-tight text-white shadow-lg shadow-indigo-500/30">
            UR
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">URTASKS</h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl shadow-black/40 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-indigo-600 uppercase">
            {mode === 'login' ? 'Inicio de sesión' : 'Registro'}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              autoComplete="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
            />
            <input
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Contraseña (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-xs transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition-colors hover:bg-indigo-600 focus-visible:ring-4 focus-visible:ring-indigo-500/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
            </button>
          </form>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {error}
            </p>
          )}
          {info && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            >
              {info}
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="rounded-md text-sm font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-500 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:outline-none"
            >
              {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}