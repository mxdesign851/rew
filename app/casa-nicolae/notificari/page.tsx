import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { Bell } from 'lucide-react';
import { MarkAllReadButton } from './mark-all-read';
import { NotificationItem } from './notification-item';

export default async function NotificariPage() {
  const notifications = await prisma.medicationNotification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Notificări</h1>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      <p className="text-sm text-slate-500">
        Notificările apar când stocul unui medicament este sub pragul minim. În
        viitor: notificări push pe telefon.
      </p>

      {notifications.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <Bell className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">Nicio notificare</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              id={n.id}
              message={n.message}
              createdAt={n.createdAt}
              isRead={n.isRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}
