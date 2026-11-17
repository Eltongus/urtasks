import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { sendDueTasksEmail } from '../services/emailService.js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const processDailyReminders = async () => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Buscar tareas no completadas que venzan hoy o mañana y no hayan sido notificadas
    const { data: notes, error } = await supabaseAdmin
      .from('notes')
      .select('id, user_id, title, content, priority, due_date')
      .neq('status', 'completed')
      .eq('reminder_sent', false)
      .gte('due_date', todayStr)
      .lte('due_date', tomorrowStr);

    if (error) throw error;
    if (!notes || notes.length === 0) {
      console.log('[Cron] No hay tareas próximas a vencer.');
      return { sent: 0 };
    }

    // Agrupar por usuario
    const groupedByUser = notes.reduce((acc, note) => {
      if (!acc[note.user_id]) acc[note.user_id] = [];
      acc[note.user_id].push(note);
      return acc;
    }, {});

    let emailsSent = 0;

    for (const [userId, userNotes] of Object.entries(groupedByUser)) {
      const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (userErr || !userData?.user?.email) continue;

      const email = userData.user.email;
      const userName = userData.user.user_metadata?.full_name || email.split('@')[0];

      await sendDueTasksEmail({
        to: email,
        userName,
        tasks: userNotes,
        todayStr,
      });

      // Marcar como notificadas
      const noteIds = userNotes.map((n) => n.id);
      await supabaseAdmin
        .from('notes')
        .update({ reminder_sent: true })
        .in('id', noteIds);

      emailsSent++;
    }

    console.log(`[Cron] Recordatorios enviados: ${emailsSent}`);
    return { sent: emailsSent };
  } catch (err) {
    console.error('[Cron] Error procesando recordatorios:', err);
    throw err;
  }
};

export const startReminderCron = () => {
  cron.schedule(
    '0 8 * * *',
    () => {
      console.log('[Cron] Ejecutando revisión diaria de tareas...');
      processDailyReminders();
    },
    { timezone: 'America/Bogota' }
  );
};