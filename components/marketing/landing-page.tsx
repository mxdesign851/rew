import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { NewsletterForm } from '@/components/marketing/newsletter-form';
import { BLOG_POSTS } from '@/lib/marketing';

export function LandingPageView() {
  const packages = [
    {
      name: 'Starter',
      price: '$0',
      subtitle: 'For first locations and quick validation',
      features: ['1 workspace', '1 location', '50 AI generations/month', 'Basic templates']
    },
    {
      name: 'Growth',
      price: '$49',
      subtitle: 'For local brands scaling response quality',
      features: ['Up to 3 locations', '1,000 generations/month', 'Brand voice', 'Approval workflow']
    },
    {
      name: 'Scale',
      price: '$149',
      subtitle: 'For agencies managing multi-client operations',
      features: ['Unlimited locations', '10,000 generations/month', 'Team roles + bulk tools', 'CSV exports + priority settings']
    }
  ];

  const featureCards = [
    {
      title: 'Unified inbox and filters',
      description: 'Filter by status, sentiment, tags, source, date, and rating from one clean queue.',
      image: '/screenshots/replyzen-inbox.svg'
    },
    {
      title: 'AI generation controls',
      description: 'Choose provider, length, language, and escalation rules for high quality response drafts.',
      image: '/screenshots/replyzen-workflow.svg'
    },
    {
      title: 'Brand voice system',
      description: 'Apply tone, examples, do and do-not lists, and banned terms at workspace and location level.',
      image: '/screenshots/replyzen-workflow.svg'
    },
    {
      title: 'Approval and compliance',
      description: 'Members draft, Admin and Owner approve, with full audit logs for every change.',
      image: '/screenshots/replyzen-workflow.svg'
    },
    {
      title: 'Analytics and exports',
      description: 'Track rating trends and export response packs for clients and internal teams.',
      image: '/screenshots/replyzen-analytics.svg'
    },
    {
      title: 'Billing and plan governance',
      description: 'Stripe and PayPal subscriptions with webhook sync and plan-limit enforcement.',
      image: '/screenshots/replyzen-analytics.svg'
    }
  ];

  const testimonials = [
    {
      quote: 'ReplyZen cut our response time from two days to twenty minutes.',
      name: 'Irina M.',
      role: 'Agency Operator'
    },
    {
      quote: 'The approval flow finally stopped inconsistent tone across our 12 locations.',
      name: 'Alex T.',
      role: 'Operations Lead'
    },
    {
      quote: 'The export flow made client reporting a one-click weekly routine.',
      name: 'Radu P.',
      role: 'Founder'
    }
  ];

  const statCards = [
    ['+64%', 'Faster draft turnaround'],
    ['12,000+', 'Replies generated monthly'],
    ['92%', 'Approval SLA hit rate'],
    ['4.8/5', 'Average quality score']
  ];

  return (
    <main className="landing-theme min-h-screen">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
        <Logo size="lg" />
        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          <Link href="#features" className="landing-nav-link">
            Features
          </Link>
          <Link href="#packages" className="landing-nav-link">
            Packages
          </Link>
          <Link href="#pricing" className="landing-nav-link">
            Pricing
          </Link>
          <Link href="#testimonials" className="landing-nav-link">
            Testimonials
          </Link>
          <Link href="#blog" className="landing-nav-link">
            Blog
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

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-20 pt-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <span className="landing-chip">Built for agencies and multi-location operators</span>
          <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-[4.8rem]">
            Reply faster.
            <br />
            Stay consistent.
            <br />
            Grow reputation.
          </h1>
          <p className="landing-muted max-w-2xl text-xl leading-8">
            ReplyZen turns review management into a high-conversion workflow with AI drafting, approvals, analytics, and clean
            exports.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/sign-up" className="btn btn-primary">
              Create free workspace
            </Link>
            <Link href="/app" className="btn btn-secondary">
              Open live demo
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map(([metric, description]) => (
              <div key={metric} className="landing-card p-6">
                <p className="text-4xl font-semibold">{metric}</p>
                <p className="landing-muted mt-2 text-sm uppercase tracking-wide">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-card overflow-hidden">
          <div className="flex items-center justify-between border-b p-5">
            <p className="landing-muted text-sm">Inbox snapshot</p>
            <span className="landing-chip">Live</span>
          </div>
          <div className="p-5">
            <Image
              src="/screenshots/replyzen-inbox.svg"
              alt="ReplyZen inbox preview"
              width={960}
              height={680}
              className="h-auto w-full rounded-xl border"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-2">
        <div className="landing-card p-6">
          <p className="landing-muted text-center text-xs uppercase tracking-[0.16em]">
            Trusted workflow model: manual imports first, API connectors next
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-semibold md:text-5xl">Powerful sections your operations team will actually use</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="landing-card p-6">
              <Image
                src={feature.image}
                alt={`${feature.title} preview`}
                width={720}
                height={420}
                className="h-auto w-full rounded-lg border"
              />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="landing-muted mt-3 text-base leading-7">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="packages" className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="landing-card p-8">
          <h2 className="text-3xl font-semibold md:text-4xl">Functional packs for every business stage</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ['Operations Pack', 'Inbox filtering, source imports, and AI-assisted reply drafting controls.'],
              ['Quality Pack', 'Brand voice consistency, role-based approvals, and audit visibility.'],
              ['Growth Pack', 'Analytics trends, exports, and subscription-ready team scale controls.']
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border p-6">
                <p className="text-lg font-semibold">{title}</p>
                <p className="landing-muted mt-3 text-base leading-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-7xl px-6 py-14">
        <h2 className="text-3xl font-semibold md:text-4xl">Packages built to convert and scale</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {packages.map((plan) => (
            <article
              key={plan.name}
              className={`landing-card p-8 ${plan.name === 'Growth' ? 'landing-card-highlight' : ''}`}
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
              <ul className="mt-5 space-y-3 text-base text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <div className="mt-5">
                <Link href="/sign-up" className={`btn w-full ${plan.name === 'Free' ? 'btn-secondary' : 'btn-primary'}`}>
                  Choose {plan.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="mx-auto w-full max-w-7xl px-6 py-8">
        <h2 className="text-3xl font-semibold md:text-4xl">Testimonials from operators and founders</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="landing-card p-7">
              <p className="text-base leading-8 text-slate-200">&quot;{item.quote}&quot;</p>
              <p className="mt-5 text-lg font-semibold">{item.name}</p>
              <p className="landing-muted text-xs uppercase tracking-wide">{item.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="blog" className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Latest blog insights</h2>
            <p className="mt-1 text-sm text-slate-400">
              Playbooks for AI review operations, agency workflows, and growth metrics.
            </p>
          </div>
          <Link href="/blog" className="btn btn-secondary">
            View all posts
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="landing-card p-6">
              <div className="flex items-center justify-between">
                <span className="landing-chip">{post.category}</span>
                <span className="landing-muted text-xs">{post.readTime}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{post.title}</h3>
              <p className="landing-muted mt-3 text-base leading-7">{post.excerpt}</p>
              <div className="mt-5">
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-blue-300">
                  Read article {'->'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="landing-card p-8">
          <h2 className="text-3xl font-semibold">Get growth tactics every week</h2>
          <p className="landing-muted mt-3 max-w-2xl text-base leading-7">
            Join the ReplyZen newsletter for new conversion playbooks, review response templates, and AI workflow
            optimization ideas.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-10 w-full max-w-7xl border-t px-6 py-8 text-sm">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo />
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
              <Link href="/blog" className="landing-footer-link">
                Blog
              </Link>
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
