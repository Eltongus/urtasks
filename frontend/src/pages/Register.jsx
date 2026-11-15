import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await register(email, password, fullName);
    if (error) alert(error.message);
    else {
      alert('Registro exitoso');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded flex flex-col gap-4 w-96">
        <h2 className="text-2xl font-bold">Crear Cuenta</h2>
        <input type="text" placeholder="Nombre completo" className="p-2 bg-gray-700 rounded" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <input type="email" placeholder="Correo" className="p-2 bg-gray-700 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="p-2 bg-gray-700 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="bg-green-600 p-2 rounded hover:bg-green-700">Registrarme</button>
        <Link to="/login" className="text-sm text-blue-400 text-center">Ya tengo cuenta</Link>
      </form>
    </div>
  );
}