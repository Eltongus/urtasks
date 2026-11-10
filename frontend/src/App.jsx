import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Tasks from './components/Tasks'

export default function App() {
  // undefined = todavía cargando la sesión
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession),
    )
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return <p className="center">Cargando...</p>
  if (!session) return <Auth />
  return <Tasks user={session.user} onLogout={() => supabase.auth.signOut()} />
}