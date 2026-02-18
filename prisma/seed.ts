import { PrismaClient, Plan, ReviewSource, Role, Sentiment } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.reviewAuditLog.deleteMany();
  await prisma.replyGeneration.deleteMany();
  await prisma.review.deleteMany();
  await prisma.brandVoice.deleteMany();
  await prisma.sourceConnection.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.location.deleteMany();
  await prisma.workspaceMembership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  const owner = await prisma.user.create({
    data: {
      email: 'owner@example.com',
      name: 'Demo Owner',
      hashedPassword: defaultPasswordHash
    }
  });

  const member = await prisma.user.create({
    data: {
      email: 'member@example.com',
      name: 'Demo Member',
      hashedPassword: defaultPasswordHash
    }
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@reply-zen.com',
      name: 'Super Admin',
      hashedPassword: defaultPasswordHash,
      isSuperAdmin: true
    }
  });

  const premiumOwner = await prisma.user.create({
    data: {
      email: 'premium@reply-zen.com',
      name: 'Premium Demo Owner',
      hashedPassword: defaultPasswordHash
    }
  });

  const premiumMember = await prisma.user.create({
    data: {
      email: 'premium-member@reply-zen.com',
      name: 'Premium Demo Member',
      hashedPassword: defaultPasswordHash
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'ReviewPilot Demo Workspace',
      plan: Plan.PRO,
      monthBucket: `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`,
      aiGenerationsUsed: 12,
      memberships: {
        create: [
          { userId: owner.id, role: Role.OWNER },
          { userId: member.id, role: Role.MEMBER }
        ]
      },
      locations: {
        create: [
          { name: 'Downtown Store', timezone: 'America/New_York' },
          { name: 'Airport Branch', timezone: 'America/Chicago' }
        ]
      },
      brandVoice: {
        create: {
          tone: 'WARM',
          doList: ['Thank the customer', 'Mention a specific detail'],
          dontList: ['Do not blame the customer', 'Avoid legal promises'],
          examples: ['Thanks for sharing your feedback - we appreciate your visit.'],
          bannedWords: ['cheap', 'fault'],
          signOff: '- The ReviewPilot Team'
        }
      },
      sources: {
        createMany: {
          data: [
            { provider: ReviewSource.GOOGLE, displayName: 'Google Reviews', status: 'MANUAL' },
            { provider: ReviewSource.FACEBOOK, displayName: 'Facebook Reviews', status: 'MANUAL' },
            { provider: ReviewSource.YELP, displayName: 'Yelp Reviews', status: 'MANUAL' },
            { provider: ReviewSource.TRUSTPILOT, displayName: 'Trustpilot Reviews', status: 'MANUAL' }
          ]
        }
      }
    },
    include: { locations: true }
  });

  await prisma.subscription.create({
    data: {
      workspaceId: workspace.id,
      provider: 'STRIPE',
      status: 'ACTIVE',
      plan: 'PRO',
      externalId: 'sub_demo_123',
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      metadata: { customerId: 'cus_demo_123' }
    }
  });

  const premiumWorkspace = await prisma.workspace.create({
    data: {
      name: 'ReviewPilot Premium Demo',
      plan: Plan.AGENCY,
      monthBucket: `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}`,
      aiGenerationsUsed: 384,
      memberships: {
        create: [
          { userId: premiumOwner.id, role: Role.OWNER },
          { userId: premiumMember.id, role: Role.MEMBER },
          { userId: superAdmin.id, role: Role.ADMIN }
        ]
      },
      locations: {
        create: [
          { name: 'Central City Hub', timezone: 'Europe/Bucharest' },
          { name: 'North Retail Point', timezone: 'Europe/Bucharest' },
          { name: 'West Flagship', timezone: 'Europe/Bucharest' }
        ]
      },
      brandVoice: {
        create: {
          tone: 'PROFESSIONAL',
          doList: ['Open with appreciation', 'Address issue directly', 'Offer a practical next step'],
          dontList: ['Do not blame customer', 'Do not overpromise'],
          examples: ['Thanks for the detailed review - we appreciate your feedback.'],
          bannedWords: ['cheap', 'fault', 'impossible'],
          signOff: '- ReviewPilot Premium Team'
        }
      },
      sources: {
        createMany: {
          data: [
            { provider: ReviewSource.GOOGLE, displayName: 'Google Reviews', status: 'MANUAL' },
            { provider: ReviewSource.FACEBOOK, displayName: 'Facebook Reviews', status: 'MANUAL' },
            { provider: ReviewSource.YELP, displayName: 'Yelp Reviews', status: 'MANUAL' },
            { provider: ReviewSource.TRUSTPILOT, displayName: 'Trustpilot Reviews', status: 'MANUAL' }
          ]
        }
      }
    },
    include: { locations: true }
  });

  await prisma.subscription.create({
    data: {
      workspaceId: premiumWorkspace.id,
      provider: 'PAYPAL',
      status: 'ACTIVE',
      plan: 'AGENCY',
      externalId: 'sub_premium_demo_456',
      currentPeriodEnd: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      metadata: { planId: 'agency-demo-plan' }
    }
  });

  const [downtown, airport] = workspace.locations;

  const review1 = await prisma.review.create({
    data: {
      workspaceId: workspace.id,
      locationId: downtown.id,
      source: ReviewSource.GOOGLE,
      authorName: 'Jane D.',
      rating: 2,
      text: 'Service was slow and part of the order was missing.',
      reviewDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sentiment: Sentiment.NEG,
      tags: ['slow-service', 'order-accuracy'],
      status: 'DRAFTED',
      replyDraft: 'Thank you for your feedback and we are truly sorry for the delay and missing item...',
      draftedById: member.id,
      draftedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  const review2 = await prisma.review.create({
    data: {
      workspaceId: workspace.id,
      locationId: airport.id,
      source: ReviewSource.FACEBOOK,
      authorName: 'Mark R.',
      rating: 5,
      text: 'Great staff and quick support when we needed help.',
      reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sentiment: Sentiment.POS,
      tags: ['staff', 'support'],
      status: 'APPROVED',
      replyDraft: 'Thank you for the kind words! We are glad the team could help quickly.',
      approvedReply: 'Thank you for the kind words! We are glad our team could help quickly.',
      draftedById: member.id,
      draftedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      approvedById: owner.id,
      approvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  });

  await prisma.replyGeneration.create({
    data: {
      workspaceId: workspace.id,
      reviewId: review1.id,
      createdById: member.id,
      provider: 'OPENAI',
      model: 'gpt-4o-mini',
      promptVersion: 'v1.0.0',
      length: 'medium',
      escalation: true,
      inputTokens: 310,
      outputTokens: 120,
      estimatedCostUsd: 0.000118,
      replyText: review1.replyDraft || ''
    }
  });

  await prisma.reviewAuditLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        reviewId: review1.id,
        actorId: member.id,
        action: 'REVIEW_DRAFTED',
        metadata: { provider: 'openai' }
      },
      {
        workspaceId: workspace.id,
        reviewId: review2.id,
        actorId: owner.id,
        action: 'REVIEW_APPROVED',
        metadata: { statusFrom: 'DRAFTED', statusTo: 'APPROVED' }
      }
    ]
  });

  const [premiumLocationA, premiumLocationB] = premiumWorkspace.locations;
  const premiumReview = await prisma.review.create({
    data: {
      workspaceId: premiumWorkspace.id,
      locationId: premiumLocationA.id,
      source: ReviewSource.TRUSTPILOT,
      authorName: 'Cristina V.',
      rating: 1,
      text: 'Delivery was late twice and support did not answer quickly enough.',
      reviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      sentiment: Sentiment.NEG,
      tags: ['delivery-delay', 'support-response'],
      status: 'APPROVED',
      replyDraft:
        'Thank you for this feedback. We are sorry for the repeated delays and the slow response. Please contact our premium support line so we can resolve this immediately.',
      approvedReply:
        'Thank you for this feedback. We are sorry for the repeated delays and the slow response. Please contact our premium support line so we can resolve this immediately.',
      draftedById: premiumMember.id,
      draftedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      approvedById: premiumOwner.id,
      approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
  });

  await prisma.review.create({
    data: {
      workspaceId: premiumWorkspace.id,
      locationId: premiumLocationB.id,
      source: ReviewSource.GOOGLE,
      authorName: 'Mihai N.',
      rating: 5,
      text: 'Amazing onboarding and very friendly team. We got help instantly.',
      reviewDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
      sentiment: Sentiment.POS,
      tags: ['onboarding', 'team-support'],
      status: 'DRAFTED',
      replyDraft: 'Thank you so much for the kind words. We are glad onboarding felt smooth and helpful.',
      draftedById: premiumMember.id,
      draftedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  });

  await prisma.replyGeneration.create({
    data: {
      workspaceId: premiumWorkspace.id,
      reviewId: premiumReview.id,
      createdById: premiumMember.id,
      provider: 'OPENAI',
      model: 'gpt-4o-mini',
      promptVersion: 'v1.0.0',
      length: 'medium',
      escalation: true,
      inputTokens: 422,
      outputTokens: 158,
      estimatedCostUsd: 0.000158,
      replyText: premiumReview.approvedReply || ''
    }
  });

  await prisma.reviewAuditLog.createMany({
    data: [
      {
        workspaceId: premiumWorkspace.id,
        reviewId: premiumReview.id,
        actorId: premiumMember.id,
        action: 'REVIEW_DRAFTED',
        metadata: { provider: 'openai', workspaceType: 'premium-demo' }
      },
      {
        workspaceId: premiumWorkspace.id,
        reviewId: premiumReview.id,
        actorId: premiumOwner.id,
        action: 'REVIEW_APPROVED',
        metadata: { statusFrom: 'DRAFTED', statusTo: 'APPROVED' }
      }
    ]
  });

  // Demo credentials:
  // owner@example.com / password123
  // member@example.com / password123
  // superadmin@reply-zen.com / password123
  // premium@reply-zen.com / password123
  // Sign in and visit /app
  // Then open the seeded workspace dashboard.
}

main().finally(async () => prisma.$disconnect());
