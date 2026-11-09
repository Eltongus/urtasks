import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from '@supabase/supabase-js';

const app = express()

dotenv.config();

app.use(cors())
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' });
  }

  req.user = user;
  next();
};

// todo el crud de notas usando supabase

app.post('/api/notas', verifyAuth, async (req, res) => {
  const { title, content, status = 'pending' } = req.body;

  const { data, error } = await supabase
    .from('notes')
    .insert([{ user_id: req.user.id, title, content, status }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

app.get('/api/notas', verifyAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/notas/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});
 
app.delete('/api/notas/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Nota eliminada correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
