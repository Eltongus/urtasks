const supabaseUrl = 'https://xbghodxsnbriofdqcjcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiZ2hvZHhzbmJyaW9mZHFjamNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQxNjk5MTksImV4cCI6MjEwOTc0NTkxOX0.g8ZTxF2xkkjN0ExG4Yys23oSlZ8RR4gkaabVPuDEMno';
export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js';

export const handleLogin = async (e, email, password) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert('Error al iniciar sesión: ' + error.message);
  };

export const handleSignUp = async (e) => {
    e.preventDefault();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      alert('Error al registrar: ' + error.message);
    } else {
      alert('¡Registro exitoso! Ya puedes iniciar sesión.');
      setIsRegistering(false);
    }
  };

export const handleLogout = async () => {
    await supabase.auth.signOut();
  };