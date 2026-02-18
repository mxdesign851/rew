import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

let ongoingBootstrap: Promise<boolean> | null = null;

function errorText(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error ?? '');
}

function errorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    const value = (error as { code?: unknown }).code;
    if (typeof value === 'string') return value;
  }
  return '';
}

function shouldAttemptRuntimeBootstrap(error: unknown) {
  const code = errorCode(error);
  if (code === 'P2021' || code === 'P2022' || code === 'P1003') {
    return true;
  }

  const message = errorText(error).toLowerCase();
  return (
    message.includes('table') && message.includes('does not exist') ||
    message.includes('relation') && message.includes('does not exist') ||
    message.includes('column') && message.includes('does not exist') ||
    message.includes('could not parse schema engine response')
  );
}

async function runPrismaMigrateDeploy(reason: string) {
  if (ongoingBootstrap) {
    return ongoingBootstrap;
  }

  ongoingBootstrap = (async () => {
    try {
      console.warn(`[db-bootstrap] Attempting runtime prisma migrate deploy (${reason}).`);
      await execFileAsync('npx', ['prisma', 'migrate', 'deploy'], {
        env: process.env,
        timeout: 120000
      });
      console.warn('[db-bootstrap] Runtime prisma migrate deploy completed.');
      return true;
    } catch (error) {
      console.error('[db-bootstrap] Runtime prisma migrate deploy failed.', error);
      return false;
    } finally {
      ongoingBootstrap = null;
    }
  })();

  return ongoingBootstrap;
}

export async function withPrismaRuntimeBootstrap<T>(operation: () => Promise<T>, reason: string) {
  try {
    return await operation();
  } catch (error) {
    if (!shouldAttemptRuntimeBootstrap(error)) {
      throw error;
    }

    const migrated = await runPrismaMigrateDeploy(reason);
    if (!migrated) {
      throw error;
    }

    return await operation();
  }
}
