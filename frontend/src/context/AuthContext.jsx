import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const register = (email, password, full_name) => supabase.auth.signUp({ email, password, options: { data: { full_name } } });
  const logout = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ session, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);