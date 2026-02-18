'use client';

import { useRouter } from 'next/navigation';

export function MarkAllReadButton() {
  const router = useRouter();

  async function handleClick() {
    await fetch('/api/casa-nicolae/notificari/read-all', { method: 'POST' });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn btn-secondary text-sm"
    >
      Marchează toate ca citite
    </button>
  );
}
