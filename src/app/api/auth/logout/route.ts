import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, logout } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const token = getSessionFromRequest(request);
  if (token) {
    await logout(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('tots_session');

  return response;
}
