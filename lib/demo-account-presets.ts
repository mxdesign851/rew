export const DEMO_LOGIN_PASSWORD = 'password123';

type DemoRole = 'OWNER' | 'ADMIN' | 'MEMBER';
type DemoPlan = 'FREE' | 'PRO' | 'AGENCY';

type DemoAccountPreset = {
  label: string;
  email: string;
  badge: string;
  userName: string;
  isSuperAdmin: boolean;
  role: DemoRole;
  workspace: {
    slug: string;
    name: string;
    plan: DemoPlan;
  };
};

export const DEMO_ACCOUNT_PRESETS: DemoAccountPreset[] = [
  {
    label: 'Super Admin',
    email: 'superadmin@reply-zen.com',
    badge: 'GLOBAL ADMIN',
    userName: 'Super Admin',
    isSuperAdmin: true,
    role: 'ADMIN',
    workspace: {
      slug: 'replyzen-demo-premium',
      name: 'ReplyZen Premium Demo',
      plan: 'AGENCY'
    }
  },
  {
    label: 'Premium Demo Owner',
    email: 'premium@reply-zen.com',
    badge: 'AGENCY PLAN',
    userName: 'Premium Demo Owner',
    isSuperAdmin: false,
    role: 'OWNER',
    workspace: {
      slug: 'replyzen-demo-premium',
      name: 'ReplyZen Premium Demo',
      plan: 'AGENCY'
    }
  }
];

export const PUBLIC_DEMO_ACCOUNTS = DEMO_ACCOUNT_PRESETS.map((account) => ({
  label: account.label,
  email: account.email,
  password: DEMO_LOGIN_PASSWORD,
  badge: account.badge
}));
