'use client';

import { useRouter } from 'next/navigation';
import { Bell, Check } from 'lucide-react';

type Props = {
  id: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
};

export function NotificationItem({ id, message, createdAt, isRead }: Props) {
  const router = useRouter();

  async function handleMarkRead() {
    await fetch(`/api/casa-nicolae/notificari/${id}/read`, { method: 'POST' });
    router.refresh();
  }

  return (
    <div
      className={`card flex items-center gap-4 p-4 ${
        isRead ? 'opacity-70' : 'border-amber-700/30'
      }`}
    >
      <Bell
        className={`h-5 w-5 shrink-0 ${
          isRead ? 'text-slate-500' : 'text-amber-400'
        }`}
      />
      <div className="flex-1">
        <p className="text-slate-200">{message}</p>
        <p className="text-xs text-slate-500">
          {new Date(createdAt).toLocaleString('ro-RO')}
        </p>
      </div>
      {!isRead && (
        <button
          type="button"
          onClick={handleMarkRead}
          className="btn btn-secondary flex items-center gap-1 text-xs"
        >
          <Check className="h-3 w-3" />
          Citit
        </button>
      )}
    </div>
  );
}
