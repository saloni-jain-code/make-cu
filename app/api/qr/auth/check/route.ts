import { NextRequest, NextResponse } from 'next/server';

// Simple auth check - in a real implementation, this would check session/JWT
export async function GET(request: NextRequest) {
  // For now, return not authenticated
  // In a real implementation, you would check cookies/session here
  return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
}