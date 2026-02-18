import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export function LandingPageView() {
  const features = [
    {
      title: 'One inbox for all reviews',
      description: 'Keep Google, Facebook, Yelp, and Trustpilot replies in one queue with practical filters.'
    },
    {
      title: 'AI drafts with clear controls',
      description: 'Set provider, length, language, and escalation rules before generating each reply.'
    },
    {
      title: 'Approval workflow by role',
      description: 'Members draft, Admin and Owner approve, and every action is logged for accountability.'
    },
    {
      title: 'Analytics and exports',
      description: 'Track response quality and export CSV packs for weekly client reporting.'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$0',
      subtitle: 'For one location and quick validation',
      items: ['1 workspace', '1 location', '50 AI generations per month', 'Basic templates']
    },
    {
      name: 'Growth',
      price: '$49',
      subtitle: 'For local brands that need quality at speed',
      items: ['Up to 3 locations', '1,000 generations per month', 'Brand voice', 'Approval workflow']
    },
    {
      name: 'Scale',
      price: '$149',
      subtitle: 'For agencies running multi-client operations',
      items: ['Unlimited locations', '10,000 generations per month', 'Bulk workflows', 'Priority settings and exports']
    }
  ];

  const testimonials = [
    {
      quote: 'ReplyZen reduced our average response time from two days to under thirty minutes.',
      name: 'Irina M.',
      role: 'Agency Operator'
    },
    {
      quote: 'The approval workflow keeps every location consistent without slowing the team down.',
      name: 'Alex T.',
      role: 'Operations Lead'
    },
    {
      quote: 'Client reports are now one click instead of a manual weekly export process.',
      name: 'Radu P.',
      role: 'Founder'
    }
  ];

  const metrics = [
    ['+64%', 'faster drafting'],
    ['12k+', 'monthly AI replies'],
    ['92%', 'approval SLA'],
    ['4.8/5', 'quality score']
  ];

  return (
    <main className="landing-theme-dark min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 md:py-10">
        <div className="inline-flex items-center gap-3">
          <Logo withWordmark={false} size="lg" />
          <div className="leading-tight">
            <p className="text-lg font-semibold md:text-xl">ReplyZen</p>
            <p className="landing-muted text-[11px] uppercase tracking-[0.22em]">AI REVIEW REPLY MANAGER</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="#features" className="landing-nav-link">
            Features
          </Link>
          <Link href="#pricing" className="landing-nav-link">
            Pricing
          </Link>
          <Link href="#testimonials" className="landing-nav-link">
            Testimonials
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="btn btn-secondary">
            Sign in
          </Link>
          <Link href="/sign-up" className="btn btn-primary">
            Start free
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-14 pt-2 lg:grid-cols-[1fr_520px]">
        <div className="space-y-6">
          <span className="landing-chip">Built for serious review operations teams</span>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            Clean review replies at scale,
            <br />
            without messy workflows.
          </h1>
          <p className="landing-muted max-w-2xl text-lg leading-8">
            ReplyZen combines AI drafting, approval control, and reporting in one dark, focused workspace.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sign-up" className="btn btn-primary">
              Create free workspace
            </Link>
            <Link href="/sign-in" className="btn btn-secondary">
              Open demo login
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {metrics.map(([metric, description]) => (
              <div key={metric} className="landing-card p-7">
                <p className="text-4xl font-semibold">{metric}</p>
                <p className="landing-muted mt-2 text-sm uppercase tracking-[0.14em]">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-card overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <p className="landing-muted text-sm">Live inbox snapshot</p>
            <span className="landing-chip">Realtime</span>
          </div>
          <div className="p-6">
            <Image
              src="/screenshots/replyzen-inbox.svg"
              alt="ReplyZen inbox preview"
              width={960}
              height={680}
              className="h-auto w-full rounded-xl border border-slate-700/50"
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-semibold md:text-4xl">Everything you need to reply faster and cleaner</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="landing-card p-7">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="landing-muted mt-3 text-base leading-7">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">Simple pricing that scales with your team</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`landing-card p-8 md:p-9 ${plan.name === 'Growth' ? 'landing-card-highlight' : ''}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xl font-semibold">{plan.name}</p>
                {plan.name === 'Growth' ? (
                  <span className="landing-chip">Most popular</span>
                ) : null}
              </div>
              <p className="mt-2 text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="landing-muted mt-2 text-base">{plan.subtitle}</p>
              <ul className="mt-5 space-y-3 text-base">
                {plan.items.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
              <div className="mt-5">
                <Link href="/sign-up" className={`btn w-full ${plan.name === 'Starter' ? 'btn-secondary' : 'btn-primary'}`}>
                  Choose {plan.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="mx-auto w-full max-w-7xl px-6 py-8">
        <h2 className="text-3xl font-semibold md:text-4xl">What teams say after switching to ReplyZen</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="landing-card p-7">
              <p className="text-base leading-8">&quot;{item.quote}&quot;</p>
              <p className="mt-5 text-lg font-semibold">{item.name}</p>
              <p className="landing-muted text-xs uppercase tracking-wide">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="landing-card p-8 md:p-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold">Try the live demo accounts now</h2>
              <p className="landing-muted mt-2 text-base leading-7">
                Open the sign-in page and use the quick login buttons for instant demo access.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/sign-in" className="btn btn-primary">
                Go to sign in
              </Link>
              <Link href="/sign-up" className="btn btn-secondary">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-10 w-full max-w-7xl border-t px-6 py-8 text-sm">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-3">
              <Logo withWordmark={false} />
              <p className="text-base font-semibold">ReplyZen</p>
            </div>
            <p className="landing-muted mt-3 max-w-sm">
              ReplyZen helps teams transform customer reviews into consistent, on-brand replies that increase trust and
              retention.
            </p>
            <p className="landing-muted mt-3 text-xs">Support: hello@reply-zen.com</p>
          </div>
          <div>
            <p className="font-semibold">Product</p>
            <div className="mt-2 grid gap-2">
              <Link href="#features" className="landing-footer-link">
                Features
              </Link>
              <Link href="#pricing" className="landing-footer-link">
                Pricing
              </Link>
              <Link href="/sign-in" className="landing-footer-link">
                Sign in
              </Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Resources</p>
            <div className="mt-2 grid gap-2">
              <Link href="/sample-reviews.csv" className="landing-footer-link">
                CSV template
              </Link>
              <Link href="/http-examples.http" className="landing-footer-link">
                API examples
              </Link>
            </div>
          </div>
          <div>
            <p className="font-semibold">Legal</p>
            <div className="mt-2 grid gap-2">
              <Link href="/privacy" className="landing-footer-link">
                Privacy
              </Link>
              <Link href="/terms" className="landing-footer-link">
                Terms
              </Link>
            </div>
          </div>
        </div>
        <div className="landing-muted mt-8 border-t pt-4 text-xs">
          (c) {new Date().getFullYear()} ReplyZen. Built for modern review operations.
        </div>
      </footer>
    </main>
  );
}
