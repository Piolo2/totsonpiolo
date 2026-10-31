import { NextRequest, NextResponse } from 'next/server';
import { createMessage } from '@/lib/db';

const rateLimitMap = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const trimmed = content.trim();

    if (trimmed.length < 1 || trimmed.length > 500) {
      return NextResponse.json(
        { error: 'Message must be between 1 and 500 characters.' },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const lastSubmit = rateLimitMap.get(ip);
    const now = Date.now();

    if (lastSubmit && now - lastSubmit < 10000) {
      return NextResponse.json(
        { error: 'Please wait before sending another message.' },
        { status: 429 }
      );
    }

    rateLimitMap.set(ip, now);

    await createMessage(trimmed);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
