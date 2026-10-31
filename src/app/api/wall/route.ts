import { NextRequest, NextResponse } from 'next/server';
import { getPublishedMessages } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Reading request makes it dynamic per request
  const _ = request.url;
  const messages = await getPublishedMessages();
  return NextResponse.json(messages, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
