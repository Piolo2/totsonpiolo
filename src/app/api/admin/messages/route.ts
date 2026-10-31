import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getAllMessages } from '@/lib/db';

export async function GET(request: NextRequest) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filter = (searchParams.get('filter') as 'all' | 'unread' | 'replied' | 'archived') || 'all';

  const messages = await getAllMessages(filter);
  return NextResponse.json(messages, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
