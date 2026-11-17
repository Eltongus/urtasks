import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Cambia esto cuando verifiques un dominio propio en Resend
const FROM_EMAIL = 'UrTasks <alertas@urtasks.xyz>';

export const sendDueTasksEmail = async ({ to, userName, tasks, todayStr }) => {
  const tasksHtml = tasks
    .map((task) => {
      const isToday = task.due_date === todayStr;
      const priorityColors = {
        high: { bg: '#ffe4e6', text: '#be123c', label: 'Alta' },
        medium: { bg: '#fef3c7', text: '#b45309', label: 'Media' },
        low: { bg: '#f1f5f9', text: '#475569', label: 'Baja' },
      };
      const p = priorityColors[task.priority] || priorityColors.medium;

      return `
        <div style="margin-bottom: 12px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
          <div style="font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
            ${task.title}
          </div>
          ${task.content ? `<p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">${task.content}</p>` : ''}
          <div>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background-color: ${p.bg}; color: ${p.text};">
              Prioridad ${p.label}
            </span>
            <span style="font-size: 12px; color: #64748b; margin-left: 8px;">
              📅 Vence: <strong>${isToday ? 'Hoy' : 'Mañana'} (${task.due_date})</strong>
            </span>
          </div>
        </div>
      `;
    })
    .join('');

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `⏰ Recordatorio: Tienes ${tasks.length} tarea(s) próxima(s) a vencer`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
        <h2 style="color: #4f46e5; margin-top: 0;">Hola, ${userName} 👋</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.5;">
          Estas tareas en tu tablero están próximas a vencer y aún siguen pendientes:
        </p>
        <div style="margin: 20px 0;">
          ${tasksHtml}
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px;">
          Enviado automáticamente por TaskBoard
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};