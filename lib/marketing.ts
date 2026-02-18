export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  publishedAt: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-agencies-scale-review-replies-with-ai',
    title: 'How agencies scale review replies with AI workflows',
    excerpt:
      'A practical blueprint for handling multiple client locations while keeping response quality and brand voice consistent.',
    readTime: '6 min read',
    category: 'Agency',
    publishedAt: '2026-02-18',
    content: [
      'Agency teams usually fail at review operations when replies are drafted in siloed tools and approvals are tracked in chats. A structured workflow is the unlock.',
      'Use one inbox where every review is tagged by source, sentiment, and location. Draft responses with AI, then enforce an approval gate for client-facing quality.',
      'The final multiplier is monthly usage and export visibility. Teams that can prove SLA speed, quality, and trend insights win renewals faster.'
    ]
  },
  {
    slug: 'brand-voice-system-for-multi-location-businesses',
    title: 'Building a brand voice system for multi-location businesses',
    excerpt:
      'Create one voice foundation, then apply location-level nuance without losing consistency or trust in customer communication.',
    readTime: '5 min read',
    category: 'Brand Voice',
    publishedAt: '2026-02-15',
    content: [
      'A single tone document is not enough when each location has different customer dynamics. You need layered voice controls.',
      'Start with workspace-level guidance: tone, do and do-not rules, and banned words. Then tune by location for context-specific language.',
      'With this approach, AI drafting remains fast while final replies still feel authentic and operationally aligned.'
    ]
  },
  {
    slug: 'review-ops-metrics-that-drive-revenue',
    title: 'Review ops metrics that actually drive revenue',
    excerpt:
      'Focus on the dashboards that impact trust and conversion, not vanity counts. Measure speed, quality, sentiment lift, and approval throughput.',
    readTime: '7 min read',
    category: 'Analytics',
    publishedAt: '2026-02-10',
    content: [
      'Most teams track total reviews and average rating, but ignore operational lag. Response speed and approval throughput are stronger indicators of future outcomes.',
      'Track sentiment distribution over time and connect top recurring tags to internal improvement tasks. This turns reviews into a product feedback pipeline.',
      'When leadership sees both quality controls and business impact in one dashboard, review operations move from support task to growth channel.'
    ]
  }
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
