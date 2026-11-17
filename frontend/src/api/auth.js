import { supabase } from './supabase';

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