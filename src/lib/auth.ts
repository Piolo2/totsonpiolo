import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { Redis } from '@upstash/redis';

const ADMIN_PASSWORD = 'totsonpiolo2024';
const SESSIONS_PATH = join(process.cwd(), 'data', 'sessions.json');
const REDIS_SESSIONS_KEY = 'tots:sessions';

function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

async function getSessions(): Promise<Set<string>> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const arr = await redis.get<string[]>(REDIS_SESSIONS_KEY);
      return new Set<string>(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error('Redis getSessions error:', err);
    }
  }

  // Local fallback
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(SESSIONS_PATH)) {
    writeFileSync(SESSIONS_PATH, JSON.stringify([]), 'utf-8');
    return new Set<string>();
  }
  try {
    const raw = readFileSync(SESSIONS_PATH, 'utf-8');
    const arr = JSON.parse(raw);
    return new Set<string>(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set<string>();
  }
}

async function saveSessions(sessions: Set<string>): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_SESSIONS_KEY, Array.from(sessions));
      return;
    } catch (err) {
      console.error('Redis saveSessions error:', err);
    }
  }

  // Local fallback
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(SESSIONS_PATH, JSON.stringify(Array.from(sessions)), 'utf-8');
}

export async function login(password: string): Promise<string | null> {
  if (password !== ADMIN_PASSWORD) return null;
  const token = randomUUID();
  const sessions = await getSessions();
  sessions.add(token);
  await saveSessions(sessions);
  return token;
}

export async function logout(token: string): Promise<void> {
  const sessions = await getSessions();
  sessions.delete(token);
  await saveSessions(sessions);
}

export async function isAuthenticated(token: string): Promise<boolean> {
  if (!token) return false;
  const sessions = await getSessions();
  return sessions.has(token);
}

export function getSessionFromRequest(request: NextRequest): string | null {
  const cookie = request.cookies.get('tots_session');
  return cookie?.value || null;
}

export async function requireAuth(request: NextRequest): Promise<boolean> {
  const token = getSessionFromRequest(request);
  if (!token) return false;
  return await isAuthenticated(token);
}
