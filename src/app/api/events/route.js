import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/content';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const active = searchParams.get('active');

  let list = await getEvents({
    activeOnly: active === 'true',
  });
  if (category && category !== 'all') {
    list = list.filter((e) => e.category === category);
  }

  return NextResponse.json({ success: true, data: list });
}
