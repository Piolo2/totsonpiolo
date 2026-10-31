import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { Redis } from '@upstash/redis';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  isArchived: boolean;
  reply: string | null;
  repliedAt: string | null;
  isPublished: boolean;
  publishedAt: string | null;
}

interface Database {
  messages: Message[];
}

const DB_PATH = join(process.cwd(), 'data', 'db.json');
const REDIS_KEY = 'tots:messages';

function getRedisClient(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

export async function getDb(): Promise<Database> {
  const redis = getRedisClient();
  if (redis) {
    try {
      const data = await redis.get<Message[]>(REDIS_KEY);
      if (Array.isArray(data)) {
        return { messages: data };
      }
      return { messages: [] };
    } catch (err) {
      console.error('Redis getDb error, falling back to local file:', err);
    }
  }

  // Local fallback
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (!existsSync(DB_PATH)) {
    const initial: Database = { messages: [] };
    writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw) as Database;
  } catch {
    return { messages: [] };
  }
}

export async function saveDb(db: Database): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.set(REDIS_KEY, db.messages);
      return;
    } catch (err) {
      console.error('Redis saveDb error:', err);
    }
  }

  // Local fallback
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export async function createMessage(content: string): Promise<Message> {
  const db = await getDb();
  const message: Message = {
    id: randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    isRead: false,
    isArchived: false,
    reply: null,
    repliedAt: null,
    isPublished: false,
    publishedAt: null,
  };
  db.messages.push(message);
  await saveDb(db);
  return message;
}

export async function getAllMessages(filter?: 'all' | 'unread' | 'replied' | 'archived'): Promise<Message[]> {
  const db = await getDb();
  let filtered: Message[];

  switch (filter) {
    case 'unread':
      filtered = db.messages.filter((m) => !m.isRead && !m.isArchived);
      break;
    case 'replied':
      filtered = db.messages.filter((m) => m.reply !== null && !m.isArchived);
      break;
    case 'archived':
      filtered = db.messages.filter((m) => m.isArchived);
      break;
    case 'all':
    default:
      filtered = db.messages.filter((m) => !m.isArchived);
      break;
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getMessage(id: string): Promise<Message | null> {
  const db = await getDb();
  return db.messages.find((m) => m.id === id) || null;
}

export async function markAsRead(id: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.isRead = true;
  await saveDb(db);
  return message;
}

export async function replyToMessage(id: string, reply: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.reply = reply;
  message.repliedAt = new Date().toISOString();
  message.isRead = true;
  await saveDb(db);
  return message;
}

export async function publishMessage(id: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.isPublished = true;
  message.publishedAt = new Date().toISOString();
  await saveDb(db);
  return message;
}

export async function unpublishMessage(id: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.isPublished = false;
  message.publishedAt = null;
  await saveDb(db);
  return message;
}

export async function archiveMessage(id: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.isArchived = true;
  await saveDb(db);
  return message;
}

export async function unarchiveMessage(id: string): Promise<Message | null> {
  const db = await getDb();
  const message = db.messages.find((m) => m.id === id);
  if (!message) return null;
  message.isArchived = false;
  await saveDb(db);
  return message;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = await getDb();
  const index = db.messages.findIndex((m) => m.id === id);
  if (index === -1) return false;
  db.messages.splice(index, 1);
  await saveDb(db);
  return true;
}

export async function getPublishedMessages(): Promise<Message[]> {
  const db = await getDb();
  return db.messages
    .filter((m) => m.isPublished && !m.isArchived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getStats(): Promise<{ total: number; unread: number; replied: number; published: number }> {
  const db = await getDb();
  const active = db.messages.filter((m) => !m.isArchived);
  return {
    total: active.length,
    unread: active.filter((m) => !m.isRead).length,
    replied: active.filter((m) => m.reply !== null).length,
    published: active.filter((m) => m.isPublished).length,
  };
}
