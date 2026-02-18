import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/marketing';
import { Logo } from '@/components/logo';

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/blog" className="btn btn-secondary">
            All posts
          </Link>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>
      </header>

      <article className="mt-10 card p-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="badge">{post.category}</span>
          <span>{post.readTime}</span>
          <span>{post.publishedAt}</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight">{post.title}</h1>
        <p className="mt-3 text-slate-300">{post.excerpt}</p>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-200">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
