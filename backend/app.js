import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from '@supabase/supabase-js';
import { startReminderCron } from './services/reminderJob.js';
import { sendDueTasksEmail } from './services/emailService.js';

const app = express()

dotenv.config();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const verifyAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado porque no hay token' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Acceso invalido' });
  }

  req.user = user;
  next();
};

app.get("/api/health", async (req, res) => {
  res.send("holaaaaaaaaaaa")
})

// todo el crud de notas usando supabase

app.post('/api/notas', verifyAuth, async (req, res) => {
  const {
    title,
    content,
    status = 'pending',
    position = 1000,
    priority = 'medium',
    due_date = null,
    subtasks = [],
    tags = []
  } = req.body;

  const { data, error } = await supabase
    .from('notes')
    .insert([{
      user_id: req.user.id,
      title,
      content,
      status,
      position,
      priority,
      due_date,
      subtasks,
      tags
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});


app.get('/api/notas', verifyAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', req.user.id)
    .order('position', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/notas/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

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

// 1. Iniciar el cron job automático al arrancar el servidor
startReminderCron();

// 2. En tu PUT /api/notas/:id actual, si el usuario cambia due_date, reinicia reminder_sent:
app.put('/api/notas/:id', verifyAuth, async (req, res) => {
  const { id } = req.params;
  const updates = {
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  // Si actualizó la fecha límite, permitimos que vuelva a enviarse alerta en el futuro
  if (req.body.due_date) {
    updates.reminder_sent = false;
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 3. Endpoint para enviar recordatorio manual inmediato de una tarea
app.post('/api/notas/:id/remind', verifyAuth, async (req, res) => {
  const { id } = req.params;

  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !note) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const userName = req.user.user_metadata?.full_name || req.user.email.split('@')[0];

    await sendDueTasksEmail({
      to: req.user.email,
      userName,
      tasks: [{ ...note, due_date: note.due_date || 'Sin fecha límite' }],
      todayStr,
    });

    res.json({ message: 'Recordatorio enviado a tu correo' });
  } catch (err) {
    res.status(500).json({ error: 'No se pudo enviar el correo: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
