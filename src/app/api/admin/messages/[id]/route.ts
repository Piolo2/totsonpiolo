import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  getMessage,
  markAsRead,
  replyToMessage,
  publishMessage,
  unpublishMessage,
  archiveMessage,
  unarchiveMessage,
  deleteMessage,
} from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const message = await getMessage(id);

  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  await markAsRead(id);

  const updated = await getMessage(id);
  return NextResponse.json(updated);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const message = await getMessage(id);
  if (!message) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { action, reply } = body;

    let updated;

    switch (action) {
      case 'reply': {
        if (!reply || typeof reply !== 'string') {
          return NextResponse.json({ error: 'Reply content is required.' }, { status: 400 });
        }
        const trimmedReply = reply.trim();
        if (trimmedReply.length < 1 || trimmedReply.length > 1000) {
          return NextResponse.json(
            { error: 'Reply must be between 1 and 1000 characters.' },
            { status: 400 }
          );
        }
        updated = await replyToMessage(id, trimmedReply);
        break;
      }
      case 'publish':
        updated = await publishMessage(id);
        break;
      case 'unpublish':
        updated = await unpublishMessage(id);
        break;
      case 'archive':
        updated = await archiveMessage(id);
        break;
      case 'unarchive':
        updated = await unarchiveMessage(id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await deleteMessage(id);

  return NextResponse.json({ success: true });
}
