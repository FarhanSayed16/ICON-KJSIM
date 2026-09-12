import { NextResponse } from 'next/server';
import { getLiveStreamData } from '@/app/actions/liveStream';

export async function GET() {
  const result = await getLiveStreamData();
  return NextResponse.json(result);
}
