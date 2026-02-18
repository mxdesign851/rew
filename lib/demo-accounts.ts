import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { sanitizeEmail } from '@/lib/sanitize';
import { DEMO_ACCOUNT_PRESETS, DEMO_LOGIN_PASSWORD } from '@/lib/demo-account-presets';
import { withPrismaRuntimeBootstrap } from '@/lib/prisma-runtime-bootstrap';

function getMonthBucket(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function ensureDemoAccountForCredentials(email: string, password: string) {
  const normalizedEmail = sanitizeEmail(email);
  const preset = DEMO_ACCOUNT_PRESETS.find((item) => item.email === normalizedEmail);
  if (!preset) return false;
  if (password !== DEMO_LOGIN_PASSWORD) return false;

  const passwordHash = await bcrypt.hash(DEMO_LOGIN_PASSWORD, 10);
  const monthBucket = getMonthBucket();

  const user = await withPrismaRuntimeBootstrap(
    () =>
      prisma.user.upsert({
        where: { email: preset.email },
        update: {
          name: preset.userName,
          hashedPassword: passwordHash,
          isSuperAdmin: preset.isSuperAdmin
        },
        create: {
          email: preset.email,
          name: preset.userName,
          hashedPassword: passwordHash,
          isSuperAdmin: preset.isSuperAdmin
        }
      }),
    'demo-user-upsert'
  );

  try {
    const workspace = await withPrismaRuntimeBootstrap(
      () =>
        prisma.workspace.upsert({
          where: { slug: preset.workspace.slug },
          update: {
            name: preset.workspace.name,
            plan: preset.workspace.plan,
            monthBucket
          },
          create: {
            slug: preset.workspace.slug,
            name: preset.workspace.name,
            plan: preset.workspace.plan,
            monthBucket
          }
        }),
      'demo-workspace-upsert'
    );

    await withPrismaRuntimeBootstrap(
      () =>
        prisma.workspaceMembership.upsert({
          where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
          update: { role: preset.role },
          create: {
            userId: user.id,
            workspaceId: workspace.id,
            role: preset.role
          }
        }),
      'demo-membership-upsert'
    );
  } catch (error) {
    // Keep login functional even if workspace bootstrap fails.
    console.warn('[demo-auth] Workspace bootstrap failed; continuing with demo user login.', error);
  }

  return true;
}
