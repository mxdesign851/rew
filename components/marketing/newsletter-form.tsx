'use client';

import { FormEvent, useState, useTransition } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const response = await fetch('/api/marketing/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true })
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || 'Unable to subscribe right now.');
        return;
      }

      setMessage('Subscribed. You will receive new growth playbooks soon.');
      setEmail('');
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        className="input h-11"
        type="email"
        placeholder="you@company.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" disabled={pending} className="btn btn-primary h-11 px-6 disabled:opacity-60">
        {pending ? 'Subscribing...' : 'Join newsletter'}
      </button>
      {message ? <p className="text-xs text-emerald-300 sm:basis-full">{message}</p> : null}
      {error ? <p className="text-xs text-rose-300 sm:basis-full">{error}</p> : null}
    </form>
  );
}
